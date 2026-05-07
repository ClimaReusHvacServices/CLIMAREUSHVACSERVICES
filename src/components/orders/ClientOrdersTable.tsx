"use client";

import { useTranslations } from "next-intl";
import { ClipboardList, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import DataTable from "@/components/common/DataTable";
import { STATUS_COLORS } from "@/lib/status-colors";

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: any;
  createdAt: Date;
  items: { id: string; product: { name: string } | null }[];
}

function orderLabel(items: OrderRow["items"]): string {
  if (items.length === 0) return "Pedido";
  const first = items[0].product?.name ?? "Producto";
  if (items.length === 1) return first;
  return `${first} + ${items.length - 1} más`;
}

export function ClientOrdersTable({ orders, locale }: { orders: OrderRow[]; locale: string }) {
  const t = useTranslations("clientOrders");
  const tStatus = useTranslations("status");
  const router = useRouter();
  const empty = (
    <div className="text-center py-16">
      <ClipboardList size={48} className="mx-auto mb-4 text-gray-200" />
      <p className="text-gray-500 font-medium">{t("noOrders")}</p>
      <p className="text-gray-400 text-sm mt-1 mb-6">{t("noOrdersDesc")}</p>
      <Link
        href="/oferta"
        className="inline-block text-white px-6 py-2.5 rounded-xl font-medium transition-colors text-sm"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      >
        {t("goToShop")}
      </Link>
    </div>
  );

  const columns = [
    { key: "number", label: t("colNumber") },
    { key: "items", label: t("colItems"), hideOn: "sm" as const },
    { key: "status", label: t("colStatus") },
    { key: "total", label: t("colTotal") },
    { key: "date", label: t("colDate"), hideOn: "md" as const },
    { key: "action", label: "" },
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      pageSize={10}
      minWidth="420px"
      emptyComponent={orders.length === 0 ? empty : undefined}
      renderRow={(order: OrderRow) => (
        <tr
          key={order.id}
          className="border-b border-gray-50 hover:bg-primary-50/40 transition-colors cursor-pointer"
          onClick={() => router.push(`/orders/${order.id}` as any)}
        >
          <td className="py-3 px-4">
            <p className="font-semibold text-gray-900 leading-tight">{orderLabel(order.items)}</p>
            <p className="text-xs text-gray-400">{order.orderNumber}</p>
          </td>
          <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{order.items.length} {t("items")}</td>
          <td className="py-3 px-4">
            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {tStatus(order.status as any)}
            </span>
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">€{Number(order.totalAmount).toFixed(2)}</td>
          <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">{new Date(order.createdAt).toLocaleDateString(locale)}</td>
          <td className="py-3 px-4">
            <ChevronRight size={14} className="text-gray-300" />
          </td>
        </tr>
      )}
    />
  );
}
