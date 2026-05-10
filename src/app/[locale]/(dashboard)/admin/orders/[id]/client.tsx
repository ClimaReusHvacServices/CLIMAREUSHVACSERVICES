"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import {
  ArrowLeft, User, MapPin, Package, CheckCircle2,
  Clock, Banknote, AlertCircle, UserCheck, Trash2, X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { updateOrderStatus, sendOrderMessage, assignWorkerToOrder, clearOrderChat } from "./actions";
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

interface Worker { id: string; firstName: string; lastName: string }
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
  task: { id: string; assignedToId: string | null; assignedTo: { firstName: string; lastName: string } | null; comments: Comment[] } | null;
}

function generateOrderSummary(order: Order): string {
  const products = order.items
    .map(i => `• ${i.product?.name ?? i.servicePackage?.name ?? "Artículo"} ×${i.quantity} → €${Number(i.totalPrice).toFixed(2)}`)
    .join("\n");
  const client = `${order.user.firstName} ${order.user.lastName}${order.user.phoneNumber ? " · " + order.user.phoneNumber : ""}`;
  return `📋 Pedido ${order.orderNumber}:\n${products}\n\nCliente: ${client}\nTotal: €${Number(order.totalAmount).toFixed(2)} (IVA inc.)`;
}

function WorkerAssignModal({
  orderId, workers, currentWorkerId, orderSummary, onClose, onAssigned,
}: {
  orderId: string;
  workers: Worker[];
  currentWorkerId: string | null;
  orderSummary: string;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [selected, setSelected] = useState(currentWorkerId ?? workers[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [assigning, setAssigning] = useState(false);

  async function handleAssign() {
    if (!selected) { toast.error("Selecciona un técnico"); return; }
    setAssigning(true);
    try {
      await assignWorkerToOrder(orderId, selected, note || orderSummary);
      toast.success("Técnico asignado correctamente");
      onAssigned();
    } catch {
      toast.error("Error al asignar técnico");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <UserCheck size={16} className="text-primary-600" />
            Asignar técnico al pedido
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Seleccionar técnico</p>
          {workers.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">No hay técnicos activos disponibles</p>
          ) : (
            workers.map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelected(w.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selected === w.id
                    ? "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(to right, #f59e0b, #d97706)" }}
                >
                  {w.firstName[0]}{w.lastName[0]}
                </div>
                <span className="text-sm font-semibold text-gray-900 flex-1">{w.firstName} {w.lastName}</span>
                {selected === w.id && <CheckCircle2 size={15} className="text-primary-600 shrink-0" />}
              </button>
            ))
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nota para el técnico (opcional)
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={orderSummary}
            rows={4}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition"
          />
          <p className="text-[10px] text-gray-400 mt-1">Si no escribes nada, se enviará el resumen del pedido automáticamente.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAssign}
            disabled={!selected || assigning || workers.length === 0}
            className="flex-1 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-40 flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {assigning
              ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <UserCheck size={14} />}
            {assigning ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrderDetailClient({ order, locale, workers }: { order: Order; locale: string; workers: Worker[] }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [savingStatus, setSavingStatus] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
  const assignedWorker = order.task?.assignedTo ?? null;
  const canClearChat = (order.task?.comments.length ?? 0) > 0 &&
    ((order.status === "completada" && order.paymentStatus === "pagado") || order.status === "cancelada");

  async function handleClearChat() {
    setClearing(true);
    setShowClearConfirm(false);
    try {
      await clearOrderChat(order.id);
      toast.success("Chat eliminado");
      router.refresh();
    } catch { toast.error("Error al eliminar chat"); }
    finally { setClearing(false); }
  }

  return (
    <>
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">¿Limpiar chat?</h3>
              <p className="text-sm text-gray-500 mt-1">Se eliminarán todos los mensajes. Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3 w-full pt-1">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleClearChat} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-red-500 hover:bg-red-600 transition-all">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <WorkerAssignModal
          orderId={order.id}
          workers={workers}
          currentWorkerId={order.task?.assignedToId ?? null}
          orderSummary={generateOrderSummary(order)}
          onClose={() => setShowAssignModal(false)}
          onAssigned={() => { setShowAssignModal(false); router.refresh(); }}
        />
      )}

      <div className="space-y-5 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-colors">
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

        {/* Status + worker management */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={15} className="text-primary-600" />
            Gestionar estado
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado del pedido</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-white">
                {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px] space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado de pago</label>
              <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 bg-white">
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
          </div>

          {/* Worker assignment row */}
          <div className="pt-3 border-t border-gray-100">
            {assignedWorker ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "linear-gradient(to right, #f59e0b, #d97706)" }}>
                  {assignedWorker.firstName[0]}{assignedWorker.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Técnico asignado</p>
                  <p className="text-sm font-bold text-gray-900">{assignedWorker.firstName} {assignedWorker.lastName}</p>
                </div>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors shrink-0"
                >
                  Reasignar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 bg-amber-500 hover:bg-amber-600"
              >
                <UserCheck size={14} />
                Asignar técnico
              </button>
            )}
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Client info — only contact data */}
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
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">Email</span>
                <span className="font-medium text-gray-700 text-right break-all">{order.user.email}</span>
              </div>
              {order.user.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="font-medium text-gray-700">{order.user.phoneNumber}</span>
                </div>
              )}
            </div>
            {order.scheduledDate && (
              <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-100">
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

          {/* Products + pricing + installation address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Package size={15} className="text-primary-600" />
              Productos y servicios
            </h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  {item.product?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-100 bg-gray-50 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Package size={14} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name ?? item.servicePackage?.name ?? "Artículo"}</p>
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
              {Number(order.shippingCost) > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span><span>€{Number(order.shippingCost).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total <span className="text-xs font-normal text-gray-400">(IVA inc.)</span></span>
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
            {/* Installation address */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MapPin size={12} />
                Dirección de instalación
              </p>
              <div className="text-sm text-gray-700 space-y-0.5">
                <p>{order.address.street}</p>
                <p className="text-gray-500">{order.address.postalCode} {order.address.city}{order.address.state ? `, ${order.address.state}` : ""}</p>
                <p className="text-gray-400 text-xs">{order.address.country}</p>
              </div>
            </div>
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
                onClick={() => setShowClearConfirm(true)}
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
    </>
  );
}
