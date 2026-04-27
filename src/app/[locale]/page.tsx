import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import dynamic from "next/dynamic";
import { ProductsSection } from "@/components/landing/ProductsSection";
import BrandsSection from "@/components/landing/BrandsSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";

const Hero = dynamic(() => import("@/components/landing/Hero"));
const ContactMap = dynamic(() => import("@/components/landing/ContactMap"));
const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

async function getActiveProducts() {
  const rows = await db.product.findMany({
    where: { isActive: true },
    orderBy: [
      { discountPrice: "asc" },
      { createdAt: "desc" },
    ],
    take: 9,
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    manufacturer: p.manufacturer,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    warranty: p.warranty,
    stock: p.stock,
  }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (session) {
    if (session.user?.role === "admin")      redirect(`/${locale}/admin`);
    if (session.user?.role === "cliente")    redirect(`/${locale}/dashboard`);
    if (session.user?.role === "trabajador") redirect(`/${locale}/worker`);
  }

  const products = await getActiveProducts();

  return (
    <main>
      <Navbar />

      {/* Section 1 — Hero */}
      <Hero />

      {/* Section 2 — Products / Offers */}
      <ProductsSection products={products} />

      {/* Section 3 — Why choose us (moved up to follow Products) */}
      <WhyChooseUs />

      {/* Section 4 — Brands */}
      <BrandsSection />

      {/* Section 5 — Contact */}
      <section id="contact" className="container mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Datos de contacto</h3>
          <p className="text-gray-600 mb-2">Carrer de Balmes 29, 43204 Reus</p>
          <p className="text-gray-600 mb-1">
            Tel. fijo:{" "}
            <a href="tel:+34877234166" className="font-semibold text-primary-700 hover:underline">
              877 234 166
            </a>
          </p>
          <p className="text-gray-600">
            WhatsApp:{" "}
            <a href="https://wa.me/34607953886" className="font-semibold text-primary-700 hover:underline">
              607 953 886
            </a>
          </p>
        </div>
        <div>
          <ContactMap />
        </div>
      </section>

      <WhatsAppButton />

      {/* Footer */}
      <footer className="border-t border-primary-100 mt-8">
        <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">&copy; 2026 Clima Reus HVAC. Todos los derechos reservados.</div>

          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/climareushvacservices" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-primary-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm5 6.5A4.5 4.5 0 1016.5 13 4.51 4.51 0 0012 8.5zm6.5-2.6a1.05 1.05 0 11-1.05-1.05A1.05 1.05 0 0118.5 5.9zM12 10.5A1.5 1.5 0 1113.5 12 1.5 1.5 0 0112 10.5z" />
              </svg>
            </a>

            <a href="https://wa.me/34607953886" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-green-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.199.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.476-.885-.788-1.482-1.761-1.655-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.199-.298.298-.497.1-.198.05-.372-.025-.52-.074-.149-.672-1.62-.923-2.219-.242-.583-.487-.503-.672-.513l-.573-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.273-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.849L.509 21.83a.5.5 0 00.611.637l4.106-1.066A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
