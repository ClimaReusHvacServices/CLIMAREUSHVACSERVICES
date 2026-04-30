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
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="w-48 h-48 rounded-full flex items-center justify-center mb-6 shadow-lg bg-white border border-gray-100">
            <Image
              src="/logos/logoverde.png"
              alt="Clima HVAC Service"
              width={500}
              height={500}
              style={{ width: "120px", height: "120px", objectFit: "contain" }}
            />
          </div>

          <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
            CLIMA HVAC SERVICE
          </h3>
          <p className="text-sm italic text-gray-400 mt-0.5">Ariel Hugo José Morales</p>

          <div className="mt-4 text-sm text-gray-500 leading-relaxed space-y-0.5">
            <p className="font-semibold text-gray-600">Z-1485584-L</p>
            <p>C/ Balmes, 29 · 43204 - Reus</p>
            <p>{t("why.mobileLabel")} 607 953 886</p>
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
