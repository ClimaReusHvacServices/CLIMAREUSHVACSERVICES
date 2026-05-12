"use client";

import { useRef, useState } from "react";
import { Wind, CheckCircle2, ShoppingCart, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/cart";
import { waOfertaProduct } from "@/lib/whatsapp";

interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string | null;
  price: number;
  discountPrice: number | null;
  warranty: string | null;
  stock: number;
  stockStatus: string | null;
  images: string[];
}

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const WA_SVG = (
  <svg viewBox="0 0 448 512" className="w-3.5 h-3.5 fill-white shrink-0">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

function AddToCartInline({ product }: { product: ProductItem }) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const inCart = items.some(i => i.productId === product.id);

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, name: product.name, price: displayPrice, originalPrice: product.price, imageUrl: product.images?.[0] ?? null });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <button
      onClick={handle}
      className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all ${justAdded ? "bg-green-500" : "hover:opacity-90"}`}
      style={justAdded ? {} : { background: "linear-gradient(to right, #008f65, #1d7291)" }}
    >
      {justAdded ? <><Check size={14} />¡Añadido!</> : <><ShoppingCart size={14} />{inCart ? "Añadir otra" : "Añadir al carrito"}</>}
    </button>
  );
}

function LoginToCartButton() {
  return (
    <Link
      href="/login"
      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
      style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <ShoppingCart size={14} /> Iniciar sesión para comprar
    </Link>
  );
}

function WaProductButton({ product, label }: { product: ProductItem; label: string }) {
  return (
    <a
      href={waOfertaProduct(product.name)}
      target="_blank"
      rel="noreferrer"
      onClick={e => e.stopPropagation()}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
      style={{ background: "linear-gradient(to right, #25D366, #128C7E)" }}
    >
      {WA_SVG} {label}
    </a>
  );
}

function PrimaryWaButton({ product, label }: { product: ProductItem; label: string }) {
  return (
    <a
      href={waOfertaProduct(product.name)}
      target="_blank"
      rel="noreferrer"
      onClick={e => e.stopPropagation()}
      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
      style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
    >
      <ShoppingCart size={14} /> {label}
    </a>
  );
}

function ProductCard({ product, userRole = null, t }: { product: ProductItem; userRole?: string | null; t: (k: string) => string }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="relative group bg-[#f5f2eb] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full">
      <Link href={`/producto/${product.id}`} className="flex flex-col flex-1">
        {hasDiscount && (
          <div className="absolute left-4 top-4 z-20">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-1.5 rounded-full shadow-md" style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
              <CheckCircle2 size={11} className="shrink-0" />
              {savingsPct}% {t("products.discountLabel")}
            </span>
          </div>
        )}

        <div className="mx-4 h-44 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex flex-col items-center justify-center gap-2 overflow-hidden border border-gray-100/60">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
          ) : (
            <>
              <Wind size={56} strokeWidth={0.8} className="text-gray-300" />
              <p className="text-[11px] text-gray-300 font-medium">{t("products.cardImageSoon")}</p>
            </>
          )}
        </div>

        <div className="px-5 pt-4 pb-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-xl leading-tight tracking-tight group-hover:text-accent-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 font-medium text-sm mt-0.5">{product.category}</p>
          {product.manufacturer && (
            <p className="text-gray-400 text-sm">{product.manufacturer}</p>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-bold" style={{ color: "#d97706" }}>
                {formatPrice(displayPrice)} €
              </span>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-lg font-medium">
                  {formatPrice(product.price)} €
                </span>
              )}
            </div>
            <p className="text-primary-600 text-xs font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={12} />
              {t("products.cardInstall")}
            </p>
          </div>
        </div>
      </Link>

      {/* CTA — outside Link so clicks don't navigate */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {userRole === "cliente"
          ? <AddToCartInline product={product} />
          : userRole === null
            ? <LoginToCartButton />
            : <PrimaryWaButton product={product} label="Solicitar presupuesto" />
        }
        <WaProductButton product={product} label="Consultar por WhatsApp" />
      </div>
    </div>
  );
}

export function ProductsSection({ products, userRole = null }: { products: ProductItem[]; userRole?: string | null }) {
  const t = useTranslations("landing");
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const didDrag = useRef(false);

  function onMouseDown(e: React.MouseEvent) {
    if (!trackRef.current) return;
    isDragging.current = true;
    didDrag.current = false;
    startX.current = e.pageX;
    scrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
    trackRef.current.style.userSelect = "none";
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current || !trackRef.current) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 4) didDrag.current = true;
    trackRef.current.scrollLeft = scrollStart.current - delta;
  }

  function stopDrag() {
    isDragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
      trackRef.current.style.userSelect = "";
    }
  }

  function onClickCapture(e: React.MouseEvent) {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.current = false;
    }
  }

  return (
    <section id="oferta" style={{ background: "linear-gradient(135deg, #0b5f86 0%, #1d7291 45%, #083a57 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-accent-300 mb-3">
            {t("products.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {t("products.title")}
          </h2>
          <p className="mt-3 text-accent-200 text-base sm:text-lg max-w-2xl mx-auto">
            {t("products.subtitle")}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <Wind size={56} strokeWidth={0.8} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/40 text-lg font-medium">{t("products.emptyTitle")}</p>
            <p className="text-white/30 text-sm mt-1">{t("products.emptyDesc")}</p>
          </div>
        ) : (
          <div className="relative">
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto cursor-grab pb-3"
              style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={stopDrag}
              onMouseLeave={stopDrag}
              onClickCapture={onClickCapture}
            >
              {products.map((p) => (
                <div
                  key={p.id}
                  className="shrink-0 w-[280px] sm:w-[300px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <ProductCard product={p} userRole={userRole} t={t as any} />
                </div>
              ))}
            </div>
            {/* Subtle right-edge fade */}
            <div
              className="absolute top-0 right-0 h-full w-16 pointer-events-none"
              style={{ background: "linear-gradient(to right, transparent, rgba(8,58,87,0.75))" }}
            />
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/oferta"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all"
          >
            {t("products.ctaAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
