"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";
import { X, Package, Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CartDrawer() {
  const { items, isOpen, totalItems, subtotal, taxAmount, total, removeItem, updateQty, closeCart } = useCart();
  const locale = useLocale();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen && items.length === 0) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-900">Tu carrito</h2>
            {totalItems > 0 && (
              <span className="text-xs font-bold text-white bg-primary-600 rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <ShoppingCart size={28} className="text-gray-200" />
              </div>
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-1 mb-6">Añade equipos desde el catálogo</p>
              <Link
                href="/oferta"
                onClick={closeCart}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl"
                style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex items-start gap-3 bg-gray-50/60 rounded-xl p-3">
                {/* Image */}
                <div className="w-14 h-14 rounded-lg border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Package size={20} className="text-gray-200" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-amber-600">€{fmt(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">€{fmt(item.originalPrice)}</span>
                    )}
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[32px] text-center bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <p className="text-sm font-bold text-gray-900 shrink-0">
                  €{fmt(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 shrink-0 bg-white">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>€{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>IVA (21%)</span>
                <span>€{fmt(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t border-gray-100">
                <span>Total</span>
                <span>€{fmt(total)}</span>
              </div>
            </div>
            <Link
              href={`/${locale}/checkout`}
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 hover:shadow-md"
              style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
            >
              Confirmar pedido
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
