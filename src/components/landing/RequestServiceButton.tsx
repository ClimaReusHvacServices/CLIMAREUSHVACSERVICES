"use client";

import { useRef, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Wrench, LogIn, Lock } from "lucide-react";
import { requestService } from "@/app/[locale]/oferta/actions";

export default function RequestServiceButton({ productId }: { productId: string }) {
  const t = useTranslations("landing");
  const locale = useLocale();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";
  const [requesting, startRequest] = useTransition();

  function handleRequest() {
    startRequest(async () => {
      await requestService(productId, locale);
    });
  }

  if (role === "cliente") {
    return (
      <button
        onClick={handleRequest}
        disabled={requesting}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      >
        {requesting
          ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          : <Wrench size={16} />}
        {t("productoPage.requestService")}
      </button>
    );
  }

  if (role === "") {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold transition-all hover:opacity-90 hover:shadow-lg"
        style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
      >
        <LogIn size={16} />
        {t("productoPage.loginToRequest")}
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 w-full py-3 px-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-500">
      <Lock size={12} className="shrink-0" />
      {t("products.staffCannotBuy")}
    </div>
  );
}
