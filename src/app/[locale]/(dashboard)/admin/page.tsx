import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Package, Banknote, Wrench, ShoppingBag, UserCog, BarChart3 } from "lucide-react";
import { STATUS_COLORS } from "@/lib/status-colors";

async function getAdminStats() {
  const [totalUsers, totalOrders, revenueAggregate, activeWorkers] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
    db.user.count({ where: { role: "trabajador", isActive: true } }),
  ]);
  return {
    totalUsers,
    totalOrders,
    totalRevenue: Number(revenueAggregate._sum.totalAmount ?? 0),
    activeWorkers,
  };
}

async function getRecentOrders() {
  return db.order.findMany({
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const [stats, recentOrders] = await Promise.all([getAdminStats(), getRecentOrders()]);
  const t = await getTranslations("admin");
  const tStatus = await getTranslations("status");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t("welcome")}, {session.user?.firstName}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<Users size={20} className="text-primary-600" />} label={t("totalUsers")} value={stats.totalUsers} border="border-primary-500" />
        <StatCard icon={<Package size={20} className="text-accent-500" />} label={t("totalOrders")} value={stats.totalOrders} border="border-accent-400" />
        <StatCard icon={<Banknote size={20} className="text-primary-500" />} label={t("totalRevenue")} value={`€${stats.totalRevenue.toFixed(2)}`} border="border-primary-400" />
        <StatCard icon={<Wrench size={20} className="text-accent-600" />} label={t("activeWorkers")} value={stats.activeWorkers} border="border-accent-600" />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t("quickActions")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickLink href="/admin/users"   icon={<UserCog size={20} className="text-primary-600" />} label={t("manageUsers")}   desc={t("manageUsersDesc")} />
          <QuickLink href="/admin/workers" icon={<Wrench size={20} className="text-accent-500" />}   label={t("manageWorkers")} desc={t("manageWorkersDesc")} />
          <QuickLink href="/admin/orders"  icon={<ShoppingBag size={20} className="text-accent-600" />} label={t("viewOrders")}  desc={t("viewOrdersDesc")} />
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
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
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                    <ShoppingBag size={32} className="mx-auto mb-2 text-gray-200" />
                    Sin pedidos recientes
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{order.orderNumber}</td>
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
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, border }: { icon: React.ReactNode; label: string; value: string | number; border: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 sm:p-5 border-l-4 ${border}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5 truncate">{value}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg shrink-0">{icon}</div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link
      href={href as any}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
    >
      <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500 truncate">{desc}</p>
      </div>
    </Link>
  );
}
