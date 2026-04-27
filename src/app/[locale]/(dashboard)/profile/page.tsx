import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UserCircle } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { BackButton } from "@/components/common/BackButton";

async function getUserData(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phoneNumber: true,
      address: true,
      city: true,
      postalCode: true,
    },
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session) redirect("/login");

  const user = await getUserData(session.user.id);
  if (!user) redirect("/login");

  const t = await getTranslations("profile");

  return (
    <div className="space-y-5 max-w-2xl">
      <BackButton />

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCircle size={24} className="text-primary-600" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
          {t("sectionPersonal")}
        </h2>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
