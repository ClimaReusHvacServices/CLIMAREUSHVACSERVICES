import { auth } from "@/auth/config";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/register", "/forgot-password"];

const roleMap: Record<string, string[]> = {
  admin: ["/admin"],
  cliente: ["/dashboard", "/orders", "/profile"],
  trabajador: ["/worker"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const urlLocale = localeMatch?.[1];

  // Redirect to default locale if URL has no valid locale prefix
  if (!urlLocale || !routing.locales.includes(urlLocale as (typeof routing.locales)[number])) {
    const url = req.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = urlLocale;
  const pathWithoutLocale = pathname.slice(locale.length + 1) || "/";

  const isPublic = publicPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );

  const session = await auth();

  if (isPublic && session) {
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (session) {
    const role = session.user?.role;
    for (const [r, paths] of Object.entries(roleMap)) {
      if (
        paths.some(
          (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
        )
      ) {
        if (role !== r) {
          return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\.[^/]+$).)*"],
};
