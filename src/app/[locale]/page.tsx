import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import dynamic from "next/dynamic";
import { ProductsSection } from "@/components/landing/ProductsSection";

const Hero = dynamic(() => import("@/components/landing/Hero"));
const LogosMarquee = dynamic(() => import("@/components/landing/LogosMarquee"));
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

      {/* Section 3 — Logos marquee */}
      <section id="servicios" className="bg-white py-8">
        <div className="container mx-auto px-4">
          <LogosMarquee logos={["/Imagenes/HVAC_exterior_negro.jpg"]} />
        </div>
      </section>

      {/* Section 4 — Contact */}
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
    </main>
  );
}
