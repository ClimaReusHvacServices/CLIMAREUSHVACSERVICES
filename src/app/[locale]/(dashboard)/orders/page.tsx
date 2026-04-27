import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ClipboardList } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

async function getClientOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: { items: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, string> = {
  pendiente:   "bg-yellow-100 text-yellow-800",
  confirmada:  "bg-accent-100 text-accent-700",
  en_progreso: "bg-purple-100 text-purple-700",
  completada:  "bg-primary-100 text-primary-700",
  cancelada:   "bg-red-100 text-red-700",
};

export default async function ClientOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "cliente") redirect("/");

  const orders = await getClientOrders(session.user.id);
  const t = await getTranslations("clientOrders");
  const tStatus = await getTranslations("status");

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={24} className="text-primary-600" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList size={48} className="mx-auto mb-4 text-gray-200" />
            <p className="text-gray-500 font-medium">{t("noOrders")}</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">{t("noOrdersDesc")}</p>
            <Link
              href="/dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors text-sm"
            >
              {t("goToShop")}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colNumber")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colItems")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colTotal")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colDate")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-3 text-gray-600">{order.items.length} {t("items")}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
