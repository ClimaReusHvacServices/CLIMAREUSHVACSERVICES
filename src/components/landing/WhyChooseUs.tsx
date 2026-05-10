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
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* Left — brand card */}
        <div
          className="relative overflow-hidden rounded-3xl shadow-xl min-h-[300px] flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage: "url('/barcelona.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(145deg, rgba(0,143,101,0.80) 0%, rgba(8,58,87,0.88) 100%)" }}
          />
          <div className="relative z-10 px-8 py-12 flex flex-col items-center gap-6">
            <Image
              src="/logos/logo-blanco-nombre.png"
              alt="Clima HVAC Service"
              width={500}
              height={200}
              style={{ width: "auto", height: "72px", objectFit: "contain" }}
              priority
            />
            <div className="space-y-1.5">
              <p className="text-white/80 text-sm">C/ Balmes, 29 · 43204 - Reus</p>
              <p className="text-white/80 text-sm">{t("why.mobileLabel")} 607 953 886</p>
            </div>
          </div>
        </div>

        {/* Right — benefits */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            {t("why.title")}
          </h2>
          <p className="text-gray-500 text-base mb-8 leading-relaxed">
            {t("why.subtitle")}
          </p>

          <ul className="space-y-5">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#1d7291" }}
                />
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold text-gray-800">{b.title}:</span>{" "}{b.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
