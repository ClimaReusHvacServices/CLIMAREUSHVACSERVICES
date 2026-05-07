"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";

export function CartNavIcon() {
  const { totalItems, openCart, hydrated } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-current hover:opacity-70 transition-opacity"
      aria-label="Carrito de compra"
    >
      <ShoppingCart size={20} />
      {hydrated && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
