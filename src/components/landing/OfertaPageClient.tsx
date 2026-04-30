"use client";

import { useState, useMemo, useTransition } from "react";
import { X, Wind, CheckCircle2, Star, Filter, ChevronDown, Flame, Tag, Wrench, LogIn } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { requestService } from "@/app/[locale]/oferta/actions";

export interface ProductItem {
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

const WA = "34607953886";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= n ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.5} />
      ))}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
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

  const waMsg = encodeURIComponent(
    `Hola, me interesa el equipo "${product.name}"${product.manufacturer ? ` de ${product.manufacturer}` : ""}. ¿Podéis informarme?`
  );

  function handleRequest() {
    startRequest(async () => {
      await requestService(product.id, locale);
    });
  }

  const FEATS = [
    t("products.feat1"), t("products.feat2"), t("products.feat3"), t("products.feat4"),
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0 gap-4">
          <div className="min-w-0">
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-white bg-red-500 px-2.5 py-0.5 rounded-full mb-2">
                -{savingsPct}% {t("products.cardPromo").toUpperCase()}
              </span>
            )}
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
            {product.manufacturer && (
              <p className="text-gray-500 text-sm mt-0.5">{product.manufacturer} · {product.category}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image */}
          <div className="h-60 sm:h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center gap-3 border border-gray-100 overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-3" />
            ) : (
              <>
                <Wind size={80} strokeWidth={0.7} className="text-gray-200" />
                <p className="text-sm text-gray-300 font-medium">{t("products.modalImage")}</p>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            <Stars n={5} />

            {/* Price */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold" style={{ color: "#d97706" }}>{fmt(displayPrice)} €</span>
                {hasDiscount && <span className="text-gray-400 line-through text-xl">{fmt(product.price)} €</span>}
              </div>
              {hasDiscount && (
                <p className="text-primary-600 text-sm font-semibold mt-1">
                  {t("products.modalSave", { amount: fmt(savings) })}
                </p>
              )}
              <p className="text-primary-600 text-xs font-medium mt-2 flex items-center gap-1">
                <CheckCircle2 size={12} /> {t("products.modalInstall")}
              </p>
            </div>

            {/* Specs */}
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

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                {t("products.modalWhatsApp")}
              </a>
              {role === "cliente" ? (
                <button
                  onClick={handleRequest}
                  disabled={requesting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                >
                  {requesting
                    ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Wrench size={15} />}
                  Solicitar servicio
                </button>
              ) : role === "" ? (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                >
                  <LogIn size={15} />
                  Iniciar sesión para solicitar
                </Link>
              ) : null}
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
            {FEATS.map(f => (
              <span key={f} className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                <Star size={10} className="shrink-0" />{f}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-5">
          <p className="text-[11px] text-gray-400 text-center">{t("products.modalNote")}</p>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ product, onClick, highlight = false, t }: { product: ProductItem; onClick: () => void; highlight?: boolean; t: (k: string) => string }) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  return (
    <article
      onClick={onClick}
      className={`group bg-white rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
        highlight ? "border-amber-200 shadow-md" : "border-gray-100 shadow-sm"
      }`}
    >
      <div className="px-4 pt-4 h-8 flex items-center gap-2">
        {hasDiscount && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-white bg-red-500 px-2.5 py-0.5 rounded-full">
            <Flame size={9} /> -{savingsPct}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">{t("products.modalOutStock")}</span>
        )}
      </div>

      <div className={`mx-4 h-44 rounded-xl flex flex-col items-center justify-center gap-2 border overflow-hidden ${
        highlight ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100/60" : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-100/60"
      }`}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
        ) : (
          <>
            <Wind size={52} strokeWidth={0.8} className={highlight ? "text-amber-200" : "text-gray-200"} />
            <p className="text-[11px] text-gray-300 font-medium">{t("products.cardImageSoon")}</p>
          </>
        )}
      </div>

      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <Stars n={5} />
        <h3 className="font-bold text-gray-900 text-base leading-tight mt-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">{product.category}</p>
        {product.manufacturer && <p className="text-gray-400 text-xs">{product.manufacturer}</p>}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold" style={{ color: "#d97706" }}>{fmt(displayPrice)} €</span>
            {hasDiscount && <span className="text-gray-400 line-through text-sm">{fmt(product.price)} €</span>}
          </div>
          <p className="text-primary-600 text-xs font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} /> {t("products.feat1")}
          </p>
        </div>

        <button
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {t("products.cardDetail")}
        </button>
      </div>
    </article>
  );
}

