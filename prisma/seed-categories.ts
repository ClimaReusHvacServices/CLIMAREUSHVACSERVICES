import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const CATEGORIES = [
  { name: "Aire Acondicionado Split",     slug: "aire-acondicionado", icon: "Wind" },
  { name: "Aire Acondicionado Multisplit", slug: "multisplit",         icon: "Wind" },
  { name: "Aerotermia",                   slug: "aerotermia",         icon: "Thermometer" },
  { name: "Caldera de Gas",               slug: "calderas",           icon: "Flame" },
  { name: "Accesorios y Repuestos",       slug: "accesorios",         icon: "Wrench" },
];

async function main() {
  for (const cat of CATEGORIES) {
    const result = await db.productCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
    console.log("✓", result.name);
  }
  console.log("Categorías sincronizadas correctamente.");
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
