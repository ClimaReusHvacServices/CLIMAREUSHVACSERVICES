import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/landing/Hero"));
const LogosMarquee = dynamic(() => import("@/components/landing/LogosMarquee"));
const ContactMap = dynamic(() => import("@/components/landing/ContactMap"));
const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (session) {
    if (session.user?.role === "admin") {
      redirect(`/${locale}/admin`);
    } else if (session.user?.role === "cliente") {
      redirect(`/${locale}/dashboard`);
    } else if (session.user?.role === "trabajador") {
      redirect(`/${locale}/worker`);
    }
  }

  // Render public landing page when not authenticated
  return (
    <main>
      <Navbar />
      {/* Hero with background slideshow */}
      <Hero />

      <section className="container mx-auto py-14">
        <h2 className="text-3xl font-bold text-center mb-6">Servicios profesionales de climatización</h2>
        <p className="text-center max-w-3xl mx-auto text-muted-foreground">Ofrecemos soluciones completas de climatización en Reus y toda la provincia de Tarragona.</p>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto">
          <LogosMarquee logos={["/Imagenes/HVAC_exterior_negro.jpg"]} />
        </div>
      </section>

      <section id="contact" className="container mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Datos de contacto</h3>
          <p className="mb-4">Carrer de Balmes 29, 43204 Reus — Tel: +34 607 953 886</p>
        </div>
        <div>
          <ContactMap />
        </div>
      </section>
      <WhatsAppButton />
    </main>
  );
}
