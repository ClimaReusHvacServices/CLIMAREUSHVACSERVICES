"use client";

import { useState } from "react";
import { GoogleReview } from "@/lib/google-reviews";

const CARD_W = 320;
const GAP = 24;
const ITEM = CARD_W + GAP;

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= n ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function reviewDate(time: number): string | null {
  if (!time) return null;
  return new Date(time * 1000).toLocaleDateString("es", { month: "long", year: "numeric" });
}

export function TestimonialsSlider({ reviews, sourceLabel }: { reviews: GoogleReview[]; sourceLabel: string }) {
  if (reviews.length === 0) return null;

  const [paused, setPaused] = useState(false);

  const sorted = [...reviews].sort((a, b) => b.rating - a.rating || b.time - a.time);
  const LOOP = sorted.length * ITEM;
  const TRACK = [...sorted, ...sorted, ...sorted];

  return (
    <div
      className="relative select-none"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onTouchCancel={() => setPaused(false)}
    >
      {/* Pause indicator */}
      {paused && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white text-[11px] font-semibold px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm">
          ⏸ Pausado
        </div>
      )}

      <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0d3c4d, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #083a30, transparent)" }} />

      <div
        className="flex items-stretch"
        style={{
          animation: `reviews-scroll ${sorted.length * 7}s linear -${Math.floor(sorted.length * 3.5)}s infinite`,
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
        }}
      >
        {TRACK.map((r, i) => (
          <div
            key={i}
            className="shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-grab active:cursor-grabbing"
            style={{ width: CARD_W, marginRight: GAP }}
          >
            <Stars n={r.rating} />
            <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-5">{r.text}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              {r.profile_photo_url ? (
                <img src={r.profile_photo_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-primary-700 font-bold text-xs">
                  {r.author_name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">{r.author_name}</p>
                <p className="text-xs text-gray-400">
                  {reviewDate(r.time)
                    ? `${reviewDate(r.time)} · ${sourceLabel} Google`
                    : `${sourceLabel} Google`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes reviews-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${LOOP}px); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="reviews-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
