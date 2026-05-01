"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function takeServiceRequest(id: string): Promise<{ ok: boolean; alreadyTaken?: boolean }> {
  const session = await auth();
  if (!session || session.user?.role !== "trabajador") {
    return { ok: false };
  }

  const updated = await db.serviceRequest.updateMany({
    where: { id, takenById: null, status: "nueva" },
    data: {
      takenById: session.user.id,
      takenAt: new Date(),
      status: "tomada",
    },
  });

  if (updated.count === 0) {
    return { ok: false, alreadyTaken: true };
  }

  revalidatePath("/[locale]/(dashboard)/worker/solicitudes", "page");
  return { ok: true };
}

export async function resolveServiceRequest(id: string): Promise<{ ok: boolean }> {
  const session = await auth();
  if (!session || session.user?.role !== "trabajador") return { ok: false };

  await db.serviceRequest.updateMany({
    where: { id, takenById: session.user.id, status: "tomada" },
    data: { status: "resuelta" },
  });

  revalidatePath("/[locale]/(dashboard)/worker/solicitudes", "page");
  return { ok: true };
}
