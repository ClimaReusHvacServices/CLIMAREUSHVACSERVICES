"use client";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed left-1/2 top-6 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full shadow-md border border-white/30">
        <Link href="#" className="text-sm font-medium text-primary-800 hover:underline">
          Inicio
        </Link>
        <Link href="#oferta" className="text-sm font-medium text-gray-800/90">
          Oferta
        </Link>
        <Link href="#servicios" className="text-sm font-medium text-gray-800/90">
          Servicios
        </Link>
        <Link href="#testimonios" className="text-sm font-medium text-gray-800/90">
          Testimonios
        </Link>
        <Link href="#blog" className="text-sm font-medium text-gray-800/90">
          Blog
        </Link>
      </div>
    </nav>
  );
}
