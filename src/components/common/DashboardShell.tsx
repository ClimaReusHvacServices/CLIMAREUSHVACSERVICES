"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import {
  LayoutDashboard, Users, Wrench, ShoppingBag, Package,
  ClipboardList, UserCircle, Store, Menu, X,
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserAvatar } from "./UserAvatar";

const ICON_MAP = {
  LayoutDashboard, Users, Wrench, ShoppingBag, Package,
  ClipboardList, UserCircle, Store,
};
type IconName = keyof typeof ICON_MAP;

interface NavItem { href: string; iconName: IconName; label: string; }

interface NavLabels {
  adminSection: string; clienteSection: string; trabajadorSection: string;
  adminHome: string; users: string; workers: string; orders: string;
  products: string; shop: string; myOrders: string; myProfile: string; myTasks: string;
}

function buildNav(role: string, l: NavLabels): { section: string; items: NavItem[] } {
  if (role === "admin") return {
    section: l.adminSection,
    items: [
      { href: "/admin",          iconName: "LayoutDashboard", label: l.adminHome },
      { href: "/admin/users",    iconName: "Users",           label: l.users },
      { href: "/admin/workers",  iconName: "Wrench",          label: l.workers },
      { href: "/admin/orders",   iconName: "ShoppingBag",     label: l.orders },
      { href: "/admin/products", iconName: "Package",         label: l.products },
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
    items: [{ href: "/worker", iconName: "ClipboardList", label: l.myTasks }],
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
    <div className="min-h-screen" style={{ backgroundColor: "#eef0ec" }}>
      {/* Navbar */}
      <header className="shadow-md sticky top-0 z-40" style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
        <div className="max-w-full px-4 sm:px-6 h-16 flex items-center gap-3">
          {/* Hamburger – mobile only */}
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -ml-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Menu"
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="text-lg sm:text-xl font-bold text-white tracking-tight hover:text-white/80 transition-colors truncate">
            Clima HVAC Service
</Link>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
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

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-60 bg-white shadow-sm border-r border-gray-100 shrink-0">
          {sidebarNav()}
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
                <span className="text-white font-bold text-lg">Clima HVAC Service</span>
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

        <main className="flex-1 p-4 sm:p-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
