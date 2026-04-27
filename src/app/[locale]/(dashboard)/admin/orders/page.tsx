import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ShoppingBag } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { BackButton } from "@/components/common/BackButton";

async function getAllOrders(statusFilter?: string) {
  return db.order.findMany({
    where: statusFilter && statusFilter !== "all" ? { status: statusFilter as OrderStatus } : undefined,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

const statusColors: Record<string, string> = {
  pendiente:   "bg-yellow-100 text-yellow-800",
  confirmada:  "bg-accent-100 text-accent-700",
  en_progreso: "bg-purple-100 text-purple-700",
  completada:  "bg-primary-100 text-primary-700",
  cancelada:   "bg-red-100 text-red-700",
};

const STATUS_VALUES: OrderStatus[] = ["pendiente", "confirmada", "en_progreso", "completada", "cancelada"];

export default async function AdminOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { locale } = await params;
  const { status = "all" } = await searchParams;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const orders = await getAllOrders(status);
  const t = await getTranslations("adminOrders");
  const tStatus = await getTranslations("status");

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag size={24} className="text-orange-500" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        <FilterTab href="/admin/orders" active={status === "all"} label={t("filterAll")} />
        {STATUS_VALUES.map((s) => (
          <FilterTab key={s} href={`/admin/orders?status=${s}`} active={status === s} label={tStatus(s)} />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colNumber")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colClient")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colItems")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colTotal")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colDate")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    <ShoppingBag size={36} className="mx-auto mb-3 text-gray-200" />
                    {t("noOrders")}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{order.user.firstName} {order.user.lastName}</p>
                      <p className="text-xs text-gray-400">{order.user.email}</p>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{order.items.length}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {tStatus(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">€{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="py-3 px-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString(locale)}
                    </td>
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

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href as any}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-primary-600 text-white shadow-sm"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}
