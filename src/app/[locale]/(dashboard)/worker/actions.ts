"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

async function checkWorker() {
  const session = await auth();
  if (!session || session.user?.role !== "trabajador") throw new Error("Unauthorized");
  return session;
}

export async function claimOrder(orderId: string) {
  const session = await checkWorker();
  await db.task.upsert({
    where: { orderId },
    create: {
      orderId,
      assignedToId: session.user!.id,
      status: "en_progreso",
      description: "Pedido tomado",
      priority: "media",
    },
    update: { assignedToId: session.user!.id, status: "en_progreso" },
  });
  await db.order.update({ where: { id: orderId }, data: { status: "en_progreso" } });
  revalidatePath("/[locale]/worker", "page");
}

export async function markOrderComplete(taskId: string, orderId: string, userId: string) {
  await checkWorker();
  await db.task.update({ where: { id: taskId }, data: { status: "completada", completedAt: new Date() } });
  await db.order.update({ where: { id: orderId }, data: { status: "completada", completedDate: new Date() } });
  await db.trabajador.update({
    where: { userId },
    data: { totalJobsCompleted: { increment: 1 } },
  });
  revalidatePath("/[locale]/worker", "page");
  revalidatePath(`/[locale]/worker/orders/${orderId}`, "page");
}

export async function releaseOrder(taskId: string, orderId: string) {
  await checkWorker();
  await db.task.update({ where: { id: taskId }, data: { assignedToId: null, status: "pendiente" } });
  await db.order.update({ where: { id: orderId }, data: { status: "pendiente" } });
  revalidatePath("/[locale]/worker", "page");
}

export async function markOrderPaid(orderId: string) {
  await checkWorker();
  await db.order.update({ where: { id: orderId }, data: { paymentStatus: "pagado" } });
  revalidatePath("/[locale]/worker", "page");
  revalidatePath(`/[locale]/worker/orders/${orderId}`, "page");
}
