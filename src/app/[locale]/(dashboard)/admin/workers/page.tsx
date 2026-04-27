import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Wrench } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { WorkersTable } from "@/components/admin/WorkersTable";

async function getAllWorkers() {
  return db.trabajador.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true, isActive: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminWorkersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const workers = await getAllWorkers();
  const t = await getTranslations("adminWorkers");

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wrench size={22} className="text-accent-500 shrink-0" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <WorkersTable workers={workers as any} />
    </div>
  );
}
