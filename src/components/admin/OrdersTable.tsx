"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ShoppingBag, ChevronRight } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import { STATUS_COLORS } from "@/lib/status-colors";

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: any;
  createdAt: Date;
  user: { firstName: string; lastName: string; email: string };
  items: { id: string }[];
}

export function OrdersTable({ orders, locale }: { orders: OrderRow[]; locale: string }) {
  const t = useTranslations("adminOrders");
  const tStatus = useTranslations("status");
  const router = useRouter();

  const empty = (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <ShoppingBag size={40} className="mx-auto mb-3 text-gray-200" />
      <p className="text-gray-400 text-sm">{t("noOrders")}</p>
    </div>
  );

  const columns = [
    { key: "number", label: t("colNumber") },
    { key: "client", label: t("colClient") },
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
      minWidth="540px"
      emptyComponent={orders.length === 0 ? empty : undefined}
      renderRow={(order: OrderRow) => (
        <tr
          key={order.id}
          className="border-b border-gray-50 hover:bg-primary-50/40 transition-colors cursor-pointer"
          onClick={() => router.push(`/admin/orders/${order.id}` as any)}
        >
          <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
          <td className="py-3 px-4">
            <p className="font-medium text-gray-900">{order.user.firstName} {order.user.lastName}</p>
            <p className="text-xs text-gray-400 hidden sm:block">{order.user.email}</p>
          </td>
          <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{order.items.length}</td>
          <td className="py-3 px-4">
            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {tStatus(order.status as any)}
            </span>
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">€{Number(order.totalAmount).toFixed(2)}</td>
          <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">{new Date(order.createdAt).toLocaleDateString(locale)}</td>
          <td className="py-3 px-4">
            <ChevronRight size={15} className="text-gray-300" />
          </td>
        </tr>
      )}
    />
  );
}
