"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "14px",
        },
        classNames: {
          toast: "rounded-xl shadow-lg border",
          success: "border-primary-200 bg-primary-50 text-primary-900",
          error: "border-red-200 bg-red-50 text-red-900",
          info: "border-accent-200 bg-accent-50 text-accent-900",
          warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
        },
      }}
    />
  );
}
