import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "ca"],
  defaultLocale: "es",
  pathnames: {
    "/": "/",
    "/login": "/login",
    "/register": "/register",
    "/forgot-password": "/forgot-password",
    "/dashboard": "/dashboard",
    "/orders": "/orders",
    "/profile": "/profile",
    "/worker": "/worker",
    "/admin": "/admin",
    "/admin/dashboard": "/admin/dashboard",
    "/admin/users": "/admin/users",
    "/admin/workers": "/admin/workers",
    "/admin/orders": "/admin/orders",
    "/admin/products": "/admin/products",
    "/unauthorized": "/unauthorized",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
