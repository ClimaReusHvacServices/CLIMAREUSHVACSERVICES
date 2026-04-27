import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Package } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { ProductsManager } from "@/components/admin/ProductsManager";

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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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

      <ProductsManager
        products={products as any}
        services={services as any}
        packages={packages as any}
      />
    </div>
  );
}
