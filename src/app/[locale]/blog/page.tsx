import dynamic from "next/dynamic";
import { getPublishedPosts } from "@/lib/blog";
import Footer from "@/components/landing/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

export const metadata: Metadata = {
  title: "Blog de Climatización | Clima HVAC Service",
  description: "Guías, consejos y novedades sobre aire acondicionado y climatización en Reus y Tarragona.",
};

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  const posts = await getPublishedPosts();

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <div data-logo="white">
        <div className="pt-28 pb-16 px-4 text-center" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-accent-300 mb-3">
            <BookOpen size={12} />
            {t("blogPage.badge")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{t("blogPage.title")}</h1>
          <p className="mt-4 text-white/70 text-sm sm:text-base max-w-xl mx-auto">{t("blogPage.subtitle")}</p>
        </div>
      </div>

      {/* Artículos */}
      <div data-logo="green">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">{t("blogPage.noArticles")}</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}` as any} className="group block">
                  <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden h-full flex flex-col border border-gray-100/80">
                    {/* Cover */}
                    <div className="h-48 relative overflow-hidden" style={{ background: post.coverGradient }}>
                      {post.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      {/* Decoración visual sobre el gradiente */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <BookOpen size={80} className="text-white" />
                      </div>
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    {/* Contenido */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(post.date, locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.readTime} {t("blogPage.readTime")}
                        </span>
                      </div>
                      <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 flex-1 group-hover:text-primary-700 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                        {t("blogPage.readMore")} <ArrowRight size={14} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
