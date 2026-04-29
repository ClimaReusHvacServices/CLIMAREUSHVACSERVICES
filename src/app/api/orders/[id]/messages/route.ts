import { auth } from "@/auth/config";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;

  if (role === "cliente") {
    const order = await db.order.findUnique({
      where: { id: orderId, userId: session.user.id },
      select: { id: true },
    });
    if (!order) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else if (role === "trabajador") {
    const task = await db.task.findFirst({
      where: { orderId, assignedToId: session.user.id },
      select: { id: true },
    });
    if (!task) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const task = await db.task.findUnique({
    where: { orderId },
    select: {
      comments: {
        include: {
          author: { select: { firstName: true, lastName: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json({ comments: task?.comments ?? [] });
}
