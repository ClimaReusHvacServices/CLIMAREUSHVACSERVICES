"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { ClipboardList, UserCircle, Home } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/landing/Navbar"), { ssr: false });

interface ClientShellProps {
  children: React.ReactNode;
  myOrdersLabel: string;
  myProfileLabel: string;
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((s) => !["es", "en", "ca"].includes(s));
  const page = "/" + (segments[0] ?? "");
  const isActive = page === href;

  return (
    <Link
      href={href as any}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary-50 text-primary-700 font-semibold"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className={`shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`}>{icon}</span>
      {label}
    </Link>
  );
}

export function ClientShell({ children, myOrdersLabel, myProfileLabel }: ClientShellProps) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #eef5f2 0%, #e8f0f5 50%, #eef0ec 100%)" }}>
      {/* Landing navbar at top */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="flex gap-6 items-start">

          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-52 shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Logo link to home */}
              <Link href="/" className="flex items-center justify-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <Image
                  src="/logos/horizontal-logoverde.png"
                  alt="Clima HVAC Service"
                  width={500}
                  height={500}
                  style={{ height: "54px", width: "auto", objectFit: "contain" }}
                />
              </Link>

              <nav className="p-2 space-y-0.5">
                <p className="px-3 pt-3 pb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Mi cuenta
                </p>
                <SidebarLink href="/orders"  icon={<ClipboardList size={15} />} label={myOrdersLabel} />
                <SidebarLink href="/profile" icon={<UserCircle size={15} />}    label={myProfileLabel} />
              </nav>

              <div className="px-2 pb-2">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <Home size={13} />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
