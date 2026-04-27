"use client";
import React, { useEffect, useState } from "react";

type HeroProps = {
  images?: string[];
  title?: string;
  subtitle?: string;
};

export default function Hero({
  images = [
    "/Imagenes/Exterior_edificio.jpg",
    "/Imagenes/Exterior_casa_moderna.jpg",
    "/Imagenes/Interior_Banner.jpg",
  ],
  title = "Instalación y reparación de aire acondicionado en Reus y Tarragona",
  subtitle = "Especialistas en instalación, mantenimiento y reparación de aire acondicionado",
}: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <section className="relative h-[72vh] min-h-[420px] w-full overflow-hidden text-white">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-out ${
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-800/70 to-primary-700/30" />
      </div>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        <div className="max-w-3xl p-6 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-sm">
            {title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-accent-100 max-w-xl">
            {subtitle}
          </p>

          <div className="mt-8">
            <a
              href="#contact"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-black font-semibold px-6 py-4 rounded-lg shadow-md"
            >
              Solicitar presupuesto gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
