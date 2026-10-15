"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

type BlogPostData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  coverGradient?: string;
  date: string;
  category: string;
  readTime: number;
  isPublished: boolean;
};

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") throw new Error("No autorizado");
  return session.user.id;
}

function normalizeData(data: BlogPostData) {
  const title = data.title.trim();
  const slug = data.slug.trim().toLowerCase();
  const excerpt = data.excerpt.trim();
  const content = data.content.trim();
  const category = data.category.trim();

  if (!title || !slug || !excerpt || !content || !category) {
    throw new Error("Completa todos los campos obligatorios");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("El slug solo puede contener letras minúsculas, números y guiones");
  }
  if (data.readTime < 1 || data.readTime > 120) throw new Error("El tiempo de lectura no es válido");

  return {
    title,
    slug,
    excerpt,
    content,
    coverImage: data.coverImage?.trim() || null,
    coverGradient: data.coverGradient?.trim() || undefined,
    date: new Date(`${data.date}T12:00:00`),
    category,
    readTime: data.readTime,
    isPublished: data.isPublished,
  };
}

function revalidateBlog() {
  revalidatePath("/[locale]/blog", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");
  revalidatePath("/[locale]/admin/blog", "page");
}

export async function createBlogPost(data: BlogPostData) {
  const authorId = await checkAdmin();
  try {
    await db.blogPost.create({ data: { ...normalizeData(data), authorId } });
  } catch (error) {
    if (isMissingBlogTableError(error)) throw new Error("La tabla del blog aún no existe en la base de datos de Preview.");
    throw error;
  }
  revalidateBlog();
}

export async function updateBlogPost(id: string, data: BlogPostData) {
  const authorId = await checkAdmin();
  const normalized = normalizeData(data);
  if (id.startsWith("static:")) {
    try {
      await db.blogPost.create({ data: { ...normalized, authorId } });
    } catch (error) {
      if (isMissingBlogTableError(error)) throw new Error("La tabla del blog aún no existe en la base de datos de Preview.");
      throw error;
    }
  } else {
    try {
      await db.blogPost.update({ where: { id }, data: normalized });
    } catch (error) {
      if (isMissingBlogTableError(error)) throw new Error("La tabla del blog aún no existe en la base de datos de Preview.");
      throw error;
    }
  }
  revalidateBlog();
}

export async function deleteBlogPost(id: string) {
  await checkAdmin();
  try {
    await db.blogPost.delete({ where: { id } });
  } catch (error) {
    if (isMissingBlogTableError(error)) throw new Error("La tabla del blog aún no existe en la base de datos de Preview.");
    throw error;
  }
  revalidateBlog();
}

function isMissingBlogTableError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}
