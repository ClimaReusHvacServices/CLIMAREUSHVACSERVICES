"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import {
  ArrowLeft, User, MapPin, Package, CheckCircle2,
  Clock, Banknote, AlertCircle, UserCheck, Trash2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { updateOrderStatus, sendOrderMessage, claimOrderAsAdmin, clearOrderChat } from "./actions";
import { STATUS_COLORS } from "@/lib/status-colors";
import { ChatBox } from "@/components/chat/ChatBox";

const ORDER_STATUSES = [
  { value: "pendiente",   label: "Pendiente" },
  { value: "confirmada",  label: "Confirmada" },
  { value: "en_progreso", label: "En progreso" },
  { value: "completada",  label: "Completada" },
  { value: "cancelada",   label: "Cancelada" },
];

const PAYMENT_STATUSES = [
  { value: "pendiente",    label: "Pendiente" },
  { value: "pagado",       label: "Pagado" },
  { value: "fallido",      label: "Fallido" },
  { value: "reembolsado",  label: "Reembolsado" },
];

const PAYMENT_COLORS: Record<string, string> = {
  pendiente:   "bg-yellow-50 text-yellow-700",
  pagado:      "bg-green-50 text-green-700",
  fallido:     "bg-red-50 text-red-700",
  reembolsado: "bg-purple-50 text-purple-700",
};


interface Comment { id: string; content: string; createdAt: Date; author: { firstName: string; lastName: string; role: string } }
interface OrderItem { id: string; quantity: number; unitPrice: any; totalPrice: any; product: { name: string; images: string[] } | null; servicePackage: { name: string } | null }

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
  user: { firstName: string; lastName: string; email: string; phoneNumber: string | null };
  address: { street: string; city: string; state: string | null; postalCode: string; country: string };
  items: OrderItem[];
  task: { id: string; assignedToId: string | null; comments: Comment[] } | null;
}

export function OrderDetailClient({ order, locale }: { order: Order; locale: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [savingStatus, setSavingStatus] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [clearing, setClearing] = useState(false);

  async function handleStatusSave() {
    setSavingStatus(true);
    try {
      await updateOrderStatus(order.id, status, paymentStatus);
      toast.success("Estado actualizado");
      router.refresh();
    } catch {
      toast.error("Error al actualizar");
    } finally { setSavingStatus(false); }
  }


  const hasChanged = status !== order.status || paymentStatus !== order.paymentStatus;

  const noWorkerAssigned = !order.task?.assignedToId;
  const canClearChat = (order.task?.comments.length ?? 0) > 0 &&
    ((order.status === "completada" && order.paymentStatus === "pagado") || order.status === "cancelada");

  async function handleClaim() {
    setClaiming(true);
    try {
      await claimOrderAsAdmin(order.id);
      toast.success("Pedido asignado a ti");
      router.refresh();
    } catch { toast.error("Error al tomar pedido"); }
    finally { setClaiming(false); }
  }

  async function handleClearChat() {
    if (!confirm("¿Seguro que quieres borrar todos los mensajes de este chat?")) return;
    setClearing(true);
    try {
      await clearOrderChat(order.id);
      toast.success("Chat eliminado");
      router.refresh();
    } catch { toast.error("Error al eliminar chat"); }
    finally { setClearing(false); }
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
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
            Pedido: {ORDER_STATUSES.find(s => s.value === order.status)?.label ?? order.status}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${PAYMENT_COLORS[order.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
            Pago: {PAYMENT_STATUSES.find(s => s.value === order.paymentStatus)?.label ?? order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Status change */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle size={15} className="text-primary-600" />
          Gestionar estado
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px] space-y-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado del pedido</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-white"
            >
              {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px] space-y-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado de pago</label>
            <select
              value={paymentStatus}
              onChange={e => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-white"
            >
              {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button
            onClick={handleStatusSave}
            disabled={!hasChanged || savingStatus}
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40 flex items-center gap-2 shrink-0"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {savingStatus && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <CheckCircle2 size={14} />
            Guardar
          </button>
          {noWorkerAssigned && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40 flex items-center gap-2 shrink-0 bg-amber-500 hover:bg-amber-600"
            >
              {claiming && <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <UserCheck size={14} />
              Tomar pedido
            </button>
          )}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Client info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <User size={15} className="text-primary-600" />
            Información del cliente
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre</span>
              <span className="font-semibold text-gray-900">{order.user.firstName} {order.user.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-700">{order.user.email}</span>
            </div>
            {order.user.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Teléfono</span>
                <span className="font-medium text-gray-700">{order.user.phoneNumber}</span>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-700">
                <p>{order.address.street}</p>
                <p>{order.address.postalCode} {order.address.city}{order.address.state ? `, ${order.address.state}` : ""}</p>
                <p className="text-gray-400">{order.address.country}</p>
              </div>
            </div>
          </div>
          {order.scheduledDate && (
            <div className="flex items-center gap-2 text-sm pt-1">
              <Clock size={14} className="text-amber-500 shrink-0" />
              <span className="text-gray-500">Programado:</span>
              <span className="font-medium text-gray-700">{new Date(order.scheduledDate).toLocaleDateString(locale)}</span>
            </div>
          )}
          {order.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notas del cliente</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Items + financial */}
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
              <span>IVA</span><span>€{Number(order.taxAmount).toFixed(2)}</span>
            </div>
            {Number(order.shippingCost) > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Envío</span><span>€{Number(order.shippingCost).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
              <span>Total</span>
              <span className="flex items-center gap-1">
                <Banknote size={15} className="text-primary-600" />
                €{Number(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
          {order.installationRequired && (
            <div className="flex items-center gap-2 text-xs text-primary-700 bg-primary-50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={13} />
              Instalación incluida / requerida
            </div>
          )}
        </div>
      </div>

      {/* Chat */}
      <ChatBox
        orderId={order.id}
        initialComments={order.task?.comments ?? []}
        myRole="admin"
        locale={locale}
        placeholder="Escribe un mensaje al cliente o técnico..."
        onSend={content => sendOrderMessage(order.id, content)}
        headerExtra={
          canClearChat ? (
            <button
              onClick={handleClearChat}
              disabled={clearing}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
            >
              {clearing ? <div className="size-3 border border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={12} />}
              Limpiar chat
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
