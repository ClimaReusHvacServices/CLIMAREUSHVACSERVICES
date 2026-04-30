import { auth } from "@/auth/config";
import { db } from "@/db";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { ProductsSection } from "@/components/landing/ProductsSection";
import BrandsSection from "@/components/landing/BrandsSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const Hero = dynamic(() => import("@/components/landing/Hero"));
const ContactMap = dynamic(() => import("@/components/landing/ContactMap"));
const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

async function getActiveProducts() {
  const rows = await db.product.findMany({
    where: { isActive: true },
    orderBy: [
      { discountPrice: "asc" },
      { createdAt: "desc" },
    ],
    take: 9,
  });
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    manufacturer: p.manufacturer,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    warranty: p.warranty,
    stock: p.stock,
    images: p.images,
  }));
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [session, t, products] = await Promise.all([
    auth(),
    getTranslations("landing"),
    getActiveProducts(),
  ]);


  return (
    <main>
      <Navbar />

      {/* Section 1 — Hero */}
      <Hero />

      {/* Section 2 — Products / Offers */}
      <ScrollReveal>
        <ProductsSection products={products} />
      </ScrollReveal>

      {/* Section 3 — Why choose us */}
      <ScrollReveal delay={80}>
        <WhyChooseUs />
      </ScrollReveal>

      {/* Section 4 — Brands */}
      <ScrollReveal delay={80}>
        <BrandsSection />
      </ScrollReveal>

      {/* Section 5 — FAQ */}
      <ScrollReveal delay={80}>
        <FAQSection />
      </ScrollReveal>

      {/* Section 6 — Testimonials */}
      <ScrollReveal delay={80}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* Section 7 — Contact */}
      <ScrollReveal delay={80}>
      <section id="contact" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <span className="text-xs font-bold tracking-widest uppercase text-primary-500">{t("contactSection.badge")}</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">{t("contactSection.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#008f65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{t("contactSection.addressLabel")}</p>
                  <p className="text-sm text-gray-700">{t("contactSection.addressValue")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#008f65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{t("contactSection.phoneLabel")}</p>
                  <a href="tel:+34877234166" className="text-sm font-semibold text-primary-700 hover:underline">877 234 166</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#25D366" }}>
                  <svg width="14" height="14" viewBox="0 0 448 512" fill="white">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{t("contactSection.waLabel")}</p>
                  <a href="https://wa.me/34607953886" className="text-sm font-semibold text-primary-700 hover:underline">607 953 886</a>
                </div>
              </div>
            </div>
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-64 sm:h-72">
              <ContactMap />
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
