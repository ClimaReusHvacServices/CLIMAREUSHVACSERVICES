import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Footer from "@/components/landing/Footer";
import {
  CheckCircle2, MapPin, Phone, Shield, Users, Wrench,
  ChevronRight, Award, Clock, ThumbsUp, Zap,
} from "lucide-react";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

import { WA_SOBRE_NOSOTROS as WA_TEXT } from "@/lib/whatsapp";

export async function generateMetadata() {
  return {
    title: "Sobre Nosotros | Clima HVAC Service - Reus y Tarragona",
    description: "Somos especialistas en instalación de aire acondicionado, aerotermia y calderas en Reus y Tarragona. Conoce a nuestro equipo.",
  };
}

const VALUES = [
  {
    icon: Award,
    color: "text-amber-500",
    bg: "bg-amber-50",
    title: "Calidad certificada",
    desc: "Todos nuestros técnicos poseen certificaciones oficiales en instalaciones de climatización y gas. Trabajamos únicamente con equipos de primeras marcas.",
  },
  {
    icon: ThumbsUp,
    color: "text-blue-500",
    bg: "bg-blue-50",
    title: "Transparencia total",
    desc: "Presupuesto detallado antes de comenzar cualquier trabajo. Sin sorpresas ni costes ocultos. Lo que acordamos es lo que pagas.",
  },
  {
    icon: Clock,
    color: "text-primary-500",
    bg: "bg-primary-50",
    title: "Respuesta rápida",
    desc: "Contestamos en menos de 24 horas y realizamos la instalación en los plazos acordados. Tu tiempo es tan valioso como el nuestro.",
  },
  {
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-50",
    title: "Garantía real",
    desc: "Ofrecemos garantía en todos los trabajos de instalación. Si algo falla por nuestra parte, lo solucionamos sin coste adicional.",
  },
  {
    icon: MapPin,
    color: "text-red-500",
    bg: "bg-red-50",
    title: "Servicio local",
    desc: "Somos una empresa de Reus con presencia en toda la provincia de Tarragona. Conocemos la zona y llegamos rápido donde nos necesitas.",
  },
  {
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-50",
    title: "Eficiencia energética",
    desc: "Nos especializamos en soluciones de alta eficiencia que reducen el consumo eléctrico y el impacto ambiental de tu hogar o negocio.",
  },
];

const SERVICES_LIST = [
  "Instalación de aire acondicionado split y multisplit",
  "Instalación y sustitución de calderas de gas de condensación",
  "Sistemas de aerotermia para calefacción, frío y ACS",
  "Mantenimiento preventivo y correctivo de climatización",
  "Reparación de averías en equipos de aire acondicionado",
  "Asesoramiento energético para viviendas y negocios",
  "Instalaciones en locales comerciales y oficinas",
  "Tramitación de certificados y documentación técnica",
];

const AREAS = [
  "Reus", "Tarragona", "Salou", "Cambrils",
  "Vila-seca", "Constantí", "Riudoms", "Valls",
  "Torredembarra", "Calafell", "El Vendrell",
];

export default async function SobreNosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        data-logo="white"
        className="relative overflow-hidden pt-32 pb-20 px-4"
        style={{ background: "linear-gradient(150deg, #008f65 0%, #1d7291 60%, #083a57 100%)" }}
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <span className="text-white/80">Sobre nosotros</span>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-white/60 mb-4 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Clima HVAC Service · Reus
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Especialistas en climatización en Reus y Tarragona
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl">
              Instalamos, reparamos y mantenemos sistemas de aire acondicionado, aerotermia y calderas de gas. Técnicos certificados, atención personalizada y compromiso con la calidad en cada instalación.
            </p>
          </div>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────────────── */}
      <section data-logo="green" className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-4">Nuestra experiencia</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                Profesionales en climatización para hogares y empresas
              </h2>
              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                <p>
                  En Clima HVAC Service ofrecemos soluciones de climatización para viviendas, locales y empresas en Reus, Tarragona y alrededores.
                </p>
                <p>
                  Contamos con técnicos habilitados y experiencia en instalación, mantenimiento y reparación de equipos de aire acondicionado, calefacción y aerotermia.
                </p>
                <p>
                  Trabajamos con equipos de alta eficiencia energética y primeras marcas del sector, garantizando instalaciones seguras, eficientes y adaptadas a cada cliente.
                </p>
                <p>
                  Nuestro objetivo es ofrecer un servicio profesional, cercano y rápido, cuidando cada instalación con atención al detalle y cumpliendo la normativa vigente.
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "100%", label: "Instalaciones certificadas RITE", color: "from-primary-500 to-primary-600" },
                { val: "+200", label: "Clientes satisfechos en Tarragona", color: "from-teal-500 to-teal-600" },
                { val: "24h", label: "Tiempo máximo de respuesta", color: "from-amber-500 to-amber-600" },
                { val: "5★", label: "Valoración media de nuestros clientes", color: "from-violet-500 to-violet-600" },
              ].map(({ val, label, color }) => (
                <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white text-center`}>
                  <p className="text-3xl font-extrabold mb-1">{val}</p>
                  <p className="text-white/80 text-xs leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">Lo que nos define</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(({ icon: Icon, color, bg, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
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

      {/* ── SERVICIOS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-4">Qué hacemos</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Todo lo que necesitas para climatizar tu hogar</h2>
              <ul className="space-y-3">
                {SERVICES_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2 size={15} className="text-primary-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/servicios"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                >
                  <Wrench size={14} />
                  Ver todos los servicios
                </Link>
                <Link
                  href="/oferta"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Ver catálogo de equipos
                </Link>
              </div>
            </div>

            {/* Service area */}
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-4">Zona de actuación</span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Servicio en toda la provincia de Tarragona</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Operamos principalmente en Reus y alrededores, cubriendo toda el área metropolitana de Tarragona y el Camp de Tarragona.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {AREAS.map((area) => (
                  <span key={area} className="flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                    <MapPin size={10} />
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400">¿Tu municipio no está en la lista? Contáctanos y valoramos si podemos atenderte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-3">El equipo</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Técnicos que se implican</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">Nuestros profesionales llevan años resolviendo todo tipo de instalaciones en Reus y la provincia de Tarragona</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { label: "Técnicos especializados en HVAC", icon: Wrench },
              { label: "Certificados en instalaciones de gas", icon: Shield },
              { label: "Formación continua en nuevas tecnologías", icon: Award },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20 px-4"
        style={{ background: "linear-gradient(135deg, #008f65 0%, #1d7291 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <Users size={36} className="text-white/50 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">¿Hablamos?</h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl mx-auto">
            Cuéntanos lo que necesitas. Te respondemos en menos de 24 horas y te preparamos un presupuesto sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WA_TEXT}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              Contactar por WhatsApp
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