// ── Main page client ───────────────────────────────────────────────────────────
export default function OfertaPageClient({ products }: { products: ProductItem[] }) {
  const t = useTranslations("landing");
  const locale = useLocale();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";
  const [selected, setSelected] = useState<ProductItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [sort, setSort] = useState<"precio_asc" | "precio_desc" | "nombre">("precio_asc");

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const ofertas = products.filter(p => p.discountPrice !== null && p.discountPrice < p.price);
  const catalogo = products.filter(p => !(p.discountPrice !== null && p.discountPrice < p.price));

  function applyFilters(list: ProductItem[]) {
    let out = categoryFilter === "__all__" ? list : list.filter(p => p.category === categoryFilter);
    return out.sort((a, b) => {
      const pa = a.discountPrice ?? a.price;
      const pb = b.discountPrice ?? b.price;
      if (sort === "precio_asc") return pa - pb;
      if (sort === "precio_desc") return pb - pa;
      return a.name.localeCompare(b.name);
    });
  }

  const filteredOfertas = applyFilters(ofertas);
  const filteredCatalogo = applyFilters(catalogo);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Filters bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={14} className="text-gray-400 shrink-0" />
          <button
            onClick={() => setCategoryFilter("__all__")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              categoryFilter === "__all__" ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={categoryFilter === "__all__" ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : {}}
          >
            {t("ofertaPage.filterAll")}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                categoryFilter === cat ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={categoryFilter === cat ? { background: "linear-gradient(to right, #008f65, #1d7291)" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown size={14} className="text-gray-400" />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
            className="text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="precio_asc">{t("ofertaPage.sortAsc")}</option>
            <option value="precio_desc">{t("ofertaPage.sortDesc")}</option>
            <option value="nombre">{t("ofertaPage.sortName")}</option>
          </select>
        </div>
      </div>

      {/* Ofertas section */}
      {filteredOfertas.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-white px-4 py-1.5 rounded-full"
              style={{ background: "linear-gradient(to right, #dc2626, #f97316)" }}>
              <Flame size={14} /> {t("ofertaPage.offersTitle")}
            </span>
            <span className="text-sm text-gray-500">
              {filteredOfertas.length} {filteredOfertas.length !== 1 ? t("ofertaPage.offersUnits") : t("ofertaPage.offersUnit")} {t("ofertaPage.offersPromo")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOfertas.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} highlight t={t as any} />
            ))}
          </div>
        </div>
      )}

      {/* Catálogo section */}
      {filteredCatalogo.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-gray-700 px-4 py-1.5 rounded-full bg-gray-100">
              <Tag size={14} /> {t("ofertaPage.catalogTitle")}
            </span>
            <span className="text-sm text-gray-500">
              {filteredCatalogo.length} {filteredCatalogo.length !== 1 ? t("ofertaPage.catalogUnits") : t("ofertaPage.catalogUnit")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCatalogo.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} t={t as any} />
            ))}
          </div>
        </div>
      )}

      {filteredOfertas.length === 0 && filteredCatalogo.length === 0 && (
        <div className="text-center py-24">
          <Wind size={56} strokeWidth={0.8} className="mx-auto mb-4 text-gray-200" />
          <p className="text-gray-400 text-lg font-medium">{t("ofertaPage.catalogEmpty")}</p>
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} t={t as any} role={role} locale={locale} />}
    </div>
  );
}
