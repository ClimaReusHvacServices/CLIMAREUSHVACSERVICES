"use client";
import { Link } from "@/i18n/routing";
import { Phone, Menu, X, LogIn, Globe, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";

const NAV_LINKS = [
  { href: "/",          label: "Inicio" },
  { href: "/#oferta",   label: "Oferta" },
  { href: "/servicios", label: "Servicios" },
  { href: "/#contact",  label: "Contacto" },
] as const;

const LOCALES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "ca", label: "CA", name: "Català" },
];

function LangPicker() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const change = (code: string) => {
    setOpen(false);
    const segs = window.location.pathname.split("/").filter(Boolean);
    const after = ["es","en","ca"].includes(segs[0]) ? segs.slice(1).join("/") : segs.join("/");
    window.location.href = `/${code}${after ? `/${after}` : ""}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-primary-700 transition-colors"
      >
        <Globe size={13} />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[60]">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => change(l.code)}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                locale === l.code ? "bg-primary-50 text-primary-700 font-bold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setLangOpen(false); }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const changeLang = (code: string) => {
    setLangOpen(false);
    const segs = window.location.pathname.split("/").filter(Boolean);
    const after = ["es","en","ca"].includes(segs[0]) ? segs.slice(1).join("/") : segs.join("/");
    window.location.href = `/${code}${after ? `/${after}` : ""}`;
  };

  return (
    <div ref={ref} className="fixed left-1/2 top-4 sm:top-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">

      {/* Pill */}
      <nav className="flex items-center bg-white/80 backdrop-blur-xl px-3 sm:px-5 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap gap-3">

        {/* Mobile: hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Mobile: brand */}
        <Link href="/" onClick={() => setOpen(false)} className="sm:hidden text-sm font-bold text-primary-800 mr-auto">
          Clima Reus
        </Link>

        {/* Desktop: nav links */}
        <div className="hidden sm:flex items-center gap-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={label} href={href as any}
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors first:font-semibold first:text-primary-800"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-200 mx-1" />

        {/* Language picker — desktop */}
        <LangPicker />

        {/* Login — desktop */}
        <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:text-white hover:bg-primary-600 px-3 py-1.5 rounded-full border border-primary-200 hover:border-primary-600 transition-all">
          <LogIn size={12} />
          Acceder
        </Link>

        <div className="hidden sm:block h-4 w-px bg-gray-200 mx-1" />

        {/* Phone — always visible */}
        <a href="tel:+34877234166" className="flex items-center gap-1.5 text-primary-700 hover:text-primary-900 transition-colors" aria-label="Llamar al 877 234 166">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 shrink-0">
            <Phone size={13} className="text-white" />
          </span>
          <span className="hidden xs:inline text-xs font-bold tracking-wide">877 234 166</span>
        </a>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={label} href={href as any} onClick={() => setOpen(false)}
              className="flex items-center px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors border-b border-gray-100/80"
            >
              {label}
            </Link>
          ))}

          {/* Idioma mobile */}
          <div className="px-5 py-3 border-b border-gray-100/80">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Idioma</p>
            <div className="flex gap-2">
              {LOCALES.map((l) => (
                <button key={l.code} onClick={() => changeLang(l.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    locale === l.code ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <Link href="/login" onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
          >
            <LogIn size={15} />
            Iniciar sesión
          </Link>
        </div>
      )}
    </div>
  );
}
