"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { redirect } from "next/navigation";

export async function requestService(productId: string, locale: string) {
  const session = await auth();
  if (!session || session.user?.role !== "cliente") throw new Error("Unauthorized");

  const userId = session.user.id;

  const [product, cliente] = await Promise.all([
    db.product.findUnique({ where: { id: productId } }),
    db.cliente.findUnique({ where: { userId } }),
  ]);

  if (!product || !cliente) throw new Error("Product or client not found");

  // Obtener o crear la dirección por defecto del cliente
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

  const unitPrice = product.discountPrice ?? product.price;
  const subtotal = Number(unitPrice);
  const taxAmount = Math.round(subtotal * 21) / 100;
  const total = subtotal + taxAmount;

  // Generar número de pedido único
  const count = await db.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      clientId: cliente.id,
      addressId: address.id,
      subtotal,
      taxAmount,
      shippingCost: 0,
      totalAmount: total,
      installationRequired: true,
      items: {
        create: {
          productId: product.id,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice,
        },
      },
    },
  });

  redirect(`/${locale}/orders/${order.id}`);
}
