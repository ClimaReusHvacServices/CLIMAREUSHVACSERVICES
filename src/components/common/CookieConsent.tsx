"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";

const COOKIE_KEY = "clima_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">🍪 Usamos cookies</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el uso del sitio y mostrarte contenido relevante.{" "}
            <Link href="/terms" className="text-primary-600 hover:underline font-medium">Política de cookies</Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
