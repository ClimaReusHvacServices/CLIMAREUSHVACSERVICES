"use client";

import { useState, useMemo } from "react";
import { Wind, CheckCircle2, Filter, ChevronDown, Flame, Tag, ShoppingCart, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/cart";

import { waOfertaProduct } from "@/lib/whatsapp";

export interface ProductItem {
  id: string;
  name: string;
  shortDescription: string | null;
  description: string;
  category: string;
  manufacturer: string | null;
  brand: string | null;
  series: string | null;
  productType: string | null;
  stockStatus: string | null;
  ivaIncluded: boolean;
  installationIncluded: boolean;
  price: number;
  discountPrice: number | null;
  warranty: string | null;
  stock: number;
  images: string[];
  specifications: unknown;
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function StockPill({ status }: { status: string | null }) {
  if (!status || status === "in_stock") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
      En stock
    </span>
  );
  if (status === "on_request") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Bajo pedido
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
      Consultar
    </span>
  );
}

const WA_SVG = (
  <svg viewBox="0 0 448 512" className="w-4 h-4 fill-white shrink-0">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

function ProductCard({ product, userRole = null, t }: {
  product: ProductItem;
  highlight?: boolean;
  userRole?: string | null;
  t: (k: string) => string;
}) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
  const inCart = items.some(i => i.productId === product.id);

  function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, name: product.name, price: displayPrice, originalPrice: product.price, imageUrl: product.images?.[0] ?? null });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="relative group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute left-3 top-3 z-20">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm bg-red-500">
            <Flame size={9} /> -{savingsPct}% {t("products.discountLabel")}
          </span>
        </div>
      )}

      {/* Stock badge top-right */}
      <div className="absolute right-3 top-3 z-20">
        <StockPill status={product.stockStatus} />
      </div>

      <Link href={`/producto/${product.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="h-44 bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-3" />
          ) : (
            <>
              <Wind size={52} strokeWidth={0.8} className="text-gray-200" />
              <p className="text-[10px] text-gray-300 font-medium mt-1">{t("products.cardImageSoon")}</p>
            </>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-3 flex flex-col flex-1">
          {(product.brand ?? product.manufacturer) && (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              {product.brand ?? product.manufacturer}
            </p>
          )}
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">{product.category}</p>

          <div className="mt-auto pt-3 flex items-end justify-between gap-2">
            <div>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-xs font-medium block">
                  {fmt(product.price)} €
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900 leading-none">
                {fmt(displayPrice)} <span className="text-base font-semibold">€</span>
              </span>
              <p className="text-primary-600 text-[10px] font-semibold mt-0.5 flex items-center gap-0.5">
                <CheckCircle2 size={10} /> {t("products.cardInstall")}
              </p>
            </div>

            {/* Two round action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* WhatsApp */}
              <a
                href={waOfertaProduct(product.name)}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                title={t("ofertaPage.waConsult")}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
              >
                {WA_SVG}
              </a>

              {/* Cart / Login */}
              {userRole === "cliente" ? (
                <button
                  onClick={handleCart}
                  title={inCart ? t("ofertaPage.addAnother") : t("ofertaPage.addToCart")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95 ${justAdded ? "bg-green-500" : ""}`}
                  style={justAdded ? {} : { background: "linear-gradient(135deg, #008f65, #1d7291)" }}
                >
                  {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
                </button>
              ) : userRole === null ? (
                <Link
                  href="/login"
                  onClick={e => e.stopPropagation()}
                  title={t("ofertaPage.loginToBuy")}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
                >
                  <ShoppingCart size={16} />
                </Link>
              ) : (
                <a
                  href={waOfertaProduct(product.name)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  title={t("ofertaPage.requestQuote")}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
                >
                  <ShoppingCart size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function OfertaPageClient({ products, userRole = null }: { products: ProductItem[]; userRole?: string | null }) {
  const t = useTranslations("landing");
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [sort, setSort] = useState<"precio_asc" | "precio_desc" | "nombre">("precio_asc");

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const ofertas = products.filter(p => p.discountPrice !== null && p.discountPrice < p.price);
  const catalogo = products.filter(p => !(p.discountPrice !== null && p.discountPrice < p.price));

  function applyFilters(list: ProductItem[]) {
    const out = categoryFilter === "__all__" ? list : list.filter(p => p.category === categoryFilter);
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
            <span
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-white px-4 py-1.5 rounded-full"
              style={{ background: "linear-gradient(to right, #dc2626, #f97316)" }}
            >
              <Flame size={14} /> {t("ofertaPage.offersTitle")}
            </span>
            <span className="text-sm text-gray-500">
              {filteredOfertas.length} {filteredOfertas.length !== 1 ? t("ofertaPage.offersUnits") : t("ofertaPage.offersUnit")} {t("ofertaPage.offersPromo")}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredOfertas.map(p => (
              <ProductCard key={p.id} product={p} highlight userRole={userRole} t={t as any} />
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
              <ProductCard key={p.id} product={p} userRole={userRole} t={t as any} />
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
    </div>
  );
}
