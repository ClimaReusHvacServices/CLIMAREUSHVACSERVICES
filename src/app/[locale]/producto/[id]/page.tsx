import { notFound } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import {
  Wind, CheckCircle2, Shield, Wrench,
  Zap, Volume2, Award, Wifi, Star, Home, ChevronRight, Phone,
} from "lucide-react";
import RequestServiceButton from "@/components/landing/RequestServiceButton";
import Footer from "@/components/landing/Footer";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

const WA_NUMBER = "34607953886";

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

interface Specs {
  energyLabel?: string;
  efficiency?: string;
  noiseLevel?: string;
  quality?: string;
  wifi?: boolean;
  coolyScore?: number;
  coverage?: string;
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center gap-2">
      {icon}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide leading-tight">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, select: { name: true, description: true } });
  if (!product) return {};
  return {
    title: `${product.name} | Clima HVAC Service`,
    description: product.description?.slice(0, 155) ?? undefined,
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
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
  const savings = hasDiscount ? price - discountPrice! : 0;
  const savingsPct = hasDiscount ? Math.round((savings / price) * 100) : 0;

  let specs: Specs = {};
  try {
    if ((product as any).specifications) specs = JSON.parse((product as any).specifications);
  } catch {}
  const hasSpecs = Object.keys(specs).length > 0;

  const waMessage = encodeURIComponent(
    `Hola, me interesa el equipo "${product.name}"${product.manufacturer ? ` de ${product.manufacturer}` : ""}. ¿Podéis informarme?`
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Breadcrumb hero */}
      <div data-logo="white" className="pt-24 pb-8 px-4" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">{t("productoPage.breadcrumbHome")}</Link>
            <ChevronRight size={12} className="shrink-0" />
            <Link href="/oferta" className="hover:text-white transition-colors">{t("productoPage.breadcrumbCatalog")}</Link>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-white/90 font-medium">{product.name}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.name}</h1>
          {product.manufacturer && (
            <p className="text-white/70 text-sm mt-1.5">{product.manufacturer} · {product.category}</p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div data-logo="green">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left — image */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center p-8 min-h-[300px] sm:min-h-[380px]">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full max-h-[360px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Wind size={96} strokeWidth={0.6} className="text-gray-200" />
                    <p className="text-sm text-gray-300 font-medium">{t("products.modalImage")}</p>
                  </div>
                )}
              </div>

              {hasDiscount && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} className="shrink-0 text-amber-500" />
                  {t("productoPage.saved")}: {fmt(savings)} € — {savingsPct}% {t("products.discountLabel")}
                </div>
              )}

              {/* Back link (desktop) */}
              <div className="hidden lg:block">
                <Link
                  href="/oferta"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors font-medium"
                >
                  ← {t("productoPage.backToCatalog")}
                </Link>
              </div>
            </div>

            {/* Right — details */}
            <div className="space-y-4">

              {/* Price card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-baseline gap-3 flex-wrap mb-2">
                  <span className="text-4xl sm:text-5xl font-bold" style={{ color: "#d97706" }}>
                    {fmt(displayPrice)} €
                  </span>
                  {hasDiscount && (
                    <span className="text-gray-400 line-through text-xl">
                      {fmt(price)} €
                    </span>
                  )}
                </div>
                <p className="text-primary-600 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 size={12} />
                  {t("productoPage.includesInstall")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-primary-500" : "bg-red-400"}`} />
                  <span className={`text-sm font-medium ${product.stock > 0 ? "text-primary-600" : "text-red-500"}`}>
                    {product.stock > 0 ? t("products.modalInStock") : t("products.modalOutStock")}
                  </span>
                </div>
              </div>

              {/* Installation card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-primary-50 rounded-lg">
                    <Wrench size={14} className="text-primary-600" />
                  </div>
                  {t("productoPage.installTitle")}
                </h3>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0" />
                    <span>{t("productoPage.installNote3m")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-amber-400 mt-0.5 shrink-0" />
                    <span>{t("productoPage.installExcess")}</span>
                  </li>
                </ul>
              </div>

              {/* Warranty card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-primary-50 rounded-lg">
                    <Shield size={14} className="text-primary-600" />
                  </div>
                  {t("productoPage.warrantyTitle")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100/60 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-primary-700">{t("productoPage.warrantyEquip")}</p>
                    <p className="text-xs text-primary-600 mt-0.5 font-medium">{t("productoPage.warrantyEquipTitle")}</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent-50 to-accent-100/60 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-accent-700">{t("productoPage.warrantyInstall")}</p>
                    <p className="text-xs text-accent-600 mt-0.5 font-medium">{t("productoPage.warrantyInstallTitle")}</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5">
                <RequestServiceButton productId={product.id} />

                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:shadow-md"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                  {t("products.modalWhatsApp")}
                </a>
              </div>
            </div>
          </div>

          {/* Characteristics grid */}
          {hasSpecs && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t("productoPage.specsTitle")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {specs.energyLabel && (
                  <SpecCard
                    icon={<Zap size={22} className="text-green-500" />}
                    label={t("productoPage.energyLabel")}
                    value={specs.energyLabel}
                  />
                )}
                {specs.efficiency && (
                  <SpecCard
                    icon={<Zap size={22} className="text-blue-500" />}
                    label={t("productoPage.efficiency")}
                    value={specs.efficiency}
                  />
                )}
                {specs.noiseLevel && (
                  <SpecCard
                    icon={<Volume2 size={22} className="text-purple-500" />}
                    label={t("productoPage.noiseLevel")}
                    value={specs.noiseLevel}
                  />
                )}
                {specs.quality && (
                  <SpecCard
                    icon={<Award size={22} className="text-amber-500" />}
                    label={t("productoPage.quality")}
                    value={specs.quality}
                  />
                )}
                {specs.wifi !== undefined && (
                  <SpecCard
                    icon={<Wifi size={22} className={specs.wifi ? "text-primary-500" : "text-gray-300"} />}
                    label="WiFi"
                    value={specs.wifi ? t("productoPage.wifiYes") : t("productoPage.wifiNo")}
                  />
                )}
                {specs.coolyScore !== undefined && (
                  <SpecCard
                    icon={<Star size={22} style={{ color: "#f59e0b", fill: "#f59e0b" }} />}
                    label={t("productoPage.coolyScore")}
                    value={`${specs.coolyScore} / 5`}
                  />
                )}
                {specs.coverage && (
                  <SpecCard
                    icon={<Home size={22} className="text-teal-500" />}
                    label={t("productoPage.coverage")}
                    value={specs.coverage}
                  />
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{t("productoPage.descTitle")}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Footer CTA block */}
          <div
            className="mt-10 rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}
          >
            <div className="px-6 py-10 text-center">
              <p className="text-white font-extrabold text-xl sm:text-2xl mb-1">{t("productoPage.ctaTitle")}</p>
              <p className="text-white/70 text-sm mb-7">{t("productoPage.ctaSubtitle")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:877234166"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-primary-800 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-sm"
                >
                  <Phone size={15} />
                  877 234 166
                </a>
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-white text-sm transition-all hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Back link (mobile) */}
          <div className="mt-6 pb-4 lg:hidden">
            <Link
              href="/oferta"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-600 transition-colors font-medium"
            >
              ← {t("productoPage.backToCatalog")}
            </Link>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
