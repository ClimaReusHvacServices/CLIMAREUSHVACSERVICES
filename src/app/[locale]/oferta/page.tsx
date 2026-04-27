import dynamic from "next/dynamic";
import { db } from "@/db";
import OfertaPageClient from "@/components/landing/OfertaPageClient";
import Footer from "@/components/landing/Footer";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

export const metadata = {
  title: "Ofertas y Catálogo de Equipos HVAC | Clima Reus",
  description: "Descubre nuestras ofertas y catálogo completo de equipos de climatización con instalación incluida en Reus y Tarragona.",
};

async function getAllProducts() {
  const rows = await db.product.findMany({
    where: { isActive: true },
    orderBy: [{ discountPrice: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(p => ({
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

export default async function OfertaPage() {
  const products = await getAllProducts();

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="pt-28 pb-12 px-4 text-center" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
        <span className="text-xs font-bold tracking-widest uppercase text-accent-300 mb-2 block">Tienda</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Equipos de Climatización</h1>
        <p className="mt-3 text-white/70 text-sm sm:text-base max-w-xl mx-auto">
          Los mejores equipos con instalación básica incluida. Gestiona tu confort todo el año.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-semibold text-primary-700">
            <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
            {products.filter(p => p.discountPrice !== null).length} en oferta
          </span>
          <span>{products.length} equipos disponibles</span>
          <span className="ml-auto font-medium text-primary-600">✓ Instalación básica incluida en todos</span>
        </div>
      </div>

      <OfertaPageClient products={products} />

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
