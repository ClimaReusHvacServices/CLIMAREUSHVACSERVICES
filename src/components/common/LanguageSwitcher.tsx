"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "ca", name: "Català" },
];

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:9999;background:#f8fafc;display:flex;align-items:center;justify-content:center;";
    overlay.innerHTML = `
      <style>@keyframes shimmerScan{0%{background-position:-300% 0}100%{background-position:300% 0}}</style>
      <div style="position:relative;width:120px;height:120px;">
        <img src="/logos/logoverde.png" alt="" style="width:120px;height:120px;object-fit:contain;display:block;" />
        <div style="position:absolute;inset:0;background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.65) 50%,transparent 70%);background-size:300% 100%;animation:shimmerScan 1.4s ease-in-out infinite;border-radius:8px;pointer-events:none;"></div>
      </div>`;
    document.body.appendChild(overlay);
    const segments = window.location.pathname.split("/").filter(Boolean);
    const knownLocales = ["es", "en", "ca"];
    const afterLocale = knownLocales.includes(segments[0]) ? segments.slice(1).join("/") : segments.join("/");
    window.location.href = `/${newLocale}${afterLocale ? `/${afterLocale}` : ""}`;
  };

  const current = languages.find((l) => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/20 ${variant === "dark" ? "text-white" : "text-gray-700"}`}
      >
        <Globe size={16} />
        <span>{current?.name ?? locale}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                locale === lang.code
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
