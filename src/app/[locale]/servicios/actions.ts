"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function requestServiceConsultation(serviceTitle: string, locale: string) {
  const session = await auth();
  if (!session || session.user?.role !== "cliente") throw new Error("Unauthorized");

  const userId = session.user.id;

  const cliente = await db.cliente.findUnique({ where: { userId } });
  if (!cliente) throw new Error("Cliente not found");

  let address = await db.clientAddress.findFirst({
    where: { clienteId: cliente.id },
    orderBy: { isDefault: "desc" },
  });

  if (!address) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { address: true, city: true, postalCode: true, country: true },
    });
    address = await db.clientAddress.create({
      data: {
        clienteId: cliente.id,
        label: "principal",
        street: user?.address ?? "Dirección pendiente",
        city: user?.city ?? "Reus",
        postalCode: user?.postalCode ?? "43201",
        country: user?.country ?? "España",
        isDefault: true,
      },
    });
  }

  const count = await db.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      clientId: cliente.id,
      addressId: address.id,
      subtotal: 0,
      taxAmount: 0,
      shippingCost: 0,
      totalAmount: 0,
      notes: `Solicitud de consulta: ${serviceTitle}`,
      installationRequired: false,
    },
  });

  const task = await db.task.create({
    data: {
      orderId: order.id,
      status: "pendiente",
      priority: "media",
      description: `Solicitud de consulta: ${serviceTitle}`,
    },
  });

  await db.taskComment.create({
    data: {
      taskId: task.id,
      authorId: userId,
      content: `Hola, quiero solicitar el servicio de *${serviceTitle}*. ¿Podéis informarme sobre disponibilidad y presupuesto? Gracias.`,
    },
  });

  revalidatePath(`/${locale}/orders`);
  redirect(`/${locale}/orders/${order.id}`);
}
