import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { auth, signOut } from "@/auth/config";
import { Link } from "@/i18n/routing";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">
            Clima Reus HVAC
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-sm text-gray-700">
              {session?.user?.firstName} {session?.user?.lastName}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            {session?.user?.role === "admin" && (
              <>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Usuarios
                </Link>
                <Link
                  href="/admin/workers"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Trabajadores
                </Link>
                <Link
                  href="/admin/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Pedidos
                </Link>
                <Link
                  href="/admin/products"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Productos
                </Link>
              </>
            )}
            {session?.user?.role === "cliente" && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                >
                  Mi Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Mis Pedidos
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  Mi Perfil
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Área de contenido */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
