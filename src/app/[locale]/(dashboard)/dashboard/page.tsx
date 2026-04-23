import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { ShopCatalog } from "@/components/shop/ShopCatalog";

async function getCatalogData() {
  const [products, services, packages] = await Promise.all([
    db.product.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    db.service.findMany({ where: { isActive: true }, orderBy: { type: "asc" } }),
    db.servicePackage.findMany({
      where: { isActive: true },
      include: {
        product: true,
        service: true,
      },
    }),
  ]);
  return { products, services, packages };
}

export default async function ClienteDashboard() {
  const session = await auth();
  if (!session || session.user?.role !== "cliente") redirect("/");

  const { products, services, packages } = await getCatalogData();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #00674F 0%, #005240 60%, #4CAAC9 100%)" }}>
        <div className="px-8 py-10">
          <p className="text-primary-200 text-sm font-semibold uppercase tracking-wider mb-2">Bienvenido, {session.user.firstName}</p>
          <h1 className="text-3xl font-bold text-white mb-2">Nuestros Productos y Servicios</h1>
          <p className="text-primary-100 text-base">Climatizacion profesional para tu hogar y empresa en Reus y alrededores.</p>
        </div>
      </div>

      <ShopCatalog products={products} services={services} packages={packages} />
    </div>
  );
}
