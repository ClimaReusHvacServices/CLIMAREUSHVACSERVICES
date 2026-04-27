import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ShoppingBag } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import { BackButton } from "@/components/common/BackButton";
import { OrdersTable } from "@/components/admin/OrdersTable";

async function getAllOrders(statusFilter?: string) {
  return db.order.findMany({
    where: statusFilter && statusFilter !== "all" ? { status: statusFilter as OrderStatus } : undefined,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag size={22} className="text-accent-600 shrink-0" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterTab href="/admin/orders" active={status === "all"} label={t("filterAll")} />
        {STATUS_VALUES.map((s) => (
          <FilterTab key={s} href={`/admin/orders?status=${s}`} active={status === s} label={tStatus(s)} />
        ))}
      </div>

      <OrdersTable orders={orders as any} locale={locale} />
    </div>
  );
}

function FilterTab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href as any}
      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
        active
          ? "text-white shadow-sm"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
      style={active ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : undefined}
    >
      {label}
    </Link>
  );
}
