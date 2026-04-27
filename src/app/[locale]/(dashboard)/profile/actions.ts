"use server";

import { auth } from "@/auth/config";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/[locale]/profile", "page");
}
