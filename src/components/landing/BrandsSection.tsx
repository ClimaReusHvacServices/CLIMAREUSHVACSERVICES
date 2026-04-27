import Image from "next/image";

const BRANDS = [
  { name: "FanWorld",           logo: "/logos/fanworld.png" },
  { name: "Haier",              logo: "/logos/haier.png" },
  { name: "Mitsubishi Electric", logo: "/logos/mitsubishi-electric.png" },
  { name: "Seico",              logo: "/logos/seico.png" },
];

export default function BrandsSection() {
  return (
    <section
      id="servicios"
      className="py-16 sm:py-20"
      style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #1d55b8 50%, #1a3a8f 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Trabajamos con las mejores{" "}
          <span className="inline-block bg-yellow-400 text-blue-900 px-4 py-0.5 rounded-full font-extrabold">
            marcas
          </span>
        </h2>

        <p className="mt-5 text-white/70 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Instalamos equipos de climatización de fabricantes reconocidos por su eficiencia,
          durabilidad y tecnología avanzada, como Haier, Mitsubishi Electric, Fanworld, Seico y entre otros.
        </p>

        {/* Logos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="relative h-10 w-32 sm:h-12 sm:w-40">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                sizes="160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
