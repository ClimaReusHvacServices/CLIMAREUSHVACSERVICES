import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { ClientOrderDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function ClientOrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "cliente") redirect("/");

  const order = await db.order.findUnique({
    where: { id, userId: session.user.id },
    include: {
      address: true,
      items: {
        include: {
          product: { select: { name: true, images: true } },
          servicePackage: { select: { name: true } },
        },
      },
      task: {
        include: {
          assignedTo: { select: { firstName: true, lastName: true } },
          comments: {
            include: { author: { select: { firstName: true, lastName: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!order) redirect(`/${locale}/orders`);

  return <ClientOrderDetailClient order={order as any} locale={locale} />;
}
