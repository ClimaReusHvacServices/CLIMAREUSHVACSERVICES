"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard, Users, Wrench, ShoppingBag, Package,
  ClipboardList, UserCircle, Store, Menu, X, History,
} from "lucide-react";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserAvatar } from "./UserAvatar";

const ICON_MAP = {
  LayoutDashboard, Users, Wrench, ShoppingBag, Package,
  ClipboardList, UserCircle, Store, History,
};
type IconName = keyof typeof ICON_MAP;

interface NavItem { href: string; iconName: IconName; label: string; }

interface NavLabels {
  adminSection: string; clienteSection: string; trabajadorSection: string;
  adminHome: string; users: string; workers: string; orders: string;
  products: string; shop: string; myOrders: string; myProfile: string; myTasks: string;
  historial?: string;
}

function buildNav(role: string, l: NavLabels): { section: string; items: NavItem[] } {
  if (role === "admin") return {
    section: l.adminSection,
    items: [
      { href: "/admin",            iconName: "LayoutDashboard", label: l.adminHome },
      { href: "/admin/users",      iconName: "Users",           label: l.users },
      { href: "/admin/workers",    iconName: "Wrench",          label: l.workers },
      { href: "/admin/orders",     iconName: "ShoppingBag",     label: l.orders },
      { href: "/admin/products",   iconName: "Package",         label: l.products },
      { href: "/admin/historial",  iconName: "History",         label: l.historial ?? "Historial" },
    ],
  };
  if (role === "cliente") return {
    section: l.clienteSection,
    items: [
      { href: "/orders",  iconName: "ClipboardList", label: l.myOrders },
      { href: "/profile", iconName: "UserCircle",    label: l.myProfile },
    ],
  };
  return {
    section: l.trabajadorSection,
    items: [
      { href: "/worker",           iconName: "ClipboardList", label: l.myTasks },
      { href: "/worker/historial", iconName: "History",       label: l.historial ?? "Historial" },
    ],
  };
}

function NavLink({ href, icon, label, onClick }: {
  href: string; icon: React.ReactNode; label: string; onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href as any}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
        isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
      }`}
    >
      <span className={`transition-colors shrink-0 ${isActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-600"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function DashboardShell({
  children,
  user,
  navLabels,
}: {
  children: React.ReactNode;
  user: { firstName: string; lastName: string; email?: string | null; role: string };
  navLabels: NavLabels;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const { section, items } = buildNav(user.role, navLabels);

  const sidebarNav = (onClickItem?: () => void) => (
    <nav className="p-3 space-y-0.5">
      <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{section}</p>
      {items.map(({ href, iconName, label }) => {
        const Icon = ICON_MAP[iconName];
        return <NavLink key={href} href={href} icon={<Icon size={16} />} label={label} onClick={onClickItem} />;
      })}
    </nav>
  );

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #eef5f2 0%, #e8f0f5 50%, #eef0ec 100%)" }}>
      {/* Floating pill header */}
      <header className="fixed top-3 left-3 right-3 z-40">
        <div
          className="flex items-center px-4 sm:px-5 h-14 rounded-2xl shadow-lg gap-3"
          style={{
            background: "linear-gradient(to right, rgba(0,143,101,0.97), rgba(29,114,145,0.97))",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors shrink-0"
            aria-label="Menu"
          >
            <Menu size={18} />
          </button>
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" title="Ir a página principal">
            <Image
              src="/logos/logo-blanco-nombre.png"
              alt="Clima HVAC Service"
              width={500}
              height={500}
              style={{ height: "46px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <LanguageSwitcher variant="dark" />
            <UserAvatar
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email ?? ""}
              role={user.role}
            />
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-white shadow-sm border-r border-gray-100 shrink-0" style={{ minHeight: "100vh" }}>
          <div className="h-[80px] shrink-0" />
          <div className="flex-1">{sidebarNav()}</div>
        </aside>

        {/* Mobile overlay + drawer */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col">
              <div
                className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0"
                style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
              >
                <Image src="/logos/logo-blanco-nombre.png" alt="Clima HVAC Service" width={500} height={500} style={{ height: "36px", width: "auto", objectFit: "contain" }} />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">{sidebarNav(() => setOpen(false))}</div>
            </aside>
          </>
        )}

        <main className="flex-1 min-w-0 overflow-x-hidden px-4 sm:px-6 pb-6" style={{ paddingTop: "88px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
