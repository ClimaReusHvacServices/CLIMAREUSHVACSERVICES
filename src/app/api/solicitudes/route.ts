import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, description } = body;

    if (!name?.trim() || !phone?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
    }

    await db.serviceRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        description: description.trim(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
