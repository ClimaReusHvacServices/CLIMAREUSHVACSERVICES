"use client";

import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
    >
      <span className="size-7 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm group-hover:border-accent-300 group-hover:text-accent-600 group-hover:-translate-x-0.5 transition-all">
        <ArrowLeft size={13} />
      </span>
      {t("back")}
    </button>
  );
}
