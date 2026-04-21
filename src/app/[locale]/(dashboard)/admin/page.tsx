import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Link } from "@/i18n/routing";

async function getAdminStats() {
  const [totalUsers, totalOrders, revenueAggregate, activeWorkers] =
    await Promise.all([
      db.user.count(),
      db.order.count(),
      db.order.aggregate({
        _sum: { totalAmount: true },
      }),
      db.user.count({
        where: { role: "trabajador", isActive: true },
      }),
    ]);

  return {
    totalUsers,
    totalOrders,
    totalRevenue: Number(revenueAggregate._sum.totalAmount ?? 0),
    activeWorkers,
  };
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Panel de Administrador
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {session.user?.firstName}. Aquí está tu resumen de negocio.
        </p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <p className="text-gray-500 text-xs mt-4">Activos en el sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pedidos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
          <p className="text-gray-500 text-xs mt-4">En el sistema</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                €{stats.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <p className="text-gray-500 text-xs mt-4">Ingresos acumulados</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Trabajadores Activos
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeWorkers}
              </p>
            </div>
            <div className="text-3xl">🔧</div>
          </div>
          <p className="text-gray-500 text-xs mt-4">Disponibles</p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/users"
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center block"
          >
            <div className="text-2xl mb-2">👥</div>
            <p className="font-semibold text-gray-900">Gestionar Usuarios</p>
            <p className="text-sm text-gray-600">Crear, editar o eliminar</p>
          </Link>
          <Link
            href="/admin/workers"
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center block"
          >
            <div className="text-2xl mb-2">🔧</div>
            <p className="font-semibold text-gray-900">Gestionar Trabajadores</p>
            <p className="text-sm text-gray-600">Asignar tareas</p>
          </Link>
          <Link
            href="/admin/orders"
            className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center block"
          >
            <div className="text-2xl mb-2">📦</div>
            <p className="font-semibold text-gray-900">Ver Pedidos</p>
            <p className="text-sm text-gray-600">Seguimiento completo</p>
          </Link>
        </div>
      </div>

      {/* Tabla de pedidos recientes (datos de muestra) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">#001</td>
                <td className="py-3 px-4">Juan García</td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                    Pendiente
                  </span>
                </td>
                <td className="py-3 px-4">€1,250.00</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">#002</td>
                <td className="py-3 px-4">María López</td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    En Progreso
                  </span>
                </td>
                <td className="py-3 px-4">€2,100.00</td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">#003</td>
                <td className="py-3 px-4">Carlos Martínez</td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    Completada
                  </span>
                </td>
                <td className="py-3 px-4">€950.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
