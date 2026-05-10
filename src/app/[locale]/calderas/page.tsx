import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Footer from "@/components/landing/Footer";
import {
  CheckCircle2, Flame, Phone, ChevronRight, Wind,
  AlertTriangle, Wrench, Shield, Clock,
} from "lucide-react";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

const WA_NUMBER = "34607953886";
const WA_CALDERAS = encodeURIComponent("Hola, les escribo desde vuestra página web. Me interesa información sobre calderas de gas. ¿Podéis asesorarme y darme presupuesto?");

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: "Calderas de Gas en Reus y Tarragona | Clima HVAC Service",
    description: "Instalación y sustitución de calderas de gas en Reus y Tarragona. Técnicos certificados, presupuesto gratuito.",
  };
}

async function getCalderasProducts() {
  return db.product.findMany({
    where: {
      isActive: true,
      OR: [
        { pageLocation: "calderas" },
        { pageLocation: null, productType: "boiler" },
        { pageLocation: null, productType: null, category: { contains: "caldera", mode: "insensitive" } },
        { pageLocation: null, productType: null, productCategory: { slug: "calderas" } },
      ],
    },
    orderBy: [{ isFeatured: "desc" }, { price: "asc" }],
  });
}

function fmt(n: number) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const REASONS = [
  {
    icon: Clock,
    title: "Tu caldera tiene más de 15 años",
    desc: "Las calderas antiguas son mucho menos eficientes. Cambiarla por una de condensación moderna puede reducir tu consumo de gas hasta un 30%.",
  },
  {
    icon: AlertTriangle,
    title: "Las reparaciones se repiten",
    desc: "Si ya has reparado la caldera dos o más veces en los últimos años, probablemente el coste de mantenerla supera el de sustituirla.",
  },
  {
    icon: Flame,
    title: "Tu factura de gas no para de subir",
    desc: "Las calderas de condensación actuales aprovechan hasta el 109% del poder calorífico del gas. La diferencia en la factura es notable desde el primer mes.",
  },
  {
    icon: Wrench,
    title: "La calefacción no calienta como antes",
    desc: "Si notas que el sistema tarda mucho en calentar o hay zonas frías en casa, puede ser señal de que la eficiencia del equipo ha caído considerablemente.",
  },
];

const PROCESS = [
  { n: "01", title: "Consulta gratuita", desc: "Cuéntanos tu situación actual: tipo de caldera, antigüedad, superficie a calentar y número de personas." },
  { n: "02", title: "Selección del equipo", desc: "Te recomendamos la caldera más adecuada en potencia y eficiencia para tu vivienda, sin sobredimensionar." },
  { n: "03", title: "Sustitución profesional", desc: "Retiramos la antigua, instalamos la nueva en el mismo espacio y realizamos todas las pruebas de seguridad." },
  { n: "04", title: "Puesta en marcha", desc: "Ajustamos los parámetros, tramitamos la documentación técnica y te explicamos el funcionamiento." },
];

export default async function CalderasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const products = await getCalderasProducts();

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        data-logo="white"
        className="relative overflow-hidden pt-32 pb-20 px-4"
        style={{ background: "linear-gradient(150deg, #1a1a2e 0%, #2d1b69 40%, #11998e 100%)" }}
      >
        <div className="absolute -top-10 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">Calderas de Gas</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 mb-4 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Instalación y sustitución
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Calderas de gas en Reus y Tarragona
              </h1>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Instalamos y sustituimos calderas de gas de condensación con la máxima eficiencia. Técnicos certificados, tramitación incluida y presupuesto sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_CALDERAS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Pide presupuesto gratis
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

            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "30%", label: "Ahorro vs caldera antigua" },
                { val: "72h", label: "Instalación en menos de 72h" },
                { val: "2 años", label: "Garantía en instalación" },
                { val: "RITE", label: "Certificación reglamentaria" },
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

      {/* ── CUÁNDO RENOVAR ──────────────────────────────────── */}
      <section data-logo="green" className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Señales de alerta</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">¿Cuándo es el momento de cambiar tu caldera?</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">Renovar a tiempo ahorra dinero y evita averías en los momentos más inconvenientes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REASONS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTÍAS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}>
            <div className="px-8 py-10 sm:px-14 sm:py-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { icon: Shield, val: "3 años", label: "Garantía de fabricante en el equipo" },
                { icon: Wrench, val: "2 años", label: "Garantía Clima HVAC en la instalación" },
                { icon: CheckCircle2, val: "RITE", label: "Instalación según reglamento térmico" },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label}>
                  <Icon size={28} className="text-white/60 mx-auto mb-3" />
                  <p className="text-3xl font-extrabold text-white mb-1">{val}</p>
                  <p className="text-white/65 text-xs leading-relaxed">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Nuestros equipos</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Calderas disponibles</h2>
            <p className="text-gray-500 text-sm mt-2">Precio incluye suministro e instalación en Reus y Tarragona</p>
          </div>

          {products.length === 0 ? (
            <div className="max-w-lg mx-auto text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-amber-50">
                <Flame size={28} className="text-amber-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Catálogo de calderas</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                Próximamente publicamos nuestro catálogo completo. Mientras tanto, contáctanos por WhatsApp y te ofrecemos las mejores opciones de calderas de condensación con instalación incluida.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_CALDERAS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-md"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Consultar por WhatsApp
                </a>
                <a
                  href="tel:+34877234166"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <Phone size={15} />
                  Llamar ahora
                </a>
              </div>
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
                        <Flame size={64} strokeWidth={0.7} className="text-gray-200" />
                      )}
                    </div>
                    <div className="p-5">
                      {pct > 0 && (
                        <span className="inline-block text-xs font-bold text-white px-2 py-0.5 rounded-md mb-2 bg-amber-500">
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
                        <CheckCircle2 size={11} />Suministro e instalación incluida
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── PROCESO ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Cómo trabajamos</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Del presupuesto a la puesta en marcha</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map(({ n, title, desc }) => (
              <div key={n}>
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
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #11998e 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">¿Necesitas renovar tu caldera?</h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl mx-auto">
            Cuéntanos tu situación y te preparamos un presupuesto sin compromiso. Instalación en menos de 72 horas en toda el área de Reus y Tarragona.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_CALDERAS}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              Solicitar presupuesto
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
