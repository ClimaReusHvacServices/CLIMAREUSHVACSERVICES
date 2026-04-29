"use client";
import { Link } from "@/i18n/routing";
import { Phone, Menu, X, LogIn, Globe, ChevronDown, LogOut, User, LayoutDashboard, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const LOCALES = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "ca", label: "CA", name: "Català" },
];

const LOCALE_CODES = LOCALES.map((l) => l.code);

function switchLocale(code: string) {
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9999;background:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;";
  overlay.innerHTML = `
    <style>@keyframes mistRise{0%{transform:translateY(105%)}65%{transform:translateY(-35%)}100%{transform:translateY(105%)}}</style>
    <div style="position:relative;width:160px;height:160px;overflow:hidden;border-radius:16px;">
      <img src="/logos/logoverde.png" alt="Clima HVAC Service" style="width:160px;height:160px;object-fit:contain;display:block;" />
      <div style="position:absolute;bottom:0;left:-10%;width:120%;height:100%;background:linear-gradient(to top,rgba(255,255,255,1) 0%,rgba(255,255,255,0.75) 50%,rgba(255,255,255,0) 100%);animation:mistRise 1.5s cubic-bezier(0.4,0,0.2,1) infinite;pointer-events:none;"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  const segs = window.location.pathname.split("/").filter(Boolean);
  const after = LOCALE_CODES.includes(segs[0]) ? segs.slice(1).join("/") : segs.join("/");
  window.location.href = `/${code}${after ? `/${after}` : ""}`;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── Desktop lang picker ───────────────────────────────────────────────────────
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

// ── Compact mobile lang picker (shown inline in pill) ─────────────────────────
function MobileLangPicker() {
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
    <div ref={ref} className="relative sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Idioma"
      >
        <Globe size={11} />
        <span>{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-28 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[70]">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setOpen(false); switchLocale(l.code); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
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

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const t = useTranslations("landing");
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const locale = useLocale();
  const pathname = usePathname();
  const mobileRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const role = (user as any)?.role ?? "";

  // Fetch order count for cart badge
  useEffect(() => {
    if (!isLoggedIn || role !== "cliente") return;
    fetch("/api/orders/count")
      .then((r) => r.json())
      .then((d) => setOrderCount(d.count ?? 0))
      .catch(() => {});
  }, [isLoggedIn, role]);

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

  const dashboardHref = role === "admin" ? "/admin" : role === "trabajador" ? "/worker" : "/dashboard";
  const roleText =
    role === "admin" ? t("navbar.roleAdmin") :
    role === "cliente" ? t("navbar.roleCliente") :
    role === "trabajador" ? t("navbar.roleTrabajador") : role;
  const u = user as any;
  const displayName = u ? (`${u.firstName ?? ""} ${u.lastName ?? ""}`).trim() || u.email || "" : "";
  const firstName = displayName.split(" ")[0];
  const initials = displayName ? getInitials(displayName) : "?";

  // Page-aware mobile brand label
  function getMobileLabel(): string {
    const segs = pathname.split("/").filter((s) => !LOCALE_CODES.includes(s));
    const section = segs[0] ?? "";
    const sub = segs[1] ?? "";
    if (!section) return "Clima HVAC";
    if (section === "oferta") return t("navbar.offer");
    if (section === "servicios") {
      if (!sub) return t("navbar.services");
      return sub.charAt(0).toUpperCase() + sub.slice(1);
    }
    if (section === "dashboard") return t("navbar.dashboard");
    if (section === "admin") return "Admin";
    if (section === "worker") return t("navbar.roleTrabajador");
    if (section === "profile") return t("navbar.profile");
    if (section === "orders") return t("navbar.myOrders") ?? "Pedidos";
    return "Clima HVAC";
  }
  const mobileLabel = getMobileLabel();

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
        <nav className="flex items-center bg-white/80 backdrop-blur-xl px-3 sm:px-5 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap gap-2 sm:gap-3">

          {/* Mobile — hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Mobile — page-aware brand label */}
          <Link href="/" onClick={() => setOpen(false)} className="sm:hidden text-sm font-bold text-primary-800 mr-auto">
            {mobileLabel}
          </Link>

          {/* Mobile — cart (always visible, clients only) */}
          {isLoggedIn && role === "cliente" && (
            <Link
              href="/orders"
              className="sm:hidden relative flex items-center justify-center w-7 h-7 rounded-full text-primary-700 hover:bg-primary-50 transition-colors shrink-0"
              aria-label="Mis pedidos"
            >
              <ShoppingCart size={15} />
              {orderCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 bg-primary-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {orderCount > 9 ? "9+" : orderCount}
                </span>
              )}
            </Link>
          )}

          {/* Mobile — lang picker (always visible) */}
          <MobileLangPicker />

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

          {/* Phone */}
          <a
            href="tel:+34877234166"
            className="flex items-center gap-1.5 text-primary-700 hover:text-primary-900 transition-colors"
            aria-label="Llamar al 877 234 166"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-500 shrink-0">
              <Phone size={13} className="text-white" />
            </span>
            <span className="text-xs font-bold tracking-wide hidden xs:inline sm:inline">877 234 166</span>
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

            {isLoggedIn && user ? (
              <>
                <div className="px-5 py-3 bg-primary-50 border-b border-primary-100/80">
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <span className="inline-block mt-0.5 text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                    {roleText}
                  </span>
                </div>
                {role !== "cliente" && (
                  <Link
                    href={dashboardHref as any}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors border-b border-gray-100/80"
                  >
                    <LayoutDashboard size={15} />
                    {t("navbar.dashboard")}
                  </Link>
                )}
                {role === "cliente" && (
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors border-b border-gray-100/80"
                  >
                    <ShoppingCart size={15} />
                    Mis pedidos
                  </Link>
                )}
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

      {/* ── Top-right: Lang + Cart + User/Login (desktop only) ───────── */}
      <div className="fixed right-4 sm:right-6 top-4 sm:top-5 z-50 hidden sm:flex items-center gap-2">
        {/* Language pill */}
        <div className="bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-white/40">
          <LangPicker />
        </div>

        {/* Cart — clients only (desktop) */}
        {isLoggedIn && role === "cliente" && (
          <Link
            href="/orders"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-xl shadow-lg border border-white/40 text-primary-700 hover:bg-primary-50 hover:border-primary-200 transition-all"
            aria-label="Mis pedidos"
          >
            <ShoppingCart size={16} />
            {orderCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {orderCount > 9 ? "9+" : orderCount}
              </span>
            )}
          </Link>
        )}

        {/* User menu or Login */}
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
                  {role !== "cliente" && (
                    <Link
                      href={dashboardHref as any}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <LayoutDashboard size={14} className="text-gray-400" />
                      {t("navbar.dashboard")}
                    </Link>
                  )}
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
