"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

async function checkClient(orderId: string) {
  const session = await auth();
  if (!session || session.user?.role !== "cliente") throw new Error("Unauthorized");
  const order = await db.order.findUnique({ where: { id: orderId }, select: { userId: true } });
  if (!order || order.userId !== session.user.id) throw new Error("Forbidden");
  return session;
}

export async function sendClientMessage(orderId: string, content: string) {
  const session = await checkClient(orderId);
  if (!content.trim()) return;

  const task = await db.task.upsert({
    where: { orderId },
    create: {
      orderId,
      status: "pendiente",
      description: "Consulta del cliente",
      priority: "media",
    },
    update: {},
  });

  await db.taskComment.create({
    data: { taskId: task.id, authorId: session.user!.id, content: content.trim() },
  });

  revalidatePath(`/[locale]/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/worker/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
}
