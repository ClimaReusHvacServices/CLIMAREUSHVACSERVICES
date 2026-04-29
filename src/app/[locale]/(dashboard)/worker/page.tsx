import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { ShoppingBag, CheckCircle2, Wrench, Award, Clock } from "lucide-react";
import { ClaimButton, ReleaseButton, CompleteButton } from "./WorkerActions";

export const dynamic = "force-dynamic";

async function getWorkerData(userId: string) {
  const [trabajador, availableOrders, myOrders] = await Promise.all([
    db.trabajador.findUnique({ where: { userId } }),
    db.order.findMany({
      where: {
        status: { in: ["pendiente", "confirmada"] },
        OR: [
          { task: { is: null } },
          { task: { assignedToId: null } },
        ],
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        items: { select: { id: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.order.findMany({
      where: { task: { assignedToId: userId } },
      include: {
        user: { select: { firstName: true, lastName: true } },
        items: { select: { id: true } },
        task: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { trabajador, availableOrders, myOrders };
}

export default async function WorkerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "trabajador") redirect("/");

  const { trabajador, availableOrders, myOrders } = await getWorkerData(session.user.id);

  const active = myOrders.filter(o => o.task?.status !== "completada");
  const completed = myOrders.filter(o => o.task?.status === "completada");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: "linear-gradient(135deg, #008f65 0%, #1d7291 60%, #083a57 100%)" }}>
        <div className="px-6 py-5 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {session.user.firstName[0]}{session.user.lastName?.[0] ?? ""}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Hola, {session.user.firstName}
            </h1>
            <p className="text-white/70 text-sm flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${trabajador?.isAvailable ? "bg-green-400" : "bg-gray-300"}`} />
              {trabajador?.isAvailable ? "Disponible" : "No disponible"}
              {trabajador?.specialties && trabajador.specialties.length > 0 && (
                <span className="text-white/50 ml-2">· {trabajador.specialties.join(", ")}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div className="self-start p-2 rounded-xl text-white bg-gradient-to-br from-amber-500 to-orange-400">
              <Clock size={16} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{availableOrders.length}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Disponibles</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div className="self-start p-2 rounded-xl text-white bg-gradient-to-br from-[#1d7291] to-[#2490b5]">
              <Wrench size={16} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{active.length}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">En curso</p>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div className="self-start p-2 rounded-xl text-white bg-gradient-to-br from-[#008f65] to-[#00b37d]">
              <Award size={16} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{trabajador?.totalJobsCompleted ?? 0}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completados</p>
          </div>
        </div>
      </div>

      {/* Available orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
          style={{ background: "linear-gradient(to right, #008f6508, #1d729108)" }}>
          <ShoppingBag size={15} className="text-primary-600" />
          <h2 className="text-sm font-bold text-gray-900">Pedidos disponibles</h2>
          <span className="ml-auto text-xs text-gray-400">{availableOrders.length} esperando</span>
        </div>
        {availableOrders.length === 0 ? (
          <div className="py-10 text-center">
            <ShoppingBag size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm">No hay pedidos disponibles ahora mismo.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {availableOrders.map(order => (
              <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.user.firstName} {order.user.lastName}
                    <span className="mx-1.5 text-gray-300">·</span>
                    {order.items.length} artículo{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <ClaimButton orderId={order.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My active orders */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
            style={{ background: "linear-gradient(to right, #1d729108, #083a5708)" }}>
            <Wrench size={15} className="text-accent-600" />
            <h2 className="text-sm font-bold text-gray-900">Mis pedidos activos</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {active.map(order => (
              <div key={order.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.user.firstName} {order.user.lastName}
                    <span className="mx-1.5 text-gray-300">·</span>
                    {order.items.length} artículo{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ReleaseButton taskId={order.task?.id ?? ""} orderId={order.id} />
                  <CompleteButton taskId={order.task?.id ?? ""} orderId={order.id} userId={session.user.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-primary-600" />
            <h2 className="text-sm font-bold text-gray-900">Completados</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {completed.slice(0, 5).map(order => (
              <div key={order.id} className="px-5 py-3 flex items-center gap-3">
                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                <p className="text-sm font-medium text-gray-700">{order.orderNumber}</p>
                <p className="text-xs text-gray-400 ml-auto">{order.user.firstName} {order.user.lastName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
