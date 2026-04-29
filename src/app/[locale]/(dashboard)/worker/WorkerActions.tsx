"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { claimOrder, markOrderComplete, releaseOrder } from "./actions";

export function ClaimButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    try {
      await claimOrder(orderId);
      toast.success("Pedido tomado. ¡A trabajar!");
      router.refresh();
    } catch { toast.error("No se pudo tomar el pedido"); }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
      style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
    >
      {loading && <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      Tomar pedido
    </button>
  );
}

export function ReleaseButton({ taskId, orderId }: { taskId: string; orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    try {
      await releaseOrder(taskId, orderId);
      toast.success("Pedido liberado");
      router.refresh();
    } catch { toast.error("Error"); }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
      title="Liberar pedido"
    >
      <RotateCcw size={14} />
    </button>
  );
}

export function CompleteButton({ taskId, orderId, userId }: { taskId: string; orderId: string; userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handle() {
    setLoading(true);
    try {
      await markOrderComplete(taskId, orderId, userId);
      toast.success("Pedido completado");
      router.refresh();
    } catch { toast.error("Error al completar"); }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="px-3 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 shrink-0"
    >
      {loading ? <div className="size-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 size={13} />}
      Completar
    </button>
  );
}
