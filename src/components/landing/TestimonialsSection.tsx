"use client";
import { useTranslations } from "next-intl";

const REVIEWS = [
  {
    name: "Carlos Rodríguez",
    rating: 5,
    text: "¡Excelente servicio! Clima HVAC Service instaló mi aire el mismo día y todo quedó a la perfección. ¡Muy recomendados!",
    source: "Google",
  },
  {
    name: "Laura Sánchez",
    rating: 5,
    text: "Tuve una emergencia con mi calefacción en pleno invierno y Clima HVAC Service lo solucionó rápidamente. ¡Gracias por el excelente servicio!",
    source: "Google",
  },
  {
    name: "Pedro Martínez",
    rating: 4,
    text: "El mantenimiento preventivo que ofrecen es excelente. Mi sistema HVAC funciona como nuevo y he notado un ahorro en mi factura de energía.",
    source: "Google",
  },
  {
    name: "Cristina Guzmán",
    rating: 5,
    text: "Instaladores profesionales, me atendieron enseguida y me instalaron un aire el mismo día por la tarde. Rápidos y limpios. Los recomiendo.",
    source: "Google",
  },
  {
    name: "Jordi Puig",
    rating: 5,
    text: "Servicio impecable. Vinieron a revisar mi equipo de aerotermia y en una hora ya estaba funcionando al 100%. Muy profesionales y atentos.",
    source: "Google",
  },
  {
    name: "María Fernández",
    rating: 5,
    text: "Contraté la instalación de aire acondicionado multisplit y quedé muy satisfecha. Trabajo limpio, precio justo y sin sorpresas. Totalmente recomendable.",
    source: "Google",
  },
];

const TRACK = [...REVIEWS, ...REVIEWS, ...REVIEWS];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= n ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const CARD_W = 320;
const GAP = 24;
const ITEM = CARD_W + GAP;
const LOOP = REVIEWS.length * ITEM;

export default function TestimonialsSection() {
  const t = useTranslations("landing");
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
      </div>

      {/* Slider */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0d3c4d, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #083a30, transparent)" }} />

        <div
          className="flex items-stretch"
          style={{ animation: `reviews-scroll 40s linear -20s infinite`, width: "max-content" }}
        >
          {TRACK.map((r, i) => (
            <div
              key={i}
              className="shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col"
              style={{ width: CARD_W, marginRight: GAP }}
            >
              <Stars n={r.rating} />
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.text}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("testimonials.source")} {r.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <a
          href="https://g.page/r/review"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {t("testimonials.cta")}
        </a>
      </div>

      <style jsx>{`
        @keyframes reviews-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${LOOP}px); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="reviews-scroll"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
