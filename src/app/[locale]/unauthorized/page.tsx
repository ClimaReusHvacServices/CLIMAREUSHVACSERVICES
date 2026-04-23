import { Link } from "@/i18n/routing";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f7f4" }}>
      <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-4">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h1>
        <p className="text-gray-500 mb-8">
          No tienes permisos para acceder a esta página.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
