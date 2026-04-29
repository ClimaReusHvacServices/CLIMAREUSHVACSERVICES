"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

async function checkAuth() {
  const session = await auth();
  if (!session || !["admin", "trabajador"].includes(session.user?.role ?? ""))
    throw new Error("Unauthorized");
  return session;
}

export async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
  const session = await checkAuth();
  if (session.user?.role !== "admin") throw new Error("Unauthorized");
  await db.order.update({
    where: { id: orderId },
    data: {
      status: status as any,
      ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
      ...(status === "completada" ? { completedDate: new Date() } : {}),
      ...(status === "cancelada" ? { cancelledDate: new Date() } : {}),
    },
  });
  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
}

export async function sendOrderMessage(orderId: string, content: string) {
  const session = await checkAuth();
  if (!content.trim()) return;

  const task = await db.task.upsert({
    where: { orderId },
    create: {
      orderId,
      status: "pendiente",
      description: "Seguimiento del pedido",
      priority: "media",
    },
    update: {},
  });

  await db.taskComment.create({
    data: { taskId: task.id, authorId: session.user!.id, content: content.trim() },
  });

  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
}
