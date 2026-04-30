import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Link } from "@/i18n/routing";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 55%, #008f65 100%)" }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #ffffff, transparent 60%)" }}
      />

      {/* Language switcher */}
      <div className="absolute top-5 right-5 sm:right-8 z-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <LanguageSwitcher variant="dark" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        {/* Logo */}
        <Link href="/" className="mb-8 sm:mb-10 hover:opacity-90 transition-opacity block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-blanco-nombre.png"
            alt="Clima HVAC Service"
            className="h-20 sm:h-24 w-auto object-contain drop-shadow-2xl"
          />
        </Link>

        {/* Form card */}
        {children}
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-white/30 shrink-0">
        &copy; 2026 Clima HVAC Service
      </div>
    </div>
  );
}
