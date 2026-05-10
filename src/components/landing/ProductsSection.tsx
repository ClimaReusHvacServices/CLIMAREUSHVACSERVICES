"use client";

import { useRef } from "react";
import { Wind, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
  images: string[];
}

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function ProductCard({ product, t }: { product: ProductItem; t: (k: string) => string }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/producto/${product.id}`}
      className="relative group bg-[#f5f2eb] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col h-full"
    >
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

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
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

        <div
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white text-center transition-all group-hover:opacity-90 group-hover:shadow-md"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {t("products.cardDetail")}
        </div>
      </div>
    </Link>
  );
}

export function ProductsSection({ products }: { products: ProductItem[] }) {
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
                  <ProductCard product={p} t={t as any} />
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
