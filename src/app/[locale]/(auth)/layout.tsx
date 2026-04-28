import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0faf5 0%, #f5f7f4 50%, #eef5f1 100%)" }}>
      <header className="flex justify-between items-center px-6 py-3 border-b border-primary-100 bg-white/60 backdrop-blur-sm">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/logos/horizontal-logoverde.png"
            alt="Clima HVAC Service"
            width={500}
            height={500}
            style={{ height: "38px", width: "auto", objectFit: "contain" }}
            priority
          />
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-primary-100 py-4 text-center text-sm text-gray-500 bg-white/40">
        &copy; 2026 Clima HVAC Service. Todos los derechos reservados.
      </footer>
    </div>
  );
}
