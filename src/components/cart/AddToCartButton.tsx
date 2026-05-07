"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import { ShoppingCart, Check, LogIn, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";

interface Props {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  imageUrl: string | null;
  stock: number;
}

export default function AddToCartButton({ productId, name, price, originalPrice, imageUrl, stock }: Props) {
  const { addItem, items } = useCart();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";
  const [justAdded, setJustAdded] = useState(false);

  const inCart = items.some(i => i.productId === productId);
  const outOfStock = stock <= 0;

  if (role !== "" && role !== "cliente") {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-3 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500">
        <Lock size={12} className="shrink-0" />
        Solo los clientes pueden comprar
      </div>
    );
  }

  if (role === "") {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:shadow-lg"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      >
        <LogIn size={16} />
        Inicia sesión para comprar
      </Link>
    );
  }

  if (outOfStock) {
    return (
      <div className="flex items-center justify-center gap-2 w-full py-3 px-3 rounded-2xl bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed">
        Sin stock disponible
      </div>
    );
  }

  function handleAdd() {
    addItem({ productId, name, price, originalPrice, imageUrl });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  if (justAdded) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold bg-green-500"
      >
        <Check size={16} />
        ¡Añadido al carrito!
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:shadow-lg ${inCart ? "opacity-80" : ""}`}
      style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
    >
      <ShoppingCart size={16} />
      {inCart ? "Añadir otra unidad" : "Añadir al carrito"}
    </button>
  );
}
