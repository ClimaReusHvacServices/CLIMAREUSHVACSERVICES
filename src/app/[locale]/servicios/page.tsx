import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Footer from "@/components/landing/Footer";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

const SERVICES = [
  {
    href: "/servicios/instalacion",
    image: "/Imagenes/HVAC_exterior_negro.jpg",
    title: "Instalación de aire acondicionado en Reus y Tarragona",
    description: "Realizamos instalación de aire acondicionado tipo split, multisplit y bombas de calor adaptadas a las necesidades de cada espacio. Nuestro equipo técnico gestiona todo el proceso: desde la visita técnica hasta la puesta en marcha.",
  },
  {
    href: "/servicios/aerotermia",
    image: "/Imagenes/aerotermia_techo_aire_libre.jpg",
    title: "Instalación de sistemas de aerotermia",
    description: "La aerotermia es una de las soluciones más eficientes para climatizar viviendas y producir agua caliente sanitaria. Instalamos sistemas modernos que permiten calefacción, refrigeración y agua caliente con un solo equipo.",
  },
  {
    href: "/servicios/mantenimiento",
    image: "/Imagenes/Interior_confortable.jpg",
    title: "Mantenimiento preventivo de aire acondicionado",
    description: "El mantenimiento regular es imprescindible para mantener el rendimiento de los equipos de climatización y prevenir averías costosas. Nuestro servicio incluye revisión técnica, limpieza de filtros, control del gas refrigerante y verificación del sistema.",
  },
  {
    href: "/servicios/reparacion",
    image: "/Imagenes/Exterior_edificio.jpg",
    title: "Reparación de aire acondicionado",
    description: "Si tu sistema de climatización presenta fallos o no funciona correctamente, nuestro equipo técnico realiza diagnósticos rápidos y reparaciones profesionales. Trabajamos con diferentes tipos de sistemas HVAC y marcas reconocidas.",
  },
];

export const metadata = {
  title: "Servicios de Climatización en Reus | Clima Reus HVAC",
  description: "Instalación, mantenimiento y reparación de aire acondicionado y aerotermia en Reus y Tarragona. Instaladores certificados RITE.",
};

export default function ServiciosPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-16 px-4 text-center" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
        <span className="text-xs font-bold tracking-widest uppercase text-accent-300 mb-2 block">Nuestros servicios</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Soluciones de Climatización Profesional</h1>
        <p className="mt-3 text-white/70 text-base max-w-xl mx-auto">
          Instalación, mantenimiento y reparación con garantía certificada RITE.
          Más de 30 años creando el clima perfecto para tu hogar o negocio.
        </p>
      </div>

      {/* Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            href={s.href as any}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div
              className="h-48 bg-gray-100"
              style={{ backgroundImage: `url('${s.image}')`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <div className="p-5 flex flex-col flex-1">
              <h2 className="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                {s.description}
              </p>
              <span className="mt-4 text-sm font-semibold text-primary-600 group-hover:text-primary-800 transition-colors">
                Ver más →
              </span>
            </div>
          </Link>
        ))}
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
