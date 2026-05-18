"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ClipboardList, UserCircle } from "lucide-react";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/landing/Navbar"), { ssr: false });

interface ClientShellProps {
  children: React.ReactNode;
  myOrdersLabel: string;
  myProfileLabel: string;
  firstName: string;
  lastName: string;
}

function TabLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((s) => !["es", "en", "ca"].includes(s));
  const page = "/" + (segments[0] ?? "");
  const isActive = page === href;

  return (
    <Link
      href={href as any}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
        isActive
          ? "bg-white text-primary-700 shadow-md"
          : "text-white/75 hover:text-white hover:bg-white/10"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

export function ClientShell({ children, myOrdersLabel, myProfileLabel, firstName, lastName }: ClientShellProps) {
  const t = useTranslations("clientShell");
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const displayName = firstName || "Cliente";

  return (
    <div className="min-h-screen bg-[#f0f4f7]" data-logo="white">
      <Navbar />

      {/* Gradient hero header */}
      <div
        className="pt-[72px]"
        style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 55%, #008f65 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-0">
          {/* Avatar + greeting */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 border-2 border-white/30 shadow-lg"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
            >
              {initials}
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                {t("welcomeBack")}
              </p>
              <h1 className="text-white text-xl sm:text-2xl font-bold leading-tight mt-0.5">
                {t("hello", { name: displayName })} 👋
              </h1>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2">
            <TabLink href="/orders"  icon={<ClipboardList size={14} />} label={myOrdersLabel} />
            <TabLink href="/profile" icon={<UserCircle size={14} />}    label={myProfileLabel} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </div>
  );
}
