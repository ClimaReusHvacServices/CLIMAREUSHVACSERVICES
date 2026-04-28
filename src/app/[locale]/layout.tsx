import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/config";
import { Toaster } from "@/components/common/Toaster";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Clima HVAC Service - Servicios de Aire Acondicionado",
  description:
    "Plataforma profesional para venta e instalación de sistemas de aire acondicionado",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const session = await auth();

  return (
    <html lang={locale}>
      <body className="bg-gray-50">
        <SessionProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen flex flex-col">{children}</div>
            <Toaster />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
