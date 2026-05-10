import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Footer from "@/components/landing/Footer";
import {
  CheckCircle2, Zap, Droplets, Snowflake, Leaf, Phone,
  ChevronRight, TrendingDown, ThumbsUp, Wind,
} from "lucide-react";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

import { WA_AEROTERMIA as WA_TEXT } from "@/lib/whatsapp";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === "ca"
    ? "Aerotèrmia a Reus i Tarragona | Clima HVAC Service"
    : locale === "en"
    ? "Heat Pump Systems in Reus & Tarragona | Clima HVAC Service"
    : "Aerotermia en Reus y Tarragona | Clima HVAC Service";
  const description = locale === "ca"
    ? "Instal·lació professional d'aerotèrmia a Reus i Tarragona. Estalvia fins al 70% en calefacció."
    : locale === "en"
    ? "Professional heat pump installation in Reus and Tarragona. Save up to 70% on heating."
    : "Instalación profesional de aerotermia en Reus y Tarragona. Ahorra hasta un 70% en calefacción.";
  return { title, description };
}

async function getAerotermiaProducts() {
  return db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { pageLocation: "aerotermia" },
        { pageLocation: null, productType: "aerothermal" },
        { pageLocation: null, productType: null, category: { contains: "aerotermia", mode: "insensitive" } },
        { pageLocation: null, productType: null, productCategory: { slug: "aerotermia" } },
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { price: "asc" }],
  });
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const BENEFITS = [
  {
    icon: TrendingDown,
    color: "text-green-500",
    bg: "bg-green-50",
    title: "Hasta 70% de ahorro",
    desc: "Comparado con sistemas de calefacción tradicionales por gas o gasoil, la aerotermia reduce la factura energética de forma significativa.",
  },
  {
    icon: Wind,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "3 en 1: calefacción, frío y ACS",
    desc: "Un solo equipo cubre calefacción en invierno, refrigeración en verano y agua caliente sanitaria durante todo el año.",
  },
  {
    icon: Leaf,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    title: "Energía limpia y sostenible",
    desc: "No usa combustión ni emite CO₂ directamente. Aprovecha la energía renovable del aire exterior para generar calor.",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Alta eficiencia (COP > 3)",
    desc: "Por cada kWh de electricidad consumida, el equipo genera más de 3 kWh de calor. Una tecnología que multiplica tu inversión.",
  },
  {
    icon: Droplets,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
    title: "Agua caliente sanitaria incluida",
    desc: "Depósito de ACS integrado para que siempre tengas agua caliente disponible, independientemente de la época del año.",
  },
  {
    icon: ThumbsUp,
    color: "text-primary-500",
    bg: "bg-primary-50",
    title: "Subvenciones disponibles",
    desc: "El Gobierno ofrece ayudas del Plan MOVES III y fondos europeos Next Generation EU para la instalación de bombas de calor.",
  },
];

const STEPS = [
  { n: "01", title: "Evaluación gratuita", desc: "Analizamos tu vivienda, necesidades y consumo actual sin ningún compromiso." },
  { n: "02", title: "Presupuesto personalizado", desc: "Te entregamos un presupuesto detallado con los equipos más adecuados y el ahorro estimado." },
  { n: "03", title: "Instalación certificada", desc: "Nuestros técnicos realizan la instalación completa con todos los permisos y homologaciones." },
  { n: "04", title: "Puesta en marcha y formación", desc: "Te explicamos cómo usar el sistema para maximizar el ahorro desde el primer día." },
];

