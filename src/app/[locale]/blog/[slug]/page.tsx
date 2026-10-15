import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog";
import Footer from "@/components/landing/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Calendar, Clock, ArrowLeft, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Clima HVAC Service`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "ca" ? "ca-ES" : locale === "en" ? "en-GB" : "es-ES",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

function renderArticleContent(content: string): ReactNode {
  if (content.includes("<p>") || content.includes("<h2>") || content.includes("<ul>")) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return content
    .split(/\n{2,}/)
    .map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 whitespace-pre-line">{paragraph}</p>
    ));
}

function ComparisonTable() {
  const rows = [
    ["N° de estancias", "1", "Varias"],
    ["Unidad exterior", "1 por unidad", "1 para todas"],
    ["Coste inicial", "Más bajo", "Más alto"],
    ["Eficiencia energética", "Variable", "Puede ser mayor"],
    ["Control por habitación", "Sí (cada unidad por separado)", "Sí (independiente por interiores)"],
    ["Instalación", "Simple", "Más compleja"],
  ];
  return (
    <div className="mt-8">
      <h2>Comparativa clave: Split vs Multisplit</h2>
      <table><thead><tr><th>Característica</th><th>Split</th><th>Multisplit</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <td key={cell}><strong>{cell}</strong></td> : <td key={cell}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [t, post] = await Promise.all([getTranslations("landing"), getPublishedPostBySlug(slug)]);
  if (!post) notFound();

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero del artículo */}
      <div data-logo="white">
        <div className="pt-24 pb-10" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4">
            <Link
              href={"/blog" as any}
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors mb-6"
            >
              <ArrowLeft size={13} />
              {t("blogPage.backToBlog")}
            </Link>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-accent-300 mb-3 px-2.5 py-1 bg-white/10 rounded-full">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-white/60 text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(post.date, locale)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.readTime} {t("blogPage.readTime")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo del artículo */}
      <div data-logo="green">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 blog-content">
            {renderArticleContent(post.content)}
            {post.showComparisonTable && <ComparisonTable />}
            {post.tipText && <div className="nota-final"><p>{post.tipText}</p></div>}
          </div>

          {/* Botón volver */}
          <div className="mt-8">
            <Link
              href={"/blog" as any}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-white rounded-xl border border-primary-200 hover:bg-primary-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={14} />
              {t("blogPage.backToBlog")}
            </Link>
          </div>
        </div>

        {/* CTA de contacto */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-14">
          <div
            className="rounded-2xl p-8 sm:p-10 text-white text-center"
            style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 100%)" }}
          >
            <h3 className="text-xl sm:text-2xl font-extrabold mb-2">{t("blogPage.ctaTitle")}</h3>
            <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">{t("blogPage.ctaSubtitle")}</p>
            <a
              href="tel:+34877234166"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-primary-900 hover:bg-primary-50 transition-colors shadow-lg"
            >
              <Phone size={15} />
              {t("blogPage.ctaButton")}
            </a>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
