import { Link } from "@/i18n/routing";
import { ShieldOff, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f7f4" }}>
      <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-50 rounded-full">
            <ShieldOff size={40} className="text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso denegado</h1>
        <p className="text-gray-500 mb-8">
          No tienes permisos para acceder a esta pagina.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
