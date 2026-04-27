import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Package, Wrench, Box } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

async function getProductsData() {
  const [products, services, packages] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.service.findMany({ orderBy: { createdAt: "desc" } }),
    db.servicePackage.findMany({
      include: {
        product: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { products, services, packages };
}

export default async function AdminProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab = "products" } = await searchParams;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const { products, services, packages } = await getProductsData();
  const t = await getTranslations("adminProducts");

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package size={24} className="text-primary-600" />
          {t("title")}
        </h1>
      </div>

      {/* Tabs navegación */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <TabLink href="/admin/products?tab=products" active={tab === "products"} label={t("tabProducts")} />
        <TabLink href="/admin/products?tab=services" active={tab === "services"} label={t("tabServices")} />
        <TabLink href="/admin/products?tab=packages" active={tab === "packages"} label={t("tabPackages")} />
      </div>

      {/* Tab: Equipos */}
      {tab === "products" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-primary-600" />
            <h2 className="font-bold text-gray-900">{t("tabProducts")}</h2>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{products.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colCategory")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStock")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                      <Package size={36} className="mx-auto mb-3 text-gray-200" />
                      {t("noProducts")}
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        {p.manufacturer && <p className="text-xs text-gray-400">{p.manufacturer}</p>}
                      </td>
                      <td className="py-3 px-3 text-gray-600">{p.category}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">
                        {p.discountPrice ? (
                          <span>
                            <span className="text-primary-600">€{Number(p.discountPrice).toFixed(2)}</span>
                            <span className="text-gray-400 line-through ml-1 text-xs">€{Number(p.price).toFixed(2)}</span>
                          </span>
                        ) : (
                          `€${Number(p.price).toFixed(2)}`
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-600">{p.stock}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${p.isActive ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-600"}`}>
                          {p.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Servicios */}
      {tab === "services" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={18} className="text-accent-500" />
            <h2 className="font-bold text-gray-900">{t("tabServices")}</h2>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{services.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colType")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colDuration")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colDifficulty")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      <Wrench size={36} className="mx-auto mb-3 text-gray-200" />
                      {t("noServices")}
                    </td>
                  </tr>
                ) : (
                  services.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{s.name}</td>
                      <td className="py-3 px-3 text-gray-600">{s.type}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">€{Number(s.basePrice).toFixed(2)}</td>
                      <td className="py-3 px-3 text-gray-600">{s.estimatedDuration} {t("min")}</td>
                      <td className="py-3 px-3 text-gray-600">{s.difficulty}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${s.isActive ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-600"}`}>
                          {s.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Paquetes */}
      {tab === "packages" && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Box size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">{t("tabPackages")}</h2>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{packages.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colProduct")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colService")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colPrice")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colDiscount")}</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                      <Box size={36} className="mx-auto mb-3 text-gray-200" />
                      {t("noPackages")}
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{pkg.name}</td>
                      <td className="py-3 px-3 text-gray-600">{pkg.product.name}</td>
                      <td className="py-3 px-3 text-gray-600">{pkg.service.name}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">€{Number(pkg.packagePrice).toFixed(2)}</td>
                      <td className="py-3 px-3 text-gray-600">
                        {pkg.discountPercentage ? `${Number(pkg.discountPercentage)}%` : "-"}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${pkg.isActive ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-600"}`}>
                          {pkg.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TabLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href as any}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </Link>
  );
}
