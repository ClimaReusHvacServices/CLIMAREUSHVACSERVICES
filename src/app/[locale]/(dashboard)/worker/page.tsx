import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, Wrench, Award } from "lucide-react";

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
  pendiente:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  en_progreso: "bg-accent-100 text-accent-700 border-accent-200",
  completada:  "bg-primary-100 text-primary-700 border-primary-200",
  cancelada:   "bg-red-100 text-red-700 border-red-200",
};

const priorityColors: Record<string, string> = {
  baja:  "bg-gray-100 text-gray-600",
  media: "bg-orange-100 text-orange-700",
  alta:  "bg-red-100 text-red-700",
};

export default async function WorkerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "trabajador") redirect("/");

  const { tasks, trabajador } = await getTrabajadorData(session.user.id);
  const t = await getTranslations("worker");

  const pendientes = tasks.filter((t) => t.status === "pendiente").length;
  const enProgreso = tasks.filter((t) => t.status === "en_progreso").length;
  const completadas = tasks.filter((t) => t.status === "completada").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}, {session.user.firstName}</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${trabajador?.isAvailable ? "bg-primary-500" : "bg-gray-400"}`} />
          {trabajador?.isAvailable ? t("available") : t("notAvailable")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase">{t("pending")}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendientes}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-accent-400">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-accent-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase">{t("inProgress")}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{enProgreso}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-primary-500">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={16} className="text-primary-600" />
            <p className="text-xs font-semibold text-gray-500 uppercase">{t("completed")}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{completadas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-400">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} className="text-orange-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase">{t("totalCompleted")}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{trabajador?.totalJobsCompleted ?? 0}</p>
        </div>
      </div>

      {/* Perfil tecnico */}
      {trabajador && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Wrench size={16} className="text-primary-600" />
            {t("techProfile")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{t("specialties")}</p>
              <div className="flex flex-wrap gap-2">
                {trabajador.specialties.length > 0
                  ? trabajador.specialties.map((s) => (
                      <span key={s} className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))
                  : <span className="text-gray-400 text-sm">{t("noSpecialties")}</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{t("certifications")}</p>
              <div className="flex flex-wrap gap-2">
                {trabajador.certifications.length > 0
                  ? trabajador.certifications.map((c) => (
                      <span key={c} className="bg-accent-50 text-accent-700 border border-accent-200 px-3 py-1 rounded-full text-xs font-medium">{c}</span>
                    ))
                  : <span className="text-gray-400 text-sm">{t("noCertifications")}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tareas */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ClipboardList size={16} className="text-primary-600" />
          {t("assignedTasks")}
        </h2>
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <ClipboardList size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">{t("noTasks")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className={`rounded-xl p-4 border ${taskColors[task.status] ?? "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{t("order")} {task.order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${priorityColors[task.priority] ?? "bg-gray-100 text-gray-600"}`}>
                        {t("priority")}: {task.priority}
                      </span>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2">{task.description}</p>
                    {task.order.scheduledDate && (
                      <p className="text-xs opacity-60 mt-1">
                        {t("scheduled")}: {new Date(task.order.scheduledDate).toLocaleDateString(locale)}
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
