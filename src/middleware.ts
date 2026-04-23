import { auth } from "@/auth/config";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

const publicPaths = ["/login", "/register", "/forgot-password"];

const roleMap: Record<string, string[]> = {
  admin: ["/admin"],
  cliente: ["/dashboard", "/orders", "/profile"],
  trabajador: ["/worker"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  const isPublic = publicPaths.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );

  const session = await auth();

  // Authenticated user trying to access login/register → send to home
  if (isPublic && session) {
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  // Unauthenticated user trying to access protected route → send to login
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Role-based protection
  if (session) {
    const role = session.user?.role;
    for (const [r, paths] of Object.entries(roleMap)) {
      if (paths.some((p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/"))) {
        if (role !== r) {
          return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
        }
      }
    }
  }

  // Let next-intl handle locale headers (fixes useLocale() returning wrong value)
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\.[^/]+$).)*"],
};
