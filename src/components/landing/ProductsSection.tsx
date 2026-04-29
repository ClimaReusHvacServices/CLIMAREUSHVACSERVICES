"use client";

import { useState, useTransition } from "react";
import { X, Wind, CheckCircle2, Star, Wrench, LogIn } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { requestService } from "@/app/[locale]/oferta/actions";

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
}

const WA_NUMBER = "34607953886";

function formatPrice(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ProductCard({ product, onClick, t }: { product: ProductItem; onClick: () => void; t: (k: string) => string }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <article
      onClick={onClick}
      className="relative group bg-[#f5f2eb] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col"
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
        <Wind size={56} strokeWidth={0.8} className="text-gray-300" />
        <p className="text-[11px] text-gray-300 font-medium">{t("products.cardImageSoon")}</p>
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

        <button
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {t("products.cardDetail")}
        </button>
      </div>
    </article>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ProductModal({ product, onClose, t, role, locale }: {
  product: ProductItem;
  onClose: () => void;
  t: (k: string, v?: Record<string, string | number>) => string;
  role: string;
  locale: string;
}) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savings = hasDiscount ? product.price - product.discountPrice! : 0;
  const savingsPct = hasDiscount ? Math.round((savings / product.price) * 100) : 0;

  const [requesting, startRequest] = useTransition();

  function handleRequest() {
    startRequest(async () => {
      await requestService(product.id, locale);
    });
  }

  const waMessage = encodeURIComponent(
    `Hola, me interesa el equipo "${product.name}"${product.manufacturer ? ` de ${product.manufacturer}` : ""}. ¿Podéis informarme?`
  );

  const FEATS = [
    t("products.feat1"), t("products.feat2"), t("products.feat3"), t("products.feat4"),
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-slide-in flex flex-col">
        <div className="flex items-start justify-between px-6 pt-6 pb-0 gap-4">
          <div className="min-w-0">
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-accent-700 border border-accent-400 px-2.5 py-0.5 rounded-full mb-2">
                {t("products.cardPromo")} — {savingsPct}% dto.
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
            {product.manufacturer && (
              <p className="text-gray-500 text-sm mt-0.5">{product.manufacturer} · {product.category}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-60 sm:h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 border border-gray-100">
            <Wind size={80} strokeWidth={0.7} className="text-gray-200" />
            <p className="text-sm text-gray-300 font-medium">{t("products.modalImage")}</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold" style={{ color: "#d97706" }}>
                  {formatPrice(displayPrice)} €
                </span>
                {hasDiscount && (
                  <span className="text-gray-400 line-through text-xl">
                    {formatPrice(product.price)} €
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-primary-600 text-sm font-semibold mt-1">
                  {t("products.modalSave", { amount: formatPrice(savings) })}
                </p>
              )}
              <p className="text-primary-600 text-xs font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {t("products.modalInstall")}
              </p>
            </div>

            <div className="text-sm divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex justify-between px-3 py-2.5 bg-gray-50/50">
                <span className="text-gray-500">{t("products.modalCategory")}</span>
                <span className="font-semibold text-gray-800">{product.category}</span>
              </div>
              {product.manufacturer && (
                <div className="flex justify-between px-3 py-2.5">
                  <span className="text-gray-500">{t("products.modalManufacturer")}</span>
                  <span className="font-semibold text-gray-800">{product.manufacturer}</span>
                </div>
              )}
              {product.warranty && (
                <div className="flex justify-between px-3 py-2.5 bg-gray-50/50">
                  <span className="text-gray-500">{t("products.modalWarranty")}</span>
                  <span className="font-semibold text-gray-800">{product.warranty}</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-2.5">
                <span className="text-gray-500">{t("products.modalStock")}</span>
                <span className={`font-semibold flex items-center gap-1 ${product.stock > 0 ? "text-primary-600" : "text-red-500"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-primary-500" : "bg-red-500"}`} />
                  {product.stock > 0 ? t("products.modalInStock") : t("products.modalOutStock")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.199.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.476-.885-.788-1.482-1.761-1.655-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.199-.298.298-.497.1-.198.05-.372-.025-.52-.074-.149-.672-1.62-.923-2.219-.242-.583-.487-.503-.672-.513l-.573-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.273-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.849L.509 21.83a.5.5 0 00.611.637l4.106-1.066A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
                {t("products.modalWhatsApp")}
              </a>
              {role === "cliente" ? (
                <button
                  onClick={handleRequest}
                  disabled={requesting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
                  style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                >
                  {requesting
                    ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Wrench size={15} />}
                  Solicitar servicio
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 hover:shadow-md"
                  style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                >
                  <LogIn size={15} />
                  Iniciar sesión para solicitar
                </Link>
              )}
            </div>
          </div>
        </div>

        {product.description && (
          <div className="px-6 pb-4">
            <h4 className="text-sm font-bold text-gray-700 mb-1.5">Descripción</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {FEATS.map((feat) => (
              <span key={feat} className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                <Star size={10} className="shrink-0" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-5">
          <p className="text-[11px] text-gray-400 text-center">
            {t("products.modalNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function ProductsSection({ products }: { products: ProductItem[] }) {
  const t = useTranslations("landing");
  const locale = useLocale();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";
  const [selected, setSelected] = useState<ProductItem | null>(null);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} t={t as any} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/oferta"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all"
          >
            {t("products.ctaAll")}
          </Link>
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} t={t as any} role={role} locale={locale} />}
    </section>
  );
}
