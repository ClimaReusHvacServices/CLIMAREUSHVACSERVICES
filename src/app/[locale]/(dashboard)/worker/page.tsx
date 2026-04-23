import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";

async function getTrabajadorData(userId: string) {
  const [tasks, trabajador] = await Promise.all([
    db.task.findMany({
      where: { assignedToId: userId },
      include: { order: { select: { orderNumber: true, scheduledDate: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.trabajador.findUnique({ where: { userId } }),
  ]);
  return { tasks, trabajador };
}

const taskColors: Record<string, string> = {
  pendiente:   "bg-yellow-100 text-yellow-800",
  en_progreso: "bg-blue-100 text-blue-800",
  completada:  "bg-green-100 text-green-800",
  cancelada:   "bg-red-100 text-red-800",
};

const priorityColors: Record<string, string> = {
  baja:  "bg-gray-100 text-gray-600",
  media: "bg-orange-100 text-orange-700",
  alta:  "bg-red-100 text-red-700",
};

export default async function WorkerDashboard() {
  const session = await auth();

  if (!session || session.user?.role !== "trabajador") redirect("/");

  const { tasks, trabajador } = await getTrabajadorData(session.user.id);

  const pendientes = tasks.filter((t) => t.status === "pendiente").length;
  const enProgreso = tasks.filter((t) => t.status === "en_progreso").length;
  const completadas = tasks.filter((t) => t.status === "completada").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {session.user.firstName}
        </h1>
        <p className="text-gray-500 mt-1">
          {trabajador?.isAvailable ? "Estado: disponible" : "Estado: no disponible"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
          <p className="text-sm font-medium text-gray-500">Pendientes</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{pendientes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-400">
          <p className="text-sm font-medium text-gray-500">En progreso</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{enProgreso}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-600">
          <p className="text-sm font-medium text-gray-500">Completadas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{completadas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-400">
          <p className="text-sm font-medium text-gray-500">Trabajos totales</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {trabajador?.totalJobsCompleted ?? 0}
          </p>
        </div>
      </div>

      {/* Perfil técnico */}
      {trabajador && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mi perfil técnico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {trabajador.specialties.length > 0
                  ? trabajador.specialties.map((s) => (
                      <span key={s} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))
                  : <span className="text-gray-400 text-sm">Sin especialidades asignadas</span>}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Certificaciones</p>
              <div className="flex flex-wrap gap-2">
                {trabajador.certifications.length > 0
                  ? trabajador.certifications.map((c) => (
                      <span key={c} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {c}
                      </span>
                    ))
                  : <span className="text-gray-400 text-sm">Sin certificaciones</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tareas asignadas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Mis tareas asignadas</h2>
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">🔧</p>
            <p>No tienes tareas asignadas por ahora.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        Pedido {task.order.orderNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${taskColors[task.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {task.status.replace("_", " ")}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${priorityColors[task.priority] ?? "bg-gray-100 text-gray-600"}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                    {task.order.scheduledDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Fecha programada: {new Date(task.order.scheduledDate).toLocaleDateString("es-ES")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
