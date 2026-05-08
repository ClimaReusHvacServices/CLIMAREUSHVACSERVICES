import { getTranslations } from "next-intl/server";
import { getGoogleReviews, GoogleReview } from "@/lib/google-reviews";
import { TestimonialsSlider } from "./TestimonialsSlider";

export default async function TestimonialsSection() {
  const [t, { reviews, avgRating, totalRatings }] = await Promise.all([
    getTranslations("landing"),
    getGoogleReviews(),
  ]);

  return (
    <section className="py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #083a30 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-12">
        <span className="text-sm sm:text-base font-bold tracking-widest uppercase text-primary-300 mb-3 block">{t("testimonials.badge")}</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t("testimonials.title")}
        </h2>
        <p className="mt-4 text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {t("testimonials.subtitle")}
        </p>
        {totalRatings > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i <= Math.round(avgRating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-white/80 text-sm font-semibold">{avgRating.toFixed(1)}</span>
            <span className="text-white/50 text-sm">({totalRatings} reseñas)</span>
          </div>
        )}
      </div>

      <TestimonialsSlider reviews={reviews} sourceLabel={t("testimonials.source")} />

      <div className="text-center mt-10">
        <a
          href="https://g.page/r/CfqVjLo1HogdEBM/review"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {t("testimonials.cta")}
        </a>
      </div>
    </section>
  );
}
