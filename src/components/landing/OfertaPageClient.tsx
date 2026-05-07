"use client";

import { useState, useMemo } from "react";
import { Wind, CheckCircle2, Star, Filter, ChevronDown, Flame, Tag, ShoppingCart, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useCart } from "@/store/cart";

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

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= n ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth={1.5} />
      ))}
    </div>
  );
}

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

  if (product.stock === 0) return null;

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

function ProductCard({ product, highlight = false, t }: {
  product: ProductItem;
  highlight?: boolean;
  t: (k: string) => string;
}) {
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const savingsPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${
      highlight ? "border-amber-200 shadow-md" : "border-gray-100 shadow-sm"
    }`}>
      <Link href={`/producto/${product.id}`} className="flex flex-col flex-1">
        <div className="px-4 pt-4 h-8 flex items-center gap-2">
          {hasDiscount && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-white bg-red-500 px-2.5 py-0.5 rounded-full">
              <Flame size={9} /> -{savingsPct}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {t("products.modalOutStock")}
            </span>
          )}
        </div>

        <div className={`mx-4 h-44 rounded-xl flex flex-col items-center justify-center gap-2 border overflow-hidden ${
          highlight ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100/60" : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-100/60"
        }`}>
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
          ) : (
            <>
              <Wind size={52} strokeWidth={0.8} className={highlight ? "text-amber-200" : "text-gray-200"} />
              <p className="text-[11px] text-gray-300 font-medium">{t("products.cardImageSoon")}</p>
            </>
          )}
        </div>

        <div className="px-5 pt-4 pb-3 flex flex-col flex-1">
          <Stars n={5} />
          <h3 className="font-bold text-gray-900 text-base leading-tight mt-2 group-hover:text-primary-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">{product.category}</p>
          {product.manufacturer && <p className="text-gray-400 text-xs">{product.manufacturer}</p>}

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold" style={{ color: "#d97706" }}>{fmt(displayPrice)} €</span>
              {hasDiscount && (
                <span className="text-gray-400 line-through text-sm">{fmt(product.price)} €</span>
              )}
            </div>
            <p className="text-primary-600 text-xs font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={11} /> {t("products.feat1")}
            </p>
          </div>

          <div
            className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-primary-700 text-center border border-primary-100 bg-primary-50/50 group-hover:bg-primary-100 transition-colors"
          >
            {t("products.cardDetail")} →
          </div>
        </div>
      </Link>
      {/* Add to cart — outside the Link so it doesn't navigate */}
      <div className="px-5 pb-5">
        <AddToCartInline product={product} />
      </div>
    </div>
  );
}

export default function OfertaPageClient({ products }: { products: ProductItem[] }) {
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
              <ProductCard key={p.id} product={p} highlight t={t as any} />
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
              <ProductCard key={p.id} product={p} t={t as any} />
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
