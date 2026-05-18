import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClientOrdersTable } from "@/components/orders/ClientOrdersTable";

async function getClientOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: {
        select: { id: true, product: { select: { name: true } } },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

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

  const total = orders.length;
  const active = orders.filter((o) =>
    ["pendiente", "confirmada", "en_progreso"].includes(o.status)
  ).length;
  const completed = orders.filter((o) => o.status === "completada").length;

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{t("statTotal")}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1d7291]">{active}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{t("statActive")}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#008f65]">{completed}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{t("statCompleted")}</p>
        </div>
      </div>

      {/* Orders list */}
      <ClientOrdersTable orders={orders as any} locale={locale} />
    </div>
  );
}
