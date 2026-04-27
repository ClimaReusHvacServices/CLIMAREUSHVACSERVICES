"use client";
import React from "react";
import Image from "next/image";

export default function LogosMarquee({ logos = [] }: { logos?: string[] }) {
  const items = [...logos, ...logos]; // duplicate for smooth loop

  return (
    <div className="overflow-hidden py-6">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform items-center">
        {items.map((src, i) => (
          <div key={i} className="mx-8 flex items-center justify-center opacity-90">
            <div className="relative h-12 w-32">
              <Image src={src} alt={`logo-${i}`} fill style={{ objectFit: 'contain' }} sizes="(max-width: 640px) 80px, 128px" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
