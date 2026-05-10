import { notFound } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import {
  Wind, CheckCircle2, Shield, Wrench, Zap, Volume2, Wifi,
  Home, ChevronRight, Phone, Flame, Droplets, Thermometer,
  FileText, Tag, Star,
} from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Footer from "@/components/landing/Footer";
import type { AcSpecs, BoilerSpecs, AerothermalSpecs } from "@/types/product";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

import { waProduct } from "@/lib/whatsapp";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── Spec card ────────────────────────────────────────────────────────────────

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="shrink-0 text-primary-500">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Build characteristics list by product type ───────────────────────────────

interface CharItem { label: string; value: string; icon: React.ReactNode }

function buildCharacteristics(
  productType: string | null,
  specs: Record<string, any>,
  warranty: string | null,
): CharItem[] {
  const items: CharItem[] = [];

  if (productType === "air_conditioning") {
    const s = specs as Partial<AcSpecs>;
    if (s.energyLabelCooling) items.push({ label: "Etiqueta frío", value: s.energyLabelCooling, icon: <Zap size={18} /> });
    if (s.energyLabelHeating) items.push({ label: "Etiqueta calor", value: s.energyLabelHeating, icon: <Thermometer size={18} /> });
    if (s.coolingCapacityKw) items.push({ label: "Potencia frío", value: `${s.coolingCapacityKw} kW`, icon: <Wind size={18} /> });
    if (s.heatingCapacityKw) items.push({ label: "Potencia calor", value: `${s.heatingCapacityKw} kW`, icon: <Flame size={18} /> });
    if (s.seer) items.push({ label: "SEER", value: String(s.seer), icon: <Zap size={18} /> });
    if (s.scop) items.push({ label: "SCOP", value: String(s.scop), icon: <Zap size={18} /> });
    if (s.minNoiseDb) items.push({ label: "Silencio", value: `${s.minNoiseDb} dB`, icon: <Volume2 size={18} /> });
    const wifiVal = s.wifiStatus === "included" ? "Incluido" : s.wifiStatus === "optional" ? "Opcional" : "No incluido";
    if (s.wifiStatus) items.push({ label: "WiFi", value: wifiVal, icon: <Wifi size={18} /> });
    if (s.recommendedAreaMin && s.recommendedAreaMax) items.push({ label: "Superficie", value: `${s.recommendedAreaMin}–${s.recommendedAreaMax} m²`, icon: <Home size={18} /> });
    if (s.refrigerant) items.push({ label: "Refrigerante", value: s.refrigerant, icon: <Droplets size={18} /> });

  } else if (productType === "boiler") {
    const s = specs as Partial<BoilerSpecs>;
    if (s.heatingPowerKw) items.push({ label: "Potencia calef.", value: `${s.heatingPowerKw} kW`, icon: <Flame size={18} /> });
    if (s.dhwPowerKw) items.push({ label: "Potencia ACS", value: `${s.dhwPowerKw} kW`, icon: <Droplets size={18} /> });
    if (s.energyLabelHeating) items.push({ label: "Etiqueta energética", value: s.energyLabelHeating, icon: <Zap size={18} /> });
    if (s.efficiency) items.push({ label: "Eficiencia", value: s.efficiency, icon: <Zap size={18} /> });
    if (s.dhwFlowRate) items.push({ label: "Caudal ACS", value: s.dhwFlowRate, icon: <Droplets size={18} /> });
    if (s.noxClass) items.push({ label: "Clase NOx", value: s.noxClass, icon: <Zap size={18} /> });
    const fuelLabel: Record<string, string> = { gas_natural: "Gas natural", propano: "Propano", gasoil: "Gasóleo", electrica: "Eléctrica" };
    if (s.fuelType) items.push({ label: "Combustible", value: fuelLabel[s.fuelType] ?? s.fuelType, icon: <Flame size={18} /> });

  } else if (productType === "aerothermal") {
    const s = specs as Partial<AerothermalSpecs>;
    if (s.heatingCapacityKw) items.push({ label: "Potencia calef.", value: `${s.heatingCapacityKw} kW`, icon: <Thermometer size={18} /> });
    if (s.coolingCapacityKw) items.push({ label: "Potencia frío", value: `${s.coolingCapacityKw} kW`, icon: <Wind size={18} /> });
    if (s.cop) items.push({ label: "COP", value: String(s.cop), icon: <Zap size={18} /> });
    if (s.scop) items.push({ label: "SCOP", value: String(s.scop), icon: <Zap size={18} /> });
    if (s.energyLabel) items.push({ label: "Etiqueta energética", value: s.energyLabel, icon: <Zap size={18} /> });
    if (s.tankLiters) items.push({ label: "Depósito ACS", value: `${s.tankLiters} L`, icon: <Droplets size={18} /> });
    if (s.minNoiseDb) items.push({ label: "Silencio", value: `${s.minNoiseDb} dB`, icon: <Volume2 size={18} /> });
    if (s.refrigerant) items.push({ label: "Refrigerante", value: s.refrigerant, icon: <Droplets size={18} /> });

  } else {
    // Legacy format
    if (specs.energyLabel) items.push({ label: "Etiqueta", value: specs.energyLabel, icon: <Zap size={18} /> });
    if (specs.efficiency) items.push({ label: "Eficiencia", value: specs.efficiency, icon: <Zap size={18} /> });
    if (specs.noiseLevel) items.push({ label: "Silencio", value: specs.noiseLevel, icon: <Volume2 size={18} /> });
    if (specs.coverage) items.push({ label: "Superficie", value: specs.coverage, icon: <Home size={18} /> });
    if (specs.wifi !== undefined) items.push({ label: "WiFi", value: specs.wifi ? "Sí" : "No", icon: <Wifi size={18} /> });
  }

  if (warranty) items.push({ label: "Garantía", value: warranty, icon: <Shield size={18} /> });
  return items;
}

