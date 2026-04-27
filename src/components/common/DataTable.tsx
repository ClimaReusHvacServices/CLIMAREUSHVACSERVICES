"use client";

import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

interface Column {
  key: string;
  label: string;
  className?: string;
  hideOn?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
  pageSize?: number;
  emptyComponent?: React.ReactNode;
  minWidth?: string;
}

export function DataTable<T>({ columns, data, renderRow, pageSize = 10, emptyComponent, minWidth = "360px" }: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);
  const from = data.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, data.length);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`w-full text-sm`} style={{ minWidth }}>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((c) => (
                <th key={c.key} className={`text-left py-3 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wider ${c.className ?? ""} ${c.hideOn === "sm" ? "hidden sm:table-cell" : c.hideOn === "md" ? "hidden md:table-cell" : c.hideOn === "lg" ? "hidden lg:table-cell" : ""}`}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-14 text-center">
                  {emptyComponent ?? <p className="text-gray-400 text-sm">No data</p>}
                </td>
              </tr>
            ) : (
              paginated.map((row: any) => renderRow(row))
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-gray-400">{from}–{to} / {data.length}</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}

export default DataTable;
