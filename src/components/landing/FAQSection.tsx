"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Cuánto cuesta instalar un aire acondicionado en Reus?",
    a: "El precio de una instalación de aire acondicionado en Reus depende del tipo de equipo, la potencia necesaria y la complejidad de la instalación. En Clima Reus HVAC Services ofrecemos presupuestos personalizados para garantizar la mejor solución según tu espacio y necesidades.",
  },
  {
    q: "¿Cada cuánto tiempo se debe hacer mantenimiento al aire acondicionado?",
    a: "Se recomienda realizar mantenimiento al menos una vez al año para garantizar el buen funcionamiento del equipo. El mantenimiento ayuda a mejorar la eficiencia energética, prolongar la vida útil del sistema y mantener una buena calidad del aire.",
  },
  {
    q: "¿En qué zonas ofrecen servicio de climatización?",
    a: "Ofrecemos instalación, mantenimiento y reparación de sistemas de climatización en Reus, Tarragona y localidades cercanas como Cambrils, Salou y Vila-seca.",
  },
  {
    q: "¿Reparan todas las marcas de aire acondicionado?",
    a: "Sí. Nuestro servicio técnico tiene experiencia en la reparación de diferentes sistemas de climatización y trabaja con marcas reconocidas como Haier y Mitsubishi Electric, entre otras.",
  },
];

const WA = "34607953886";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-20 items-start">

        {/* Left */}
        <div className="lg:sticky lg:top-28">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Preguntas<br />Frecuentes (FAQ)
          </h2>
          <p className="mt-4 text-gray-500 text-sm leading-relaxed">
            Despejamos tus dudas técnicas sobre nuestras instalaciones de aire acondicionado
            y aerotermia para que tomes la mejor decisión para tu hogar.
          </p>
          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl text-sm font-bold text-gray-900 hover:brightness-95 transition-all"
            style={{ backgroundColor: "#facc15" }}
          >
            Hablar con un experto
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
