import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { History, CheckCircle2, XCircle, User, Banknote } from "lucide-react";
import { Link } from "@/i18n/routing";
import { STATUS_COLORS } from "@/lib/status-colors";

export const dynamic = "force-dynamic";

async function getWorkerHistory(userId: string) {
  return db.order.findMany({
    where: {
      status: { in: ["completada", "cancelada"] },
      task: { assignedToId: userId },
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      items: { select: { id: true } },
      task: {
        select: {
          comments: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, author: { select: { role: true } } },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

const PAYMENT_COLORS: Record<string, string> = {
  pendiente:   "bg-yellow-50 text-yellow-700",
  pagado:      "bg-green-50 text-green-700",
  fallido:     "bg-red-50 text-red-700",
  reembolsado: "bg-purple-50 text-purple-700",
};

export default async function WorkerHistorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "trabajador") redirect("/");

  const orders = await getWorkerHistory(session.user.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <History size={22} className="text-primary-600 shrink-0" />
          Mi historial
        </h1>
        <p className="text-sm text-gray-500 mt-1">Servicios que completaste o cancelaste.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <History size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm">No hay historial aún.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map(order => {
              const isCompleted = order.status === "completada";
              const myComment = order.task?.comments[0];
              return (
                <div key={order.id} className="px-5 py-4">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isCompleted
                          ? <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                          : <XCircle size={14} className="text-red-400 shrink-0" />}
                        <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${STATUS_COLORS[order.status]}`}>
                          {isCompleted ? "Completado" : "Cancelado"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${PAYMENT_COLORS[order.paymentStatus]}`}>
                          {order.paymentStatus === "pagado" ? "Cobrado" : "Sin cobrar"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <User size={11} /> {order.user.firstName} {order.user.lastName}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                          <Banknote size={11} /> €{Number(order.totalAmount).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.updatedAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                      {myComment && myComment.author.role === "trabajador" && (
                        <p className="mt-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 italic">
                          &ldquo;{myComment.content}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
