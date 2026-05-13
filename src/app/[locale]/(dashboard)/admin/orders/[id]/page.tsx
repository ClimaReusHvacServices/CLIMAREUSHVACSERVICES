import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { OrderDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const [order, workers] = await Promise.all([
    db.order.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phoneNumber: true } },
        address: { select: { street: true, city: true, state: true, postalCode: true, country: true } },
        items: {
          include: {
            product: { select: { name: true, images: true } },
            servicePackage: { select: { name: true } },
          },
        },
        task: {
          select: {
            id: true,
            assignedToId: true,
            assignedTo: { select: { firstName: true, lastName: true } },
            comments: {
              include: { author: { select: { firstName: true, lastName: true, role: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    }),
    db.user.findMany({
      where: { role: "trabajador", isActive: true },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  if (!order) redirect(`/${locale}/admin/orders`);

  return <OrderDetailClient order={order as any} locale={locale} workers={workers} />;
}
