"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const WA = "34607953886";

export default function FAQSection() {
  const t = useTranslations("landing");
  const [open, setOpen] = useState<number | null>(0);

  const FAQS = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20 items-start">

        {/* Left */}
        <div className="lg:sticky lg:top-28">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            {t("faq.titleLine1")}<br />{t("faq.titleLine2")}
          </h2>
          <p className="mt-4 text-gray-500 text-sm leading-relaxed">
            {t("faq.subtitle")}
          </p>
          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-bold text-gray-900 hover:brightness-95 transition-all"
            style={{ backgroundColor: "#facc15" }}
          >
            {t("faq.cta")}
          </a>
        </div>

        {/* Right — accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800 leading-snug">{faq.q}</span>
                <span className="shrink-0 text-gray-400 text-base select-none">
                  {open === i ? "↓" : "→"}
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5 border-t border-gray-100">
                  <p className="pt-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
