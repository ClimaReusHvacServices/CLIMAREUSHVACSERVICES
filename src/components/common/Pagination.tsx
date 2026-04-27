"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function getPages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onChange(p);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => go(p as number)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
              p === page
                ? "text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={p === page ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
