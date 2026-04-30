"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft, Package, MapPin, Clock,
  Banknote, CheckCircle2, Wrench,
} from "lucide-react";
import { sendClientMessage } from "./actions";
import { ChatBox } from "@/components/chat/ChatBox";
import { STATUS_COLORS } from "@/lib/status-colors";

const STATUS_LABELS: Record<string, string> = {
  pendiente:   "Pendiente",
  confirmada:  "Confirmada",
  en_progreso: "En progreso",
  completada:  "Completada",
  cancelada:   "Cancelada",
};

const PAYMENT_COLORS: Record<string, string> = {
  pendiente:   "bg-yellow-50 text-yellow-700",
  pagado:      "bg-green-50 text-green-700",
  fallido:     "bg-red-50 text-red-700",
  reembolsado: "bg-purple-50 text-purple-700",
};

const PAYMENT_LABELS: Record<string, string> = {
  pendiente:   "Pago pendiente",
  pagado:      "Pagado",
  fallido:     "Fallido",
  reembolsado: "Reembolsado",
};

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: { firstName: string; lastName: string; role: string };
}
interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: any;
  totalPrice: any;
  product: { name: string; images: string[] } | null;
  servicePackage: { name: string } | null;
}
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: any;
  taxAmount: any;
  shippingCost: any;
  totalAmount: any;
  notes: string | null;
  scheduledDate: Date | null;
  installationRequired: boolean;
  createdAt: Date;
  address: { street: string; city: string; state: string | null; postalCode: string; country: string };
  items: OrderItem[];
  task: {
    id: string;
    assignedTo: { firstName: string; lastName: string } | null;
    comments: Comment[];
  } | null;
}

export function ClientOrderDetailClient({ order, locale }: { order: Order; locale: string }) {
  const router = useRouter();
  const workerName = order.task?.assignedTo
    ? `${order.task.assignedTo.firstName} ${order.task.assignedTo.lastName}`
    : null;

  const canChat = order.status !== "cancelada";

  useEffect(() => {
    if (order.status === "completada" || order.status === "cancelada") return;
    const id = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(id);
  }, [order.status, router]);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/orders"
          className="p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
        >
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString(locale)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PAYMENT_COLORS[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
            {PAYMENT_LABELS[order.paymentStatus] ?? order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Status banner */}
      {order.status === "pendiente" && !order.task?.assignedTo && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Esperando técnico</p>
            <p className="text-xs text-amber-600 mt-0.5">Tu solicitud está en espera de que un técnico la acepte. Puedes escribir un mensaje mientras tanto.</p>
          </div>
        </div>
      )}
      {workerName && order.status === "en_progreso" && (
        <div className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: "linear-gradient(to right, #008f6510, #1d729110)", border: "1px solid #008f6530" }}>
          <Wrench size={16} className="text-primary-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-800">Técnico asignado: {workerName}</p>
            <p className="text-xs text-primary-600 mt-0.5">Puedes comunicarte con tu técnico en el chat de abajo.</p>
          </div>
        </div>
      )}
      {order.status === "completada" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3">
          <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Servicio completado</p>
            <p className="text-xs text-green-600 mt-0.5">
              {order.paymentStatus === "pagado" ? "El pago ha sido confirmado. ¡Gracias por confiar en nosotros!" : "Pendiente de confirmación de pago."}
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Package size={15} className="text-primary-600" />
          Productos y servicios
        </h2>
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              {item.product?.images?.[0] ? (
                <img src={item.product.images[0]} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product?.name ?? item.servicePackage?.name ?? "Artículo"}
                </p>
                <p className="text-xs text-gray-400">×{item.quantity} · €{Number(item.unitPrice).toFixed(2)} c/u</p>
              </div>
              <span className="text-sm font-semibold text-gray-900 shrink-0">€{Number(item.totalPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-gray-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>€{Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>IVA (21%)</span><span>€{Number(order.taxAmount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
            <span>Total</span>
            <span className="flex items-center gap-1">
              <Banknote size={15} className="text-primary-600" />
              €{Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>
        {order.address && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500">
                {order.address.street}, {order.address.postalCode} {order.address.city}
                {order.scheduledDate && (
                  <span className="ml-2 text-amber-600 font-medium">
                    · {new Date(order.scheduledDate).toLocaleDateString(locale)}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
        {order.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tus notas</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Chat */}
      <ChatBox
        orderId={order.id}
        initialComments={order.task?.comments ?? []}
        myRole="cliente"
        locale={locale}
        disabled={!canChat}
        placeholder={order.task?.assignedTo ? "Escribe un mensaje al técnico..." : "Escribe tu consulta o dudas sobre el servicio..."}
        onSend={content => sendClientMessage(order.id, content)}
      />
    </div>
  );
}
