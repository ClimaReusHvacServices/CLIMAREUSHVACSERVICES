import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShoppingBag } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { OrdersTableWithFilter } from "@/components/admin/OrdersTableWithFilter";

async function getAllOrders() {
  return db.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const [orders, t] = await Promise.all([getAllOrders(), getTranslations("adminOrders")]);

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag size={22} className="text-accent-600 shrink-0" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <OrdersTableWithFilter orders={orders as any} locale={locale} />
    </div>
  );
}
