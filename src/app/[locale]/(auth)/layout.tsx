import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header con selector de idioma */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div className="text-2xl font-bold text-primary-600">
          Clima Reus HVAC
        </div>
        <LanguageSwitcher />
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <p>&copy; 2026 Clima Reus HVAC. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
