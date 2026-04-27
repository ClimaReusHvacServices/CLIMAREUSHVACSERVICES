"use client";
import Image from "next/image";

const BRANDS = [
  { name: "FanWorld",            logo: "/logos/fanworld.avif" },
  { name: "Haier",               logo: "/logos/haier.avif" },
  { name: "Mitsubishi Electric", logo: "/logos/mitsubishi-electric.avif" },
  { name: "Seico",               logo: "/logos/seico.avif" },
];

// More copies for a smoother, less noticeable loop start
const TRACK = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

// Desktop target width used for animation math; layout uses responsive Tailwind classes
const LOGO_W = 240; // px (desktop)
const GAP_TOTAL = 24; // px total gap
const ITEM_W = LOGO_W + GAP_TOTAL;
const LOOP_PX = BRANDS.length * ITEM_W;

export default function BrandsSection() {
  return (
    <section
      id="servicios"
      className="py-16 sm:py-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 60%, #124e63 100%)" }}
    >
      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight flex items-center justify-center gap-4">
          <span>Trabajamos con las mejores</span>
          <span className="inline-flex items-center justify-center bg-accent-600 text-white px-5 py-1 rounded-full font-extrabold text-base -translate-y-0.5">
            marcas
          </span>
        </h2>
        <p className="mt-5 text-white/65 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Instalamos equipos de climatización de fabricantes reconocidos por su eficiencia,
          durabilidad y tecnología avanzada, como Haier, Mitsubishi Electric, Fanworld, Seico y entre otros.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative px-6">
        {/* Fade edges matching the bg gradient */}
        <div className="absolute inset-y-0 left-0 w-44 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(13,60,77,1), transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-44 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(18,78,99,1), transparent)" }} />

        {/* -${LOOP_PX / 2}px delay trick starts the carousel mid-loop so no visible "beginning" */}
        <div className="w-full flex items-center justify-center overflow-hidden">
          <div
            className="brands-track flex items-center"
            style={{ animation: `brands-scroll 28s linear -14s infinite`, minWidth: '200%' }}
          >
          {TRACK.map((brand, i) => (
            <div key={i} className="shrink-0 flex items-center justify-center px-3">
              <div className="relative w-36 h-16 md:w-60 md:h-24">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.95 }}
                  sizes="(max-width: 640px) 144px, 240px"
                />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes brands-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${LOOP_PX}px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .brands-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
