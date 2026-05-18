"use client";

import { useTranslations } from "next-intl";
import { ClipboardList, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { STATUS_COLORS } from "@/lib/status-colors";

interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: any;
  createdAt: Date;
  items: { id: string; product: { name: string } | null }[];
}

const STATUS_STRIP: Record<string, string> = {
  pendiente:   "#9ca3af",
  confirmada:  "#1d7291",
  en_progreso: "#f59e0b",
  completada:  "#008f65",
  cancelada:   "#e5e7eb",
};

function orderLabel(items: OrderRow["items"]): string {
  if (items.length === 0) return "Pedido";
  const first = items[0].product?.name ?? "Producto";
  if (items.length === 1) return first;
  return `${first} + ${items.length - 1} más`;
}

export function ClientOrdersTable({ orders, locale }: { orders: OrderRow[]; locale: string }) {
  const t = useTranslations("clientOrders");
  const tStatus = useTranslations("status");

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-5 shadow-sm border border-gray-100">
          <ClipboardList size={36} className="text-gray-200" />
        </div>
        <p className="text-gray-700 font-bold text-lg">{t("noOrders")}</p>
        <p className="text-gray-400 text-sm mt-1 mb-8 max-w-[240px]">{t("noOrdersDesc")}</p>
        <Link
          href="/oferta"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <ShoppingBag size={15} />
          {t("goToShop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const stripColor = STATUS_STRIP[order.status] ?? "#e5e7eb";
        const statusClass = STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600";
        const dateStr = new Date(order.createdAt).toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <Link
            key={order.id}
            href={`/orders/${order.id}` as any}
            className="relative flex items-stretch bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all block"
          >
            {/* Status color strip */}
            <div className="w-1 shrink-0" style={{ background: stripColor }} />

            <div className="flex-1 px-4 py-4 min-w-0">
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 leading-snug truncate">
                    {orderLabel(order.items)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.orderNumber}</p>
                </div>
                <span className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${statusClass}`}>
                  {tStatus(order.status as any)}
                </span>
              </div>

              {/* Bottom row */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{order.items.length} {t("items")}</span>
                  <span>·</span>
                  <span>{dateStr}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">
                    €{Number(order.totalAmount).toFixed(2)}
                  </span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
