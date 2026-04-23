import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Link } from "@/i18n/routing";

async function getClienteData(userId: string) {
  const [orders, cliente] = await Promise.all([
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.cliente.findUnique({ where: { userId } }),
  ]);
  return { orders, cliente };
}

const statusColors: Record<string, string> = {
  pendiente:   "bg-yellow-100 text-yellow-800",
  confirmada:  "bg-blue-100 text-blue-800",
  en_progreso: "bg-purple-100 text-purple-800",
  completada:  "bg-green-100 text-green-800",
  cancelada:   "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pendiente:   "Pendiente",
  confirmada:  "Confirmada",
  en_progreso: "En progreso",
  completada:  "Completada",
  cancelada:   "Cancelada",
};

export default async function ClienteDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "cliente") redirect("/");

  const { orders, cliente } = await getClienteData(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {session.user.firstName}
        </h1>
        <p className="text-gray-500 mt-1">Aquí tienes el resumen de tu cuenta.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-600">
          <p className="text-sm font-medium text-gray-500">Total pedidos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{cliente?.totalOrders ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-400">
          <p className="text-sm font-medium text-gray-500">Total gastado</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            €{Number(cliente?.totalSpent ?? 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-300">
          <p className="text-sm font-medium text-gray-500">Pedidos recientes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Pedidos recientes</h2>
          <Link href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Ver todos →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p>Aún no tienes pedidos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                        {statusLabels[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">€{Number(order.totalAmount).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
