"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/utils/password";

async function checkAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") throw new Error("Unauthorized");
}

export async function createClient(data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}) {
  await checkAdmin();
  const base = `${data.firstName.toLowerCase()}${data.lastName.toLowerCase()}`.replace(/\s/g, "");
  const username = `${base}${Date.now().toString().slice(-4)}`;
  const hashedPassword = hashPassword(data.password);

  await db.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase().trim(),
      username,
      password: hashedPassword,
      phoneNumber: data.phoneNumber || null,
      role: "cliente",
      isActive: true,
      cliente: { create: {} },
    },
  });
  revalidatePath("/[locale]/admin/users", "page");
}

export async function updateClient(id: string, data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
}) {
  await checkAdmin();
  await db.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase().trim(),
      phoneNumber: data.phoneNumber || null,
      isActive: data.isActive,
    },
  });
  revalidatePath("/[locale]/admin/users", "page");
}

export async function deleteClient(id: string) {
  await checkAdmin();
  await db.user.delete({ where: { id } });
  revalidatePath("/[locale]/admin/users", "page");
}
