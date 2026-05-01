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
    <style>@keyframes shimmerScan{0%{background-position:-300% 0}100%{background-position:300% 0}}</style>
    <div style="position:relative;width:140px;height:140px;">
      <img src="/logos/logoverde.png" alt="Clima HVAC Service" style="width:140px;height:140px;object-fit:contain;display:block;" />
      <div style="position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.65) 50%,transparent 70%);background-size:300% 100%;animation:shimmerScan 1.4s ease-in-out infinite;pointer-events:none;border-radius:8px;"></div>
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

// ── Selector de idioma (escritorio) ──────────────────────────────────────────
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


// ── Componente principal Navbar ───────────────────────────────────────────────
export default function Navbar() {
  const t = useTranslations("landing");
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [logoColor, setLogoColor] = useState<"white" | "green">("white");
  const locale = useLocale();
  const pathname = usePathname();
  const mobileRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // El logo está fijo en top-1 (4px) con h-20 (80px) → su centro queda a 44px del borde superior.
    // En cada tick de scroll revisamos qué sección [data-logo] contiene esa coordenada Y.
    // Es determinista y funciona igual en ambas direcciones de scroll.
    const LOGO_Y = 44;
    let raf = 0;

    const update = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-logo]");
      if (!sections.length) { raf = 0; return; }
      let color: "white" | "green" = "white";
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= LOGO_Y && r.bottom > LOGO_Y) {
          color = (s.getAttribute("data-logo") ?? "white") as "white" | "green";
        }
      });
      setLogoColor(color);
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update(); // aplicar color correcto al montar
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;
  const role = (user as any)?.role ?? "";

  // Obtener número de pedidos activos para el badge del carrito
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

  // Etiqueta de sección dinámica para móvil (según la ruta activa)
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
      {/* ── Logo superior izquierda ────────────────────────────────────── */}
      {/* h-20 (80px) en top-1 (4px) → centro a 44px, alineado con el centro de la píldora */}
      <div className="hidden sm:block fixed left-24 top-1 z-50">
        <Link href="/" aria-label="Clima HVAC Service — inicio">
          <div className="relative h-20">
            <img
              src="/logos/logo-verde-nombre.png"
              alt="Clima HVAC Service"
              className="h-20 w-auto object-contain"
              style={{ opacity: logoColor === "green" ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
            <img
              src="/logos/logo-blanco-nombre.png"
              alt=""
              aria-hidden
              className="absolute inset-0 h-20 w-auto object-contain"
              style={{ opacity: logoColor === "white" ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
          </div>
        </Link>
      </div>

      {/* ── Píldora central de navegación ─────────────────────────────── */}
      <div ref={mobileRef} className="fixed left-1/2 top-4 sm:top-5 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto">
        <nav className="flex items-center bg-white/80 backdrop-blur-xl px-3 sm:px-5 py-2.5 rounded-full shadow-lg border border-white/40 whitespace-nowrap gap-2 sm:gap-3">

          {/* Móvil — botón hamburguesa */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden w-7 h-7 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Móvil — etiqueta de sección dinámica */}
          <Link href="/" onClick={() => setOpen(false)} className="sm:hidden text-sm font-bold text-primary-800 mr-auto">
            {mobileLabel}
          </Link>

          {/* Móvil — carrito (solo clientes) */}
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

          {/* Móvil — selector de idioma inline (3 píldoras, sin desplegable) */}
          <div className="sm:hidden flex items-center gap-0.5 shrink-0">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { if (locale !== l.code) switchLocale(l.code); }}
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                  locale === l.code
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                style={locale === l.code ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : undefined}
                aria-label={l.name}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Escritorio — enlaces de navegación */}
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
                    {t("navbar.myOrders")}
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

      {/* ── Derecha: Idioma + Carrito + Usuario/Login (solo escritorio) ─ */}
      <div className="fixed right-4 sm:right-6 top-4 sm:top-5 z-50 hidden sm:flex items-center gap-2">
        {/* Píldora de idioma */}
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