// ─── Technical detail block for AC conductos ─────────────────────────────────

function AcTechBlock({ s }: { s: Partial<AcSpecs> }) {
  const rows: [string, string][] = [];
  if (s.outdoorUnit) rows.push(["Unidad exterior (UE)", s.outdoorUnit]);
  if (s.outdoorDimensions) rows.push(["Dim. UE (Al×An×F)", s.outdoorDimensions]);
  if (s.indoorUnit) rows.push(["Unidad interior (UI)", s.indoorUnit]);
  if (s.indoorDimensions) rows.push(["Dim. UI (Al×An×F)", s.indoorDimensions]);
  if (s.indoorOutdoorWeight) rows.push(["Peso UI / UE", s.indoorOutdoorWeight]);
  if (s.staticPressure) rows.push(["Presión estática", s.staticPressure]);
  if (s.includedController) rows.push(["Mando incluido", s.includedController]);
  if (s.refrigerant) rows.push(["Refrigerante", s.refrigerant]);
  if (!rows.length) return null;

  return (
    <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden text-sm">
      {rows.map(([label, value], i) => (
        <div key={label} className={`flex gap-3 px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
          <span className="text-gray-500 font-medium w-44 shrink-0">{label}</span>
          <span className="text-gray-900 font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stock badge ─────────────────────────────────────────────────────────────

function StockBadge({ stockStatus, stock }: { stockStatus: string | null; stock: number }) {
  if (stockStatus === "on_request" || (stockStatus === null && stock === 0)) {
    return <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">Bajo pedido</span>;
  }
  if (stockStatus === "consult") {
    return <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-full">Consultar disponibilidad</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
      En stock
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const p = await db.product.findUnique({
    where: { id },
    select: { name: true, seoTitle: true, seoDescription: true, shortDescription: true, description: true },
  });
  if (!p) return {};
  return {
    title: p.seoTitle || `${p.name} | Clima HVAC Service`,
    description: p.seoDescription || p.shortDescription || p.description?.slice(0, 155),
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [product, t] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    getTranslations("landing"),
  ]);

  if (!product || !product.isActive) notFound();

  const price = Number(product.price);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice! : price;
  const savingsPct = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;

  let specs: Record<string, any> = {};
  try { if (product.specifications) specs = JSON.parse(product.specifications); } catch {}

  const chars = buildCharacteristics(product.productType, specs, product.warranty);
  const acSpecs = product.productType === "air_conditioning" ? specs as Partial<AcSpecs> : null;
  const isArea = acSpecs?.recommendedAreaMin && acSpecs?.recommendedAreaMax;
  const installType: Record<string, string> = {
    split: "Split 1×1", conductos: "Conductos", cassette: "Cassette",
    multisplit: "Multi-Split", suelo_techo: "Suelo-Techo",
  };

  // Back link target based on pageLocation
  const backHref = product.pageLocation === "calderas" ? "/calderas"
    : product.pageLocation === "aerotermia" ? "/aerotermia" : "/oferta";
  const backLabel = product.pageLocation === "calderas" ? "Calderas"
    : product.pageLocation === "aerotermia" ? "Aerotermia" : "Catálogo";

  const waMessage = waProduct(product.name, (product as any).brand ?? product.manufacturer);

  const brandDisplay = (product as any).brand ?? product.manufacturer;
  const installInfo = [
    (product as any).installationIncluded && "Instalación incluida",
    (product as any).ivaIncluded && "IVA incluido",
  ].filter(Boolean).join(" e ");

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero strip */}
      <div data-logo="white" className="pt-24 pb-6 px-4" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-3 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight size={12} className="shrink-0" />
            <Link href={backHref} className="hover:text-white transition-colors">{backLabel}</Link>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-white/90 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main */}
      <div data-logo="green">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Two-column: image | info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left — image */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-8 min-h-[300px] sm:min-h-[380px]">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="w-full max-h-[360px] object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Wind size={96} strokeWidth={0.6} className="text-gray-200" />
                    <p className="text-sm text-gray-300 font-medium">Imagen próximamente</p>
                  </div>
                )}
                {/* Stock badge overlay */}
                <div className="absolute top-4 left-4">
                  <StockBadge stockStatus={(product as any).stockStatus} stock={product.stock} />
                </div>
                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-extrabold text-white bg-red-500 px-2.5 py-1 rounded-full">-{savingsPct}%</span>
                  </div>
                )}
              </div>

              {/* Gallery thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {product.images.slice(1, 5).map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="" className="w-16 h-16 object-contain rounded-xl border border-gray-200 bg-white p-1" />
                  ))}
                </div>
              )}

              {/* Commercial tags */}
              {(product as any).commercialTags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {((product as any).commercialTags as string[]).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">
                      <Tag size={10} />{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Technical PDF */}
              {(product as any).technicalPdf && (
                <a href={(product as any).technicalPdf} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-semibold transition-colors">
                  <FileText size={15} />
                  Descargar ficha técnica (PDF)
                </a>
              )}

              {/* Back link (desktop) */}
              <div className="hidden lg:block pt-2">
                <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors font-medium">
                  ← Volver a {backLabel}
                </Link>
              </div>
            </div>

            {/* Right — product details */}
            <div className="space-y-4">

              {/* Badges row */}
              <div className="flex flex-wrap gap-2">
                {acSpecs?.installationType && (
                  <span className="text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-full">
                    {installType[acSpecs.installationType] ?? acSpecs.installationType}
                  </span>
                )}
                {isArea && (
                  <span className="text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full">
                    De {acSpecs!.recommendedAreaMin} a {acSpecs!.recommendedAreaMax} m²
                  </span>
                )}
                {(product as any).series && (
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                    {(product as any).series}
                  </span>
                )}
              </div>

              {/* Title + subtitle */}
              <div>
                {brandDisplay && <p className="text-sm font-semibold text-primary-600 mb-1">{brandDisplay}</p>}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                {(product as any).shortDescription && (
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{(product as any).shortDescription}</p>
                )}
              </div>

              {/* Price card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-baseline gap-3 flex-wrap mb-1">
                  <span className="text-4xl sm:text-5xl font-bold" style={{ color: "#d97706" }}>
                    {fmt(displayPrice)} €
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-400 line-through text-xl">{fmt(price)} €</span>
                  )}
                </div>
                {installInfo && (
                  <p className="text-primary-600 text-xs font-semibold flex items-center gap-1.5 mt-1">
                    <CheckCircle2 size={12} />
                    {installInfo}
                  </p>
                )}
              </div>

              {/* Warranty quick line */}
              {product.warranty && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-xl border border-gray-100 px-4 py-3">
                  <Shield size={15} className="text-primary-500 shrink-0" />
                  <span>Garantía: <strong className="text-gray-900">{product.warranty}</strong></span>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2.5">
                <a
                  href={waMessage}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-extrabold text-base transition-all hover:opacity-90 hover:shadow-md"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 448 512" fill="white">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                  ¡Lo quiero! — Pide presupuesto gratis
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <a href="tel:+34877234166"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl text-gray-700 font-bold text-sm border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                    <Phone size={15} /> 877 234 166
                  </a>
                  <AddToCartButton
                    productId={product.id}
                    name={product.name}
                    price={displayPrice}
                    originalPrice={price}
                    imageUrl={product.images?.[0] ?? null}
                    stock={product.stock}
                  />
                </div>
              </div>

              {/* Installation info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <Wrench size={14} className="text-primary-600" /> Instalación incluida
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-primary-500 mt-0.5 shrink-0" />
                    Instalación básica hasta 3 m de distancia entre unidades
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-amber-400 mt-0.5 shrink-0" />
                    Metraje adicional se presupuesta según visita técnica
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Características ───────────────────────────────────── */}
          {chars.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={18} className="text-amber-400" fill="#f59e0b" />
                Características
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {chars.map((c, i) => (
                  <SpecCard key={i} icon={c.icon} label={c.label} value={c.value} />
                ))}
              </div>
            </div>
          )}

          {/* ── Descripción ───────────────────────────────────────── */}
          {(product.description || (product as any).shortDescription) && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-gray-900 mb-4">Descripción</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                {(product as any).shortDescription && (
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    {(product as any).shortDescription}
                  </p>
                )}
                {product.description && (product as any).shortDescription !== product.description && (
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}
                {/* Technical data block for AC conductos */}
                {acSpecs && <AcTechBlock s={acSpecs} />}
              </div>
            </div>
          )}

          {/* ── Garantías ─────────────────────────────────────────── */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Shield size={22} className="text-primary-600" />, val: product.warranty ?? "3 años", label: "Garantía del equipo" },
              { icon: <Wrench size={22} className="text-accent-600" />, val: "2 años", label: "Garantía instalación Clima HVAC" },
              { icon: <CheckCircle2 size={22} className="text-green-500" />, val: "RITE", label: "Instalación certificada" },
            ].map(({ icon, val, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="p-2.5 bg-gray-50 rounded-xl shrink-0">{icon}</div>
                <div>
                  <p className="text-xl font-extrabold text-gray-900">{val}</p>
                  <p className="text-xs text-gray-500 font-medium leading-snug">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer CTA ────────────────────────────────────────── */}
          <div className="mt-10 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}>
            <div className="px-6 py-10 text-center">
              <p className="text-white font-extrabold text-xl sm:text-2xl mb-1">¿Tienes dudas sobre este equipo?</p>
              <p className="text-white/70 text-sm mb-7">Cuéntanos tu situación y te preparamos un presupuesto sin compromiso</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:877234166"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary-800 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm">
                  <Phone size={15} /> 877 234 166
                </a>
                <a href={waMessage} target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-white text-sm hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: "#25D366" }}>
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Back (mobile) */}
          <div className="mt-6 pb-4 lg:hidden">
            <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors font-medium">
              ← Volver a {backLabel}
            </Link>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
