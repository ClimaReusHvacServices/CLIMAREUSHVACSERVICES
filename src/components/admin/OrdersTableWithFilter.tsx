"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { OrdersTable } from "@/components/admin/OrdersTable";

const STATUS_VALUES = ["pendiente", "confirmada", "en_progreso", "completada", "cancelada"] as const;
type StatusFilter = "all" | typeof STATUS_VALUES[number];

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

export function OrdersTableWithFilter({ orders, locale }: { orders: OrderRow[]; locale: string }) {
  const t = useTranslations("adminOrders");
  const tStatus = useTranslations("status");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      {/* Filter tabs — instant, no navigation */}
      <div className="flex flex-wrap gap-2">
        <FilterTab active={filter === "all"} label={t("filterAll")} onClick={() => setFilter("all")} />
        {STATUS_VALUES.map((s) => (
          <FilterTab
            key={s}
            active={filter === s}
            label={tStatus(s)}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      <OrdersTable orders={filtered} locale={locale} />
    </>
  );
}

function FilterTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
        active
          ? "text-white shadow-sm"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
      }`}
      style={active ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : undefined}
    >
      {label}
    </button>
  );
}
