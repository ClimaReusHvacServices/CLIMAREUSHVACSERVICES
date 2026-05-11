"use client";

import { useRouter } from "@/i18n/routing";

export function ClickableRow({ href, children, className }: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <tr className={className} onClick={() => router.push(href as any)} style={{ cursor: "pointer" }}>
      {children}
    </tr>
  );
}
