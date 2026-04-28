"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";
import { Link } from "@/i18n/routing";
import DataTable from "@/components/common/DataTable";
import { STATUS_COLORS } from "@/lib/status-colors";

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: any;
  createdAt: Date;
  items: { id: string }[];
}

export function ClientOrdersTable({ orders, locale }: { orders: OrderRow[]; locale: string }) {
  const t = useTranslations("clientOrders");
  const tStatus = useTranslations("status");
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
  ];

  return (
    <DataTable
      columns={columns}
      data={orders}
      pageSize={10}
      minWidth="420px"
      emptyComponent={orders.length === 0 ? empty : undefined}
      renderRow={(order: OrderRow) => (
        <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
          <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
          <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{order.items.length} {t("items")}</td>
          <td className="py-3 px-4">
            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
              {tStatus(order.status as any)}
            </span>
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">€{Number(order.totalAmount).toFixed(2)}</td>
          <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">{new Date(order.createdAt).toLocaleDateString(locale)}</td>
        </tr>
      )}
    />
  );
}
