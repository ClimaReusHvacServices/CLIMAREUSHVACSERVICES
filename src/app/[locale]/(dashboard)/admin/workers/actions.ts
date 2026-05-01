"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/utils/password";

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function createWorker(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  specialties: string[];
}) {
  await checkAdmin();
  const username = `worker${Date.now().toString().slice(-6)}`;
  const hashedPassword = hashPassword(data.password);

  await db.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase().trim(),
      username,
      password: hashedPassword,
      role: "trabajador",
      isActive: true,
      trabajador: {
        create: {
          specialties: data.specialties,
          isAvailable: true,
          verificationStatus: "verified",
        },
      },
    },
  });
  revalidatePath("/[locale]/admin/workers", "page");
}

export async function updateWorker(trabajadorId: string, data: {
  firstName: string;
  lastName: string;
  isActive: boolean;
  specialties: string[];
  isAvailable: boolean;
}) {
  await checkAdmin();
  const trabajador = await db.trabajador.findUnique({
    where: { id: trabajadorId },
    select: { userId: true },
  });
  if (!trabajador) throw new Error("Worker not found");

  await db.user.update({
    where: { id: trabajador.userId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: data.isActive,
    },
  });
  await db.trabajador.update({
    where: { id: trabajadorId },
    data: {
      specialties: data.specialties,
      isAvailable: data.isAvailable,
    },
  });
  revalidatePath("/[locale]/admin/workers", "page");
}

export async function deleteWorker(trabajadorId: string) {
  await checkAdmin();
  const trabajador = await db.trabajador.findUnique({
    where: { id: trabajadorId },
    select: { userId: true },
  });
  if (!trabajador) throw new Error("Worker not found");
  await db.user.delete({ where: { id: trabajador.userId } });
  revalidatePath("/[locale]/admin/workers", "page");
}