export default async function AerotermiaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getAerotermiaProducts();

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        data-logo="white"
        className="relative overflow-hidden pt-32 pb-20 px-4"
        style={{ background: "linear-gradient(150deg, #0a2e3d 0%, #0d4a5c 40%, #1d7291 100%)" }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #25D366, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #008f65, transparent)" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">Aerotermia</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                Tecnología de vanguardia
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Aerotermia en Reus y Tarragona
              </h1>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Climatiza y calienta el agua de tu hogar con la tecnología más eficiente del mercado. Instalación profesional, garantía total y hasta un <strong className="text-white">70% de ahorro</strong> en tu factura energética.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={WA_TEXT}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Pide tu presupuesto gratis
                </a>
                <a
                  href="tel:+34877234166"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white/90 border border-white/20 hover:bg-white/10 transition-all"
                >
                  <Phone size={15} />
                  877 234 166
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "70%", label: "Ahorro vs caldera gas" },
                { val: "3 en 1", label: "Calefacción · Frío · ACS" },
                { val: "COP 3+", label: "Eficiencia energética" },
                { val: "100%", label: "Instalación certificada" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{val}</p>
                  <p className="text-xs text-white/60 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUÉ ES ─────────────────────────────────────────────── */}
      <section data-logo="green" className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">¿Cómo funciona?</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                La energía del aire exterior,<br />al servicio de tu hogar
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
                Un sistema de aerotermia extrae la energía térmica presente en el aire exterior —incluso a temperaturas bajo cero— y la transforma en calor para tu hogar. Por cada kWh de electricidad consumido, genera más de 3 kWh de energía útil.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                A diferencia de las calderas de gas, no requiere combustión ni genera emisiones directas de CO₂. Es la solución más eficiente, sostenible y económica para climatizar una vivienda en el clima mediterráneo de Reus y Tarragona.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Funciona con temperaturas exteriores de hasta -20ºC",
                  "Compatible con suelo radiante, fan-coils y radiadores de baja temperatura",
                  "Instalación posible en viviendas sin gas natural",
                  "Telgestión desde el móvil incluida en muchos modelos",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <CheckCircle2 size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}>
                <div className="p-8 sm:p-10">
                  <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-6">Comparativa energética</p>
                  {[
                    { label: "Aerotermia (COP 3.5)", pct: 88, color: "#25D366" },
                    { label: "Caldera de gas", pct: 42, color: "#f59e0b" },
                    { label: "Calefacción eléctrica directa", pct: 25, color: "#ef4444" },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="mb-5 last:mb-0">
                      <div className="flex justify-between text-xs text-white/80 mb-1.5">
                        <span>{label}</span>
                        <span className="font-bold" style={{ color }}>{pct}% eficiencia</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-white/40 text-[10px] mt-6">* Valores orientativos basados en condiciones estándar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VENTAJAS ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Por qué elegirla</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Ventajas de la aerotermia</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Equipos disponibles</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Nuestros sistemas de aerotermia</h2>
            <p className="text-gray-500 text-sm mt-2">Precio con instalación incluida en Reus y Tarragona</p>
          </div>

          {products.length === 0 ? (
            <div className="max-w-lg mx-auto text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}>
                <Snowflake size={28} className="text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Catálogo en preparación</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                Estamos actualizando nuestro catálogo de aerotermia. Contáctanos por WhatsApp y te asesoramos con los mejores equipos según tus necesidades y presupuesto.
              </p>
              <a
                href={WA_TEXT}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                Consultar disponibilidad
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const price = Number(p.price);
                const disc = p.discountPrice ? Number(p.discountPrice) : null;
                const display = disc && disc < price ? disc : price;
                const pct = disc && disc < price ? Math.round(((price - disc) / price) * 100) : 0;
                return (
                  <Link key={p.id} href={`/producto/${p.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-44 flex items-center justify-center bg-gray-50 p-6">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.name} className="max-h-full object-contain" />
                      ) : (
                        <Wind size={64} strokeWidth={0.7} className="text-gray-200" />
                      )}
                    </div>
                    <div className="p-5">
                      {pct > 0 && (
                        <span className="inline-block text-xs font-bold text-white px-2 py-0.5 rounded-md mb-2" style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}>
                          -{pct}%
                        </span>
                      )}
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors leading-snug mb-1">{p.name}</h3>
                      {p.manufacturer && <p className="text-xs text-gray-400 mb-3">{p.manufacturer}</p>}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold" style={{ color: "#d97706" }}>{fmt(display)} €</span>
                        {pct > 0 && <span className="text-sm text-gray-400 line-through">{fmt(price)} €</span>}
                      </div>
                      <p className="text-[11px] text-primary-600 font-medium mt-1 flex items-center gap-1">
                        <CheckCircle2 size={11} />Instalación incluida
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CÓMO TRABAJAMOS ──────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">El proceso</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Instalación sin complicaciones</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="text-5xl font-black text-gray-100 mb-3 leading-none">{n}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20 px-4"
        style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">¿Listo para dar el salto a la aerotermia?</h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl mx-auto">
            Nuestro equipo de técnicos certificados en Reus y Tarragona te asesora sin compromiso. Calculamos el equipo ideal para tu hogar y te damos el presupuesto exacto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WA_TEXT}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              Presupuesto gratis por WhatsApp
            </a>
            <a
              href="tel:+34877234166"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white border border-white/25 hover:bg-white/10 transition-all"
            >
              <Phone size={15} />
              877 234 166
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
