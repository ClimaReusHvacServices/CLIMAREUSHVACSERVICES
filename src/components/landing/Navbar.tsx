"use client";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-4 sm:top-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
      <div className="flex items-center bg-white/70 backdrop-blur-xl px-4 sm:px-6 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap">

        {/* Mobile: brand name */}
        <Link href="#" className="sm:hidden text-sm font-bold text-primary-800 mr-auto">
          Clima Reus
        </Link>

        {/* Desktop: nav links */}
        <div className="hidden sm:flex items-center gap-5 mr-4">
          <Link href="#" className="text-sm font-semibold text-primary-800 hover:text-primary-600 transition-colors">
            Inicio
          </Link>
          <Link href="#oferta" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
            Oferta
          </Link>
          <Link href="#servicios" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
            Servicios
          </Link>
          <Link href="#contact" className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
            Contacto
          </Link>
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-300/70 mr-4" />

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
      </div>
    </nav>
  );
}
