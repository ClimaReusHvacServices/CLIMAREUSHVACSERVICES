import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { auth, signOut } from "@/auth/config";
import { Link } from "@/i18n/routing";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eef0ec" }}>
      {/* Header */}
      <header className="bg-primary-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white tracking-tight">
            Clima Reus HVAC
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-primary-100 text-sm font-medium">
              {session?.user?.firstName} {session?.user?.lastName}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="px-4 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-primary-100">
          <nav className="p-4 space-y-1">
            {session?.user?.role === "admin" && (
              <>
                <p className="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wider">Administración</p>
                <Link href="/admin" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Usuarios
                </Link>
                <Link href="/admin/workers" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Trabajadores
                </Link>
                <Link href="/admin/orders" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Pedidos
                </Link>
                <Link href="/admin/products" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Productos
                </Link>
              </>
            )}
            {session?.user?.role === "cliente" && (
              <>
                <p className="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wider">Mi cuenta</p>
                <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-medium transition-colors">
                  Mi Dashboard
                </Link>
                <Link href="/orders" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Mis Pedidos
                </Link>
                <Link href="/profile" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors">
                  Mi Perfil
                </Link>
              </>
            )}
            {session?.user?.role === "trabajador" && (
              <>
                <p className="px-3 py-2 text-xs font-semibold text-primary-500 uppercase tracking-wider">Trabajo</p>
                <Link href="/worker" className="block px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-medium transition-colors">
                  Mis Tareas
                </Link>
              </>
            )}
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
