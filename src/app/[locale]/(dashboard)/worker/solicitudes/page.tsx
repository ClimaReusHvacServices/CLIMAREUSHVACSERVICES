import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageSquare } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { SolicitudesClient } from "./SolicitudesClient";

export const dynamic = "force-dynamic";

async function getSolicitudes(userId: string) {
  const [available, mine] = await Promise.all([
    db.serviceRequest.findMany({
      where: { status: "nueva", takenById: null },
      include: { takenBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "asc" },
    }),
    db.serviceRequest.findMany({
      where: { takenById: userId, status: { in: ["tomada", "resuelta"] } },
      include: { takenBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { available, mine };
}

export default async function WorkerSolicitudesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "trabajador") redirect("/");

  const [{ available, mine }, t] = await Promise.all([
    getSolicitudes(session.user.id),
    getTranslations("serviceRequest"),
  ]);

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={22} className="text-accent-600 shrink-0" />
          {t("workerTitle")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("workerSubtitle")}</p>
      </div>

      <SolicitudesClient
        available={available.map((r) => ({
          id: r.id,
          number: r.number,
          name: r.name,
          phone: r.phone,
          description: r.description,
          status: r.status,
          takenAt: r.takenAt,
          createdAt: r.createdAt,
          takenBy: r.takenBy,
        }))}
        mine={mine.map((r) => ({
          id: r.id,
          number: r.number,
          name: r.name,
          phone: r.phone,
          description: r.description,
          status: r.status,
          takenAt: r.takenAt,
          createdAt: r.createdAt,
          takenBy: r.takenBy,
        }))}
        locale={locale}
      />
    </div>
  );
}
