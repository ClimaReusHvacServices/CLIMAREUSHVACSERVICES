"use client";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-4 sm:top-6 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
      <div className="flex items-center gap-3 sm:gap-5 bg-white/65 backdrop-blur-xl px-4 sm:px-6 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap">
        <Link href="#" className="text-sm font-semibold text-primary-800 hover:text-primary-600 transition-colors">
          Inicio
        </Link>
        <Link href="#oferta" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors hidden sm:block">
          Oferta
        </Link>
        <Link href="#servicios" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors hidden sm:block">
          Servicios
        </Link>
        <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors hidden md:block">
          Contacto
        </Link>

        <div className="h-4 w-px bg-gray-300/70 mx-1" />

        <a
          href="tel:+34877234166"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
          aria-label="Llamar al 877 234 166"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 ring-1 ring-primary-200">
            <Phone size={10} className="text-primary-600" />
          </span>
          <span className="hidden sm:inline text-xs tracking-wide">877 234 166</span>
        </a>
      </div>
    </nav>
  );
}
