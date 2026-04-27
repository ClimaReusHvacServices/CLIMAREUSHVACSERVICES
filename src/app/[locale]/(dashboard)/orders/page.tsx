import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipboardList } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { ClientOrdersTable } from "@/components/orders/ClientOrdersTable";

async function getClientOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: { items: { select: { id: true } } },
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

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList size={22} className="text-primary-600 shrink-0" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
        <ClientOrdersTable orders={orders as any} locale={locale} />
      </div>
    </div>
  );
}
