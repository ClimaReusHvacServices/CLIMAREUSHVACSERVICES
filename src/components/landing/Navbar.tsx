"use client";
import { Link } from "@/i18n/routing";
import { Phone, Menu, X, LogIn, Globe, ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";

const LOCALES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "ca", label: "CA", name: "Català" },
];

function switchLocale(code: string) {
  const segs = window.location.pathname.split("/").filter(Boolean);
  const knownLocales = LOCALES.map((l) => l.code);
  const after = knownLocales.includes(segs[0]) ? segs.slice(1).join("/") : segs.join("/");
  window.location.href = `/${code}${after ? `/${after}` : ""}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── Language picker ───────────────────────────────────────────────────────────
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-primary-700 transition-colors rounded-full"
        aria-label="Cambiar idioma"
      >
        <Globe size={13} />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-36 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[70]">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setOpen(false); switchLocale(l.code); }}
              className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
                locale === l.code
                  ? "bg-primary-50 text-primary-700 font-bold"
                  : "text-gray-700 hover:bg-gray-50"
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

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const t = useTranslations("landing");
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const locale = useLocale();
  const mobileRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const role = (user as any)?.role ?? "";
  const dashboardHref = role === "admin" ? "/admin" : role === "trabajador" ? "/worker" : "/dashboard";
  const roleText =
    role === "admin" ? t("navbar.roleAdmin") :
    role === "cliente" ? t("navbar.roleCliente") :
    role === "trabajador" ? t("navbar.roleTrabajador") : role;
  const u = user as any;
  const displayName = u ? (`${u.firstName ?? ""} ${u.lastName ?? ""}`).trim() || u.email || "" : "";
  const firstName = displayName.split(" ")[0];
  const initials = displayName ? getInitials(displayName) : "?";

  const NAV_LINKS = [
    { href: "/",          label: t("navbar.home") },
    { href: "/#oferta",   label: t("navbar.offer") },
    { href: "/servicios", label: t("navbar.services") },
    { href: "/#contact",  label: t("navbar.contact") },
  ] as const;

  return (
    <>
      {/* ── Centered pill ──────────────────────────────────────────────── */}
      <div ref={mobileRef} className="fixed left-1/2 top-4 sm:top-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
        <nav className="flex items-center bg-white/80 backdrop-blur-xl px-3 sm:px-5 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap gap-3">

          {/* Mobile — hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Mobile — brand */}
          <Link href="/" onClick={() => setOpen(false)} className="sm:hidden text-sm font-bold text-primary-800 mr-auto">
            Clima Reus
          </Link>

          {/* Desktop — nav links */}
          <div className="hidden sm:flex items-center gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href as any}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors first:font-semibold first:text-primary-800"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:block h-4 w-px bg-gray-200 mx-1" />

          {/* Phone — always full number */}
          <a
            href="tel:+34877234166"
            className="flex items-center gap-1.5 text-primary-700 hover:text-primary-900 transition-colors"
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
          <div className="sm:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href as any}
                onClick={() => setOpen(false)}
                className="flex items-center px-5 py-3.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors border-b border-gray-100/80"
              >
                {label}
              </Link>
            ))}

            {/* Language — mobile */}
            <div className="px-5 py-3 border-b border-gray-100/80">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Idioma</p>
              <div className="flex gap-2 flex-wrap">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      locale === l.code
                        ? "bg-primary-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn && user ? (
              <>
                <div className="px-5 py-3 bg-primary-50 border-b border-primary-100/80">
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <span className="inline-block mt-0.5 text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    {roleText}
                  </span>
                </div>
                <Link
                  href={dashboardHref as any}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors border-b border-gray-100/80"
                >
                  <LayoutDashboard size={15} />
                  {t("navbar.dashboard")}
                </Link>
                {role === "cliente" && (
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100/80"
                  >
                    <User size={15} />
                    {t("navbar.profile")}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <LogIn size={15} />
                {t("navbar.loginMobile")}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── Top-right: Lang picker + Acceder/UserMenu (desktop only) ──── */}
      <div className="fixed right-4 sm:right-6 top-4 sm:top-5 z-50 hidden sm:flex items-center gap-2">
        {/* Language pill */}
        <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-white/40">
          <LangPicker />
        </div>

        {/* Login pill or user menu */}
        {isLoggedIn && user ? (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-primary-700 bg-white/80 backdrop-blur-xl shadow-lg border border-primary-200 hover:bg-primary-50 transition-all"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
              >
                {initials}
              </div>
              <span className="max-w-[110px] truncate">{firstName}</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[70]">
                <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
                  <p className="font-semibold text-gray-900 text-sm truncate">{displayName}</p>
                  <span className="inline-block mt-0.5 text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    {roleText}
                  </span>
                </div>
                <div className="p-1">
                  <Link
                    href={dashboardHref as any}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <LayoutDashboard size={14} className="text-gray-400" />
                    {t("navbar.dashboard")}
                  </Link>
                  {role === "cliente" && (
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <User size={14} className="text-gray-400" />
                      {t("navbar.profile")}
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={14} />
                    {t("navbar.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-primary-700 bg-white/80 backdrop-blur-xl shadow-lg border border-primary-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all"
          >
            <LogIn size={12} />
            {t("navbar.login")}
          </Link>
        )}
      </div>
    </>
  );
}
