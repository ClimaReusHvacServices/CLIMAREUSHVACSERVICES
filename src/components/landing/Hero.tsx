"use client";
import React, { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

type HeroProps = {
  images?: (string | StaticImageData)[];
};

const BLUR_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(
  `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='20' viewBox='0 0 32 20' preserveAspectRatio='none'>` +
  `<defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='%23006b4f' offset='0'/><stop stop-color='%231d7291' offset='1'/></linearGradient></defs>` +
  `<rect width='32' height='20' fill='url(%23g)'/></svg>`
)}`;

export default function Hero({
  images = [
    "/Imagenes/pexels_1.jpg",
    "/Imagenes/pexels_2.jpg",
    "/Imagenes/pexels_3.jpg",
  ],
}: HeroProps) {
  const t = useTranslations("landing");
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const minWidth = 768;
    if (typeof window === "undefined" || window.innerWidth < minWidth) return;

    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
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
    <section className="relative h-screen min-h-[520px] w-full overflow-hidden text-white bg-primary-900">
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <div
            key={i}
            className={`hero-slide absolute -top-16 -bottom-16 left-0 right-0 transition-opacity duration-1000 ease-out ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            style={{ transform: `translateY(${i === index ? -offset * 0.2 : 0}px)` }}
          >
            <Image
              src={src}
              alt={`hero-${i}`}
              fill
              priority={i === 0}
              quality={95}
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 1920px"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-800/60 to-primary-700/25" />
      </div>

      <div className="relative z-10 container mx-auto h-full flex items-center">
        <div className="max-w-full md:max-w-[65%] lg:max-w-[50%] xl:max-w-[45%] p-6 md:p-10 md:pl-14 lg:p-12 lg:pl-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
            {t("hero.title")}
          </h1>
          <p className="mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-white/90 max-w-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8">
            <a href="#contact" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
              {t("hero.cta")}
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`@media (prefers-reduced-motion: reduce) { .hero-slide { transition: none !important; transform: none !important; } }`}</style>
    </section>
  );
}
