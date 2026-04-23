import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { UserAvatar } from "@/components/common/UserAvatar";
import { auth } from "@/auth/config";
import { Link } from "@/i18n/routing";
import {
  LayoutDashboard, Users, Wrench, ShoppingBag, Package,
  ClipboardList, UserCircle, Store,
} from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#eef0ec" }}>
      {/* Navbar */}
      <header className="bg-primary-700 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white tracking-tight hover:text-white/80 transition-colors">
            Clima Reus HVAC
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            {user && (
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                email={user.email}
                role={user.role}
              />
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-100 shrink-0">
          <nav className="p-3 space-y-0.5">
            {user?.role === "admin" && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administración</p>
                <NavLink href="/admin" icon={<LayoutDashboard size={16} />} label="Dashboard" />
                <NavLink href="/admin/users" icon={<Users size={16} />} label="Usuarios" />
                <NavLink href="/admin/workers" icon={<Wrench size={16} />} label="Trabajadores" />
                <NavLink href="/admin/orders" icon={<ShoppingBag size={16} />} label="Pedidos" />
                <NavLink href="/admin/products" icon={<Package size={16} />} label="Productos" />
              </>
            )}
            {user?.role === "cliente" && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Mi cuenta</p>
                <NavLink href="/dashboard" icon={<Store size={16} />} label="Tienda" />
                <NavLink href="/orders" icon={<ClipboardList size={16} />} label="Mis Pedidos" />
                <NavLink href="/profile" icon={<UserCircle size={16} />} label="Mi Perfil" />
              </>
            )}
            {user?.role === "trabajador" && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trabajo</p>
                <NavLink href="/worker" icon={<ClipboardList size={16} />} label="Mis Tareas" />
              </>
            )}
          </nav>
        </aside>

        <main className="flex-1 p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href as any}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium group"
    >
      <span className="text-gray-400 group-hover:text-primary-600 transition-colors">{icon}</span>
      {label}
    </Link>
  );
}
