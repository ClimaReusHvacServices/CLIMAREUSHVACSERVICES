"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/store/cart";
import { X, Package, Minus, Plus, Trash2, ShoppingCart, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function CartDrawer() {
  const { items, isOpen, totalItems, subtotal, total, removeItem, updateQty, closeCart } = useCart();
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
      {/* Backdrop — z-[55] so it sits above navbar (z-50) */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer — z-[60] above navbar and backdrop */}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-white" />
            <h2 className="font-bold text-white text-base">Tu carrito</h2>
            {totalItems > 0 && (
              <span className="text-xs font-bold text-primary-700 bg-white rounded-full px-2 py-0.5 min-w-[22px] text-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={17} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 shadow-inner">
                <ShoppingCart size={34} className="text-gray-200" />
              </div>
              <p className="text-gray-700 font-bold text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-1 mb-8 max-w-[220px]">Explora nuestros equipos y añade los que te interesen</p>
              <Link
                href="/oferta"
                onClick={closeCart}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
              >
                <ShoppingBag size={15} />
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.productId} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Package size={20} className="text-gray-200" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm font-bold text-primary-700">€{fmt(item.price)}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">€{fmt(item.originalPrice)}</span>
                      )}
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-sm font-bold text-gray-900 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-bold text-gray-900 shrink-0 pt-0.5">
                    €{fmt(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer — only when there are items */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4 shrink-0 bg-white">
            {/* Summary */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>{totalItems} {totalItems === 1 ? "equipo" : "equipos"}</span>
                <span>€{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total <span className="font-normal text-xs text-gray-400">(IVA inc.)</span></span>
                <span className="text-primary-700">€{fmt(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 shadow-md"
              style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
            >
              Confirmar pedido
              <ArrowRight size={15} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
