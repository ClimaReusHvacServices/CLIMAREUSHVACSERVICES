import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default async function WhyChooseUs() {
  const t = await getTranslations("landing");

  const BENEFITS = [
    { title: t("why.b1title"), text: t("why.b1text") },
    { title: t("why.b2title"), text: t("why.b2text") },
    { title: t("why.b3title"), text: t("why.b3text") },
    { title: t("why.b4title"), text: t("why.b4text") },
  ];

  return (
    <section className="relative overflow-hidden min-h-[580px] flex items-center">

      {/* Barcelona full-section background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/barcelona.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      />
      {/* Dark scrim for readability over the entire section */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.62) 0%, rgba(0,20,40,0.55) 100%)" }}
      />

      {/* Content grid overlaid on the image */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

        {/* Left — logo + contact info */}
        <div className="flex flex-col items-center text-center md:border-r md:border-white/20 md:pr-16">
          <Image
            src="/logos/logo-blanco-nombre.png"
            alt="Clima HVAC Service"
            width={600}
            height={240}
            style={{ width: "auto", height: "160px", objectFit: "contain" }}
            priority
          />
          <div className="mt-8 space-y-2.5">
            <p className="text-white text-base font-semibold">C/ Balmes, 29 · 43204 - Reus</p>
            <p className="text-white/80 text-base">{t("why.mobileLabel")} 607 953 886</p>
          </div>
        </div>

        {/* Right — why choose us */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {t("why.title")}
          </h2>
          <p className="text-white/70 text-base mb-8 leading-relaxed">
            {t("why.subtitle")}
          </p>

          <ul className="space-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#4dd9a0" }}
                />
                <p className="text-white/90 text-sm sm:text-base">
                  <span className="font-bold text-white">{b.title}:</span>{" "}{b.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
