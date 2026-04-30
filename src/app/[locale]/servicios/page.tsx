import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import Footer from "@/components/landing/Footer";
import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

export const metadata = {
  title: "Servicios de Climatización en Reus | Clima HVAC Service",
  description: "Instalación, mantenimiento y reparación de aire acondicionado y aerotermia en Reus y Tarragona. Instaladores certificados RITE.",
};

export default async function ServiciosPage() {
  const t = await getTranslations("landing");

  const SERVICES = [
    {
      href: "/servicios/instalacion",
      image: "/Imagenes/HVAC_exterior_negro.jpg",
      title: t("serviciosPage.s1title"),
      description: t("serviciosPage.s1desc"),
    },
    {
      href: "/servicios/aerotermia",
      image: "/Imagenes/aerotermia_techo_aire_libre.jpg",
      title: t("serviciosPage.s2title"),
      description: t("serviciosPage.s2desc"),
    },
    {
      href: "/servicios/mantenimiento",
      image: "/Imagenes/Interior_confortable.jpg",
      title: t("serviciosPage.s3title"),
      description: t("serviciosPage.s3desc"),
    },
    {
      href: "/servicios/reparacion",
      image: "/Imagenes/Exterior_edificio.jpg",
      title: t("serviciosPage.s4title"),
      description: t("serviciosPage.s4desc"),
    },
  ];

  return (
    <main>
      <Navbar />

      {/* Hero — dark bg → white logo */}
      <div data-logo="white">
        <div className="pt-28 pb-16 px-4 text-center" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
          <span className="text-xs font-bold tracking-widest uppercase text-accent-300 mb-2 block">{t("serviciosPage.badge")}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t("serviciosPage.title")}</h1>
          <p className="mt-3 text-white/70 text-base max-w-xl mx-auto">
            {t("serviciosPage.subtitle")}
          </p>
        </div>
      </div>

      {/* Grid — white bg → green logo */}
      <div data-logo="green">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERVICES.map((s, i) => (
          <ScrollReveal key={s.href} delay={i * 100}>
            <Link
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
                  {t("serviciosPage.ctaMore")}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </section>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
