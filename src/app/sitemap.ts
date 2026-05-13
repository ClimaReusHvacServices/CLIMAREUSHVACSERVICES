import { MetadataRoute } from "next";
import { db } from "@/db";

const BASE = "https://climareushvacservices.es";
const LOCALES = ["es", "en", "ca"] as const;

function urls(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return LOCALES.map((locale) => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({ where: { isActive: true }, select: { id: true, updatedAt: true } });

  const staticPages = [
    ...urls("", 1.0, "weekly"),
    ...urls("/oferta", 0.9, "daily"),
    ...urls("/servicios", 0.8, "monthly"),
    ...urls("/servicios/instalacion", 0.7, "monthly"),
    ...urls("/servicios/mantenimiento", 0.7, "monthly"),
    ...urls("/servicios/aerotermia", 0.7, "monthly"),
    ...urls("/aerotermia", 0.8, "monthly"),
    ...urls("/calderas", 0.8, "monthly"),
    ...urls("/sobre-nosotros", 0.6, "monthly"),
    ...urls("/blog", 0.7, "weekly"),
  ];

  const productPages = products.flatMap((p) =>
    LOCALES.map((locale) => ({
      url: `${BASE}/${locale}/producto/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...productPages];
}
