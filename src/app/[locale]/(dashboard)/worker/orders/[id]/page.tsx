import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { WorkerOrderDetailClient } from "./client";

export const dynamic = "force-dynamic";

export default async function WorkerOrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "trabajador") redirect("/");

  const order = await db.order.findUnique({
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
        include: {
          comments: {
            include: { author: { select: { firstName: true, lastName: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!order || order.task?.assignedToId !== session.user.id) {
    redirect(`/${locale}/worker`);
  }

  return (
    <WorkerOrderDetailClient
      order={order as any}
      locale={locale}
      workerId={session.user.id}
    />
  );
}
