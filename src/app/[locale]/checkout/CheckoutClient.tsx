"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/store/cart";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { ShoppingCart, Package, MapPin, ArrowRight, ArrowLeft, Trash2 } from "lucide-react";
import { createOrder } from "./actions";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

interface Address {
  street: string;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CheckoutClient({ address }: { address: Address | null }) {
  const { items, subtotal, taxAmount, total, clearCart, removeItem } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (items.length === 0 && !done) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart size={28} className="text-gray-200" />
        </div>
        <p className="text-gray-500 font-medium text-lg">Tu carrito está vacío</p>
        <p className="text-gray-400 text-sm mt-1 mb-6">Añade equipos desde el catálogo antes de continuar.</p>
        <Link
          href="/oferta"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          ← Ir al catálogo
        </Link>
      </div>
    );
  }

  function handleConfirm() {
    startTransition(async () => {
      try {
        const { orderId } = await createOrder(
          items.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity }))
        );
        clearCart();
        setDone(true);
        router.push(`/orders/${orderId}` as any);
      } catch (e: any) {
        toast.error(e?.message === "Unauthorized"
          ? "Inicia sesión para completar tu pedido"
          : "Error al procesar el pedido. Inténtalo de nuevo."
        );
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/oferta" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <ArrowLeft size={16} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Confirmar pedido</h1>
          <p className="text-sm text-gray-400">{items.reduce((s, i) => s + i.quantity, 0)} producto(s) en tu carrito</p>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Package size={15} className="text-primary-600" />
            Equipos solicitados
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {items.map(item => (
            <div key={item.productId} className="flex items-center gap-3 px-5 py-4">
              <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <Package size={18} className="text-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  €{fmt(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="font-bold text-gray-900">€{fmt(item.price * item.quantity)}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      {address && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-2">
            <MapPin size={15} className="text-primary-600" />
            Dirección de instalación
          </h2>
          <p className="text-sm text-gray-600">{address.street}</p>
          <p className="text-sm text-gray-500">{address.city}{address.state ? `, ${address.state}` : ""}, {address.postalCode}</p>
          <p className="text-xs text-gray-400 mt-1">{address.country}</p>
        </div>
      )}

      {/* Totals */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span>
          <span>€{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>IVA (21%)</span>
          <span>€{fmt(taxAmount)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Envío / desplazamiento</span>
          <span className="text-primary-600 font-medium">Incluido</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
          <span>Total</span>
          <span>€{fmt(total)}</span>
        </div>
      </div>

      {/* Confirm */}
      <button
        onClick={handleConfirm}
        disabled={isPending || items.length === 0}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      >
        {isPending ? (
          <>
            <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <ArrowRight size={18} />
            Confirmar y solicitar instalación
          </>
        )}
      </button>
      <p className="text-xs text-center text-gray-400">
        Al confirmar, un técnico revisará tu pedido y se pondrá en contacto contigo para coordinar la instalación.
      </p>
    </div>
  );
}
