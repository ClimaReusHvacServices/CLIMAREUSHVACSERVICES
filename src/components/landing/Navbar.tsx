"use client";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/",          label: "Inicio" },
  { href: "/#oferta",   label: "Oferta" },
  { href: "/servicios", label: "Servicios" },
  { href: "/#contact",  label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="fixed left-1/2 top-4 sm:top-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">

      {/* Pill */}
      <nav className="flex items-center bg-white/75 backdrop-blur-xl px-4 sm:px-6 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap">

        {/* Mobile: hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden mr-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Mobile: brand */}
        <Link
          href="#"
          onClick={() => setOpen(false)}
          className="sm:hidden text-sm font-bold text-primary-800 mr-auto"
        >
          Clima Reus
        </Link>

        {/* Desktop: links */}
        <div className="hidden sm:flex items-center gap-5 mr-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors first:font-semibold first:text-primary-800"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-300/60 mr-4" />

        {/* Phone — always visible */}
        <a
          href="tel:+34877234166"
          className="flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
          aria-label="Llamar al 877 234 166"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 shrink-0">
            <Phone size={13} className="text-white" />
          </span>
          <span className="text-xs font-bold tracking-wide">877 234 166</span>
        </a>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors border-b border-gray-100/80 last:border-0"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
