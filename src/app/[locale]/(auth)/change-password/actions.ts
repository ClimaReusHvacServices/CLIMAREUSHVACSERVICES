"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { hashPassword } from "@/utils/password";

export async function changePasswordAction(
  newPassword: string,
  confirmPassword: string
): Promise<{ success?: boolean; error?: string }> {
  if (!newPassword || !confirmPassword) {
    return { error: "Todos los campos son obligatorios" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas no coinciden" };
  }
  if (newPassword.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const hashed = hashPassword(newPassword);

  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashed, requiresPasswordChange: false },
  });

  return { success: true };
}
