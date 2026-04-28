import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";

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

        {/* Left — brand placeholder (swap with real logo when ready) */}
        <div className="flex flex-col items-center text-center">
          <div className="w-44 h-44 rounded-full flex items-center justify-center mb-6 shadow-lg bg-white">
            <svg width="84" height="84" viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#1d7291" />
                  <stop offset="100%" stopColor="#008f65" />
                </linearGradient>
              </defs>
              <circle cx="42" cy="42" r="40" fill="url(#g1)" />
              <text x="50%" y="50%" textAnchor="middle" dy="6" fontSize="20" fontWeight="700" fill="#fff">HVAC</text>
            </svg>
          </div>

          <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
            HVAC CLIMA REUS
          </h3>
          <p className="text-sm italic text-gray-400 mt-0.5">Ariel Hugo José Morales</p>

          <div className="mt-4 text-sm text-gray-500 leading-relaxed space-y-0.5">
            <p className="font-semibold text-gray-600">Z-1485584-L</p>
            <p>C/ Balmes, 29 · 43204 - Reus</p>
            <p>Mòbil 607 953 886</p>
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
