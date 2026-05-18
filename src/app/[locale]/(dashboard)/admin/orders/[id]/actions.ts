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

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") throw new Error("Unauthorized");
  return session;
}

export async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string) {
  await checkAdmin();
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
  revalidatePath(`/[locale]/worker/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/orders/${orderId}`, "page");
}

export async function takeOrderAsAdmin(orderId: string) {
  const session = await checkAdmin();
  // Order: pendiente → confirmada. Task created (unassigned, pendiente).
  await db.task.upsert({
    where: { orderId },
    create: {
      orderId,
      status: "pendiente",
      description: "Pedido tomado por admin",
      priority: "alta",
    },
    update: { status: "pendiente" },
  });
  await db.order.update({ where: { id: orderId }, data: { status: "confirmada" } });
  // Auto-comment so there's a record of who took it
  const task = await db.task.findUnique({ where: { orderId }, select: { id: true } });
  if (task) {
    const u = session.user as any;
    const adminName = (`${u.firstName ?? ""} ${u.lastName ?? ""}`).trim();
    const greeting = adminName
      ? `Hola, mi nombre es ${adminName}, y estoy aquí para ayudarte a cuadrar el presupuesto y los detalles de tu instalación. 😊`
      : `Hola, estoy aquí para ayudarte a cuadrar el presupuesto y los detalles de tu instalación. 😊`;
    await db.taskComment.create({
      data: { taskId: task.id, authorId: session.user!.id, content: `✅ Pedido tomado. ${greeting}` },
    });
  }
  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/orders/${orderId}`, "page");
}

export async function assignWorkerToOrder(
  orderId: string,
  workerId: string,
  agreedBudget: number | null,
  adminNotes: string,
  noteForChat: string,
) {
  const session = await checkAdmin();
  const task = await db.task.upsert({
    where: { orderId },
    create: { orderId, assignedToId: workerId, status: "en_progreso", description: "Tarea asignada", priority: "alta" },
    update: { assignedToId: workerId, status: "en_progreso" },
  });
  await db.order.update({
    where: { id: orderId },
    data: {
      status: "en_progreso",
      ...(agreedBudget !== null ? { agreedBudget } : {}),
      ...(adminNotes.trim() ? { adminNotes: adminNotes.trim() } : {}),
    },
  });
  if (noteForChat.trim()) {
    await db.taskComment.create({ data: { taskId: task.id, authorId: session.user!.id, content: noteForChat.trim() } });
  }
  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/worker/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/orders/${orderId}`, "page");
  revalidatePath(`/[locale]/worker`, "page");
}

export async function clearOrderChat(orderId: string) {
  await checkAdmin();
  const task = await db.task.findUnique({ where: { orderId }, select: { id: true } });
  if (!task) return;
  await db.taskComment.deleteMany({ where: { taskId: task.id } });
  revalidatePath(`/[locale]/admin/orders/${orderId}`, "page");
}
