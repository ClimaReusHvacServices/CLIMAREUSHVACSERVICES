import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Users } from "lucide-react";
import { UsersTable } from "@/components/admin/UsersTable";
import { BackButton } from "@/components/common/BackButton";

async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const users = await getAllUsers();
  const t = await getTranslations("adminUsers");

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={24} className="text-primary-600" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <UsersTable users={users} locale={locale} />
    </div>
  );
}
