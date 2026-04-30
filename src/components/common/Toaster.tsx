"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors={false}
      closeButton
      gap={8}
      toastOptions={{
        duration: 4500,
        unstyled: false,
        style: {
          background: "white",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "14px",
          padding: "14px 16px",
          gap: "10px",
        },
        classNames: {
          title: "font-semibold text-gray-900 text-sm leading-snug",
          description: "text-gray-500 text-xs mt-0.5",
          closeButton: "bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors rounded-lg",
          icon: "mt-0.5",
        },
      }}
    />
  );
}
