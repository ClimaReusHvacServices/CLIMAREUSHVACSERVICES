"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "ca", name: "Català" },
];

export function LanguageSwitcher() {
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
    const segments = window.location.pathname.split("/");
    // segments[0] = "", segments[1] = locale, rest = path
    if (segments.length >= 2) {
      segments[1] = newLocale;
    }
    window.location.href = segments.join("/") || "/";
    setIsOpen(false);
  };

  const current = languages.find((l) => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/20"
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
