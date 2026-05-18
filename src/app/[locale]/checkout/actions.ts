"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export async function createOrder(items: CheckoutItem[]): Promise<{ orderId: string }> {
  const session = await auth();
  if (!session || session.user?.role !== "cliente") throw new Error("Unauthorized");
  if (!items || items.length === 0) throw new Error("Cart is empty");

  const userId = session.user.id;

  const [cliente, products] = await Promise.all([
    db.cliente.findUnique({ where: { userId } }),
    db.product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
      select: { id: true, price: true, discountPrice: true, stock: true },
    }),
  ]);

  if (!cliente) throw new Error("Client not found");

  const productMap = new Map(products.map(p => [p.id, p]));

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

  let subtotal = 0;
  const orderItems = items.map(item => {
    const product = productMap.get(item.productId);
    const unitPrice = product
      ? Number(product.discountPrice ?? product.price)
      : item.price;
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      totalPrice: lineTotal,
    };
  });

  const taxAmount = 0;
  const totalAmount = subtotal;

  // Race-condition-safe order number using timestamp + random suffix
  const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const order = await db.order.create({
    data: {
      orderNumber,
      userId,
      clientId: cliente.id,
      addressId: address.id,
      subtotal,
      taxAmount,
      shippingCost: 0,
      totalAmount,
      installationRequired: true,
      items: { create: orderItems },
    },
  });

  return { orderId: order.id };
}
