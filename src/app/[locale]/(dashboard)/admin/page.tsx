import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Package, Banknote, Wrench, ShoppingBag, BarChart3 } from "lucide-react";
import { STATUS_COLORS } from "@/lib/status-colors";
import Image from "next/image";
import { AutoRefresh } from "@/components/admin/AutoRefresh";

async function getAdminStats() {
  const [totalUsers, totalOrders, revenueAggregate, activeWorkers] = await Promise.all([
    db.user.count({ where: { role: "cliente" } }),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "pagado" } }),
    db.user.count({ where: { role: "trabajador", isActive: true } }),
  ]);
  return {
    totalUsers,
    totalOrders,
    totalRevenue: Number(revenueAggregate._sum.totalAmount ?? 0),
    activeWorkers,
  };
}

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

async function getOrders(page: number) {
  const [rows, total] = await Promise.all([
    db.order.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        items: {
          include: { product: { select: { name: true } } },
          take: 1,
          orderBy: { id: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.order.count(),
  ]);
  return { rows, total };
}

export default async function AdminDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageStr } = await searchParams;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);

  let stats: Awaited<ReturnType<typeof getAdminStats>>;
  let orders: Awaited<ReturnType<typeof getOrders>>["rows"];
  let total: number;
  let t: Awaited<ReturnType<typeof getTranslations<"admin">>>;
  let tStatus: Awaited<ReturnType<typeof getTranslations<"status">>>;
  let totalPages: number;
  try {
    const result = await Promise.all([getAdminStats(), getOrders(page)]);
    stats = result[0];
    orders = result[1].rows;
    total = result[1].total;
    totalPages = Math.ceil(total / PAGE_SIZE);
    t = await getTranslations("admin");
    tStatus = await getTranslations("status");
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}\n${(err as any).stack ?? ""}` : String(err);
    return (
      <div className="p-8 bg-red-50 rounded-2xl border border-red-200">
        <h2 className="text-red-700 font-bold text-lg mb-2">Error al cargar el panel (page)</h2>
        <pre className="text-red-600 text-xs whitespace-pre-wrap break-all">{msg}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AutoRefresh intervalMs={30_000} />
      {/* Banner header */}
      <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #008f65 0%, #1d7291 60%, #083a57 100%)" }}>
        <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Image
            src="/logos/logoblanco.png"
            alt="Clima HVAC Service"
            width={500} height={500}
            style={{ height: "64px", width: "auto", objectFit: "contain" }}
            priority
          />
          <div className="sm:ml-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t("title")}</h1>
            <p className="text-white/70 mt-0.5 text-sm">{t("welcome")}, <span className="text-white font-semibold">{session.user?.firstName}</span>.</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          <StatItem
            icon={<Banknote size={18} />}
            label={t("totalRevenue")}
            value={`€${stats.totalRevenue.toFixed(2)}`}
            sub="Solo pedidos pagados"
            gradient="from-[#008f65] to-[#00b37d]"
          />
          <StatItem
            icon={<Package size={18} />}
            label={t("totalOrders")}
            value={stats.totalOrders}
            gradient="from-[#1d7291] to-[#2490b5]"
          />
          <StatItem
            icon={<Users size={18} />}
            label="Clientes"
            value={stats.totalUsers}
            gradient="from-[#6366f1] to-[#8b5cf6]"
          />
          <StatItem
            icon={<Wrench size={18} />}
            label={t("activeWorkers")}
            value={stats.activeWorkers}
            gradient="from-[#d97706] to-[#f59e0b]"
          />
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-600" />
            {t("recentOrders")}
          </h2>
          <Link href="/admin/orders" className="text-xs text-accent-600 hover:text-accent-700 font-medium transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[360px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left py-3 px-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colNumber")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">{t("colClient")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-400 text-xs uppercase tracking-wider">{t("colTotal")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                    <ShoppingBag size={32} className="mx-auto mb-2 text-gray-200" />
                    Sin pedidos recientes
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/${locale}/admin/orders/${order.id}`}
                  >
                    <td className="py-3 px-3">
                      <p className="font-semibold text-gray-900 text-sm leading-tight truncate max-w-[180px]">
                        {order.items[0]?.product?.name ?? order.orderNumber}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{order.orderNumber}</p>
                    </td>
                    <td className="py-3 px-3 text-gray-700 hidden sm:table-cell">
                      {order.user.firstName} {order.user.lastName}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {tStatus(order.status as any)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">€{Number(order.totalAmount).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 pt-4 mt-2 border-t border-gray-100 flex-wrap">
            {page > 1 && (
              <Link
                href={`/admin?page=${page - 1}` as any}
                className="px-2.5 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ←
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin?page=${p}` as any}
                className={`min-w-[32px] text-center px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/admin?page=${page + 1}` as any}
                className="px-2.5 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, sub, gradient }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; gradient: string;
}) {
  return (
    <div className="p-5 sm:p-6 flex flex-col gap-3">
      <div className={`self-start p-2 rounded-xl text-white bg-gradient-to-br ${gradient}`}>{icon}</div>
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">{label}</p>
        {sub && <p className="text-xs text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
