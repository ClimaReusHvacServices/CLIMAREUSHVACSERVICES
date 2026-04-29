import { auth } from "@/auth/config";
import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ count: 0 });
  const count = await db.order.count({
    where: {
      userId: session.user.id,
      status: { notIn: ["completada", "cancelada"] },
    },
  });
  return NextResponse.json({ count });
}
