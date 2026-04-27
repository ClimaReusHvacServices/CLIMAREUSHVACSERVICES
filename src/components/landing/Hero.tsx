"use client";
import React, { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

import hero0 from "../../../Imagenes/Exterior_edificio.jpg";
import hero1 from "../../../Imagenes/Exterior_casa_moderna.jpg";
import hero2 from "../../../Imagenes/Interior_Banner.jpg";

type HeroProps = {
  images?: (string | StaticImageData)[];
  title?: string;
  subtitle?: string;
};

export default function Hero({
  images = [hero0, hero1, hero2],
  title = "Instalación y reparación de aire acondicionado en Reus y Tarragona",
  subtitle = "Especialistas en instalación, mantenimiento y reparación de aire acondicionado",
}: HeroProps) {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(t);
  }, [images.length]);

  useEffect(() => {
    // Enable parallax only on desktop for performance and layout stability
    const minWidth = 768; // px
    if (typeof window === "undefined" || window.innerWidth < minWidth) return;

    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      // throttle with rAF and cap offset
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        setOffset(Math.min(y * 0.15, 180));
        raf = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[520px] w-full overflow-hidden text-white">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ease-out ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} style={{ transform: `translateY(${i === index ? -offset * 0.2 : 0}px)` }}>
            <Image src={src} alt={`hero-${i}`} fill priority={i === 0} style={{ objectFit: "cover" }} sizes="100vw" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-800/60 to-primary-700/25" />
      </div>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        <div className="max-w-3xl p-6 md:p-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
            {title}
          </h1>
          <p className="mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl">
            {subtitle}
          </p>

          <div className="mt-8">
            <a href="#contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
              Solicitar presupuesto gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
