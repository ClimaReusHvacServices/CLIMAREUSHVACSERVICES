"use client";
import Image from "next/image";

const BRANDS = [
  { name: "FanWorld",            logo: "/logos/fanworld.avif" },
  { name: "Haier",               logo: "/logos/haier.avif" },
  { name: "Mitsubishi Electric", logo: "/logos/mitsubishi-electric.avif" },
  { name: "Seico",               logo: "/logos/seico.avif" },
];

// Duplicated for seamless infinite loop
const TRACK = [...BRANDS, ...BRANDS, ...BRANDS];

export default function BrandsSection() {
  return (
    <section
      id="servicios"
      className="py-16 sm:py-20 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #f5f0e8 0%, #faf7f2 60%, #f0ebe0 100%)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Trabajamos con las mejores{" "}
          <span
            className="inline-block px-4 py-0.5 rounded-full font-extrabold text-white"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            marcas
          </span>
        </h2>
        <p className="mt-5 text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Instalamos equipos de climatización de fabricantes reconocidos por su eficiencia,
          durabilidad y tecnología avanzada, como Haier, Mitsubishi Electric, Fanworld, Seico y entre otros.
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #f5f0e8, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #faf7f2, transparent)" }} />

        <div className="flex items-center" style={{ animation: "brands-scroll 28s linear infinite" }}>
          {TRACK.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-12 shrink-0"
              style={{ width: 140 }}
            >
              <div className="relative" style={{ width: 130, height: 52 }}>
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="130px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes brands-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${BRANDS.length * (130 + 96)}px); }
        }
      `}</style>
    </section>
  );
}
