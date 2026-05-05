import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

function isValidPhone(raw: string): boolean {
  const trimmed = raw.trim();
  if (!/^[+\d][\d\s\-().+]*$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, description } = body;

    if (!name?.trim() || !phone?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Campos requeridos" }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Teléfono inválido. Incluye el prefijo (ej: +34 612 345 678)" }, { status: 400 });
    }

    if (countWords(description) < 5) {
      return NextResponse.json({ error: "Describe el problema con al menos 5 palabras" }, { status: 400 });
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
