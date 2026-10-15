import { auth } from "@/auth/config";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BookOpen } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { BlogManager } from "@/components/admin/BlogManager";
import { getAllPosts } from "@/lib/blog";
import { Prisma } from "@prisma/client";
import type { ComparisonTableData } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  let databasePosts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    coverGradient: string;
    date: Date;
    category: string;
    readTime: number;
    isPublished: boolean;
    showComparisonTable: boolean;
    comparisonTable: string | null;
    tipText: string | null;
  }> = [];
  let databaseReady = true;
  try {
    databasePosts = await db.blogPost.findMany({ orderBy: { date: "desc" } });
  } catch (error) {
    if (!isMissingBlogTableError(error)) throw error;
    databaseReady = false;
  }
  const databaseSlugs = new Set(databasePosts.map(post => post.slug));
  const posts = [
    ...databasePosts.map(post => ({
      ...post,
      date: post.date.toISOString().slice(0, 10),
      comparisonTable: parseComparisonTable(post.comparisonTable),
    })),
    ...getAllPosts()
      .filter(post => !databaseSlugs.has(post.slug))
      .map(post => ({ ...post, id: `static:${post.slug}`, date: post.date, isPublished: true })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-5">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={24} className="text-primary-600" />
          Gestión del blog
        </h1>
        <p className="text-sm text-gray-500 mt-1">Crea, edita y publica artículos con texto e imagen de portada.</p>
      </div>
      <BlogManager posts={posts} databaseReady={databaseReady} />
    </div>
  );
}

function isMissingBlogTableError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021";
}

function parseComparisonTable(value: string | null): ComparisonTableData | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as ComparisonTableData;
    return parsed.title && parsed.headers.length === 3 && Array.isArray(parsed.rows) ? parsed : null;
  } catch {
    return null;
  }
}
