import { auth } from "@/auth/config";
import { NextRequest, NextResponse } from "next/server";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/register", "/forgot-password"];

// Rutas protegidas por rol
const roleBasedRoutes = {
  admin: ["/admin"],
  cliente: ["/dashboard", "/orders", "/profile"],
  trabajador: ["/worker"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extraer el locale del pathname
  const localeMatch = pathname.match(/^\/([a-z]{2})/);
  const locale = localeMatch ? localeMatch[1] : "es";

  // Obtener la sesión del usuario
  const session = await auth();

  // Eliminar el locale del pathname para comparaciones
  const pathWithoutLocale = pathname.replace(`/${locale}`, "");

  // Permitir acceso a rutas públicas
  if (publicRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    // Si está autenticado y trata de acceder a login/register, redirigir al dashboard
    if (session) {
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Si no está autenticado, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Verificar acceso basado en rol
  const userRole = session.user?.role;

  for (const [role, routes] of Object.entries(roleBasedRoutes)) {
    if (routes.some((route) => pathWithoutLocale.startsWith(route))) {
      if (userRole !== role) {
        // Redirigir a una página de acceso denegado o al dashboard
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

// Configurar en cuales rutas ejecutar el middleware
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\.[^/]+$).)*",
  ],
};
