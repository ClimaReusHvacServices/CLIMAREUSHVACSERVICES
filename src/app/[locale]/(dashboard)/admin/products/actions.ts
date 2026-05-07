"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") throw new Error("Unauthorized");
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function createProduct(data: {
  name: string; description: string; category: string; categoryId?: string; manufacturer?: string;
  price: number; discountPrice?: number; stock: number; warranty?: string;
  isActive: boolean; imageUrl?: string; specifications?: string;
}) {
  await checkAdmin();
  await db.product.create({
    data: {
      name: data.name, description: data.description, category: data.category,
      categoryId: data.categoryId ?? null,
      manufacturer: data.manufacturer ?? null,
      price: data.price, discountPrice: data.discountPrice ?? null,
      stock: data.stock, warranty: data.warranty ?? null,
      isActive: data.isActive,
      sku: `SKU-${Date.now()}`,
      images: data.imageUrl ? [data.imageUrl] : [],
      specifications: data.specifications ?? null,
    },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function updateProduct(id: string, data: {
  name: string; description: string; category: string; categoryId?: string; manufacturer?: string;
  price: number; discountPrice?: number; stock: number; warranty?: string;
  isActive: boolean; imageUrl?: string; specifications?: string;
}) {
  await checkAdmin();
  await db.product.update({
    where: { id },
    data: {
      name: data.name, description: data.description, category: data.category,
      categoryId: data.categoryId ?? null,
      manufacturer: data.manufacturer ?? null,
      price: data.price, discountPrice: data.discountPrice ?? null,
      stock: data.stock, warranty: data.warranty ?? null,
      isActive: data.isActive,
      images: data.imageUrl ? [data.imageUrl] : [],
      specifications: data.specifications ?? null,
    },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  await db.product.delete({ where: { id } });
  revalidatePath("/[locale]/admin/products", "page");
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function createService(data: {
  name: string; description: string; type: string;
  basePrice: number; estimatedDuration: number; difficulty: string; isActive: boolean;
}) {
  await checkAdmin();
  await db.service.create({ data });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function updateService(id: string, data: {
  name: string; description: string; type: string;
  basePrice: number; estimatedDuration: number; difficulty: string; isActive: boolean;
}) {
  await checkAdmin();
  await db.service.update({ where: { id }, data });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function deleteService(id: string) {
  await checkAdmin();
  await db.service.delete({ where: { id } });
  revalidatePath("/[locale]/admin/products", "page");
}

// ─── Packages ─────────────────────────────────────────────────────────────────

export async function createPackage(data: {
  name: string; description: string; productId: string; serviceId: string;
  packagePrice: number; discountPercentage?: number; isActive: boolean;
}) {
  await checkAdmin();
  await db.servicePackage.create({
    data: {
      name: data.name, description: data.description,
      productId: data.productId, serviceId: data.serviceId,
      packagePrice: data.packagePrice,
      discountPercentage: data.discountPercentage ?? null,
      isActive: data.isActive,
    },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function updatePackage(id: string, data: {
  name: string; description: string; productId: string; serviceId: string;
  packagePrice: number; discountPercentage?: number; isActive: boolean;
}) {
  await checkAdmin();
  await db.servicePackage.update({
    where: { id },
    data: {
      name: data.name, description: data.description,
      productId: data.productId, serviceId: data.serviceId,
      packagePrice: data.packagePrice,
      discountPercentage: data.discountPercentage ?? null,
      isActive: data.isActive,
    },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function deletePackage(id: string) {
  await checkAdmin();
  await db.servicePackage.delete({ where: { id } });
  revalidatePath("/[locale]/admin/products", "page");
}

// ─── Categories ───────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

export async function createCategory(data: { name: string; isActive: boolean }) {
  await checkAdmin();
  await db.productCategory.create({
    data: { name: data.name, slug: toSlug(data.name), isActive: data.isActive },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function updateCategory(id: string, data: { name: string; isActive: boolean }) {
  await checkAdmin();
  await db.productCategory.update({
    where: { id },
    data: { name: data.name, slug: toSlug(data.name), isActive: data.isActive },
  });
  revalidatePath("/[locale]/admin/products", "page");
}

export async function deleteCategory(id: string) {
  await checkAdmin();
  const count = await db.product.count({ where: { categoryId: id } });
  if (count > 0) throw new Error("CATEGORY_HAS_PRODUCTS");
  await db.productCategory.delete({ where: { id } });
  revalidatePath("/[locale]/admin/products", "page");
}

// ─── Ofertas ──────────────────────────────────────────────────────────────────

export async function setProductDiscount(id: string, discountPrice: number | null) {
  await checkAdmin();
  await db.product.update({ where: { id }, data: { discountPrice } });
  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/oferta", "page");
}
