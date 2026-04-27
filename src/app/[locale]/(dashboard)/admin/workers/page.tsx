import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Wrench } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

async function getAllWorkers() {
  return db.trabajador.findMany({
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true, isActive: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

const verificationColors: Record<string, string> = {
  verified: "bg-primary-100 text-primary-700",
  pending:  "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-700",
};

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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wrench size={24} className="text-accent-500" />
          {t("title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colName")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colEmail")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colSpecialties")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colAvailable")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colJobs")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colVerified")}</th>
              </tr>
            </thead>
            <tbody>
              {workers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    <Wrench size={36} className="mx-auto mb-3 text-gray-200" />
                    {t("noWorkers")}
                  </td>
                </tr>
              ) : (
                workers.map((w) => (
                  <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{w.user.firstName} {w.user.lastName}</p>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{w.user.email}</td>
                    <td className="py-3 px-3">
                      {w.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {w.specialties.slice(0, 2).map((s) => (
                            <span key={s} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{s}</span>
                          ))}
                          {w.specialties.length > 2 && (
                            <span className="text-gray-400 text-xs">+{w.specialties.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">{t("noSpecialties")}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${w.isAvailable ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-500"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${w.isAvailable ? "bg-primary-500" : "bg-gray-400"}`} />
                        {w.isAvailable ? t("available") : t("notAvailable")}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-900">{w.totalJobsCompleted}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${verificationColors[w.verificationStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {w.verificationStatus === "verified" ? t("verified")
                          : w.verificationStatus === "rejected" ? t("rejected")
                          : t("verPending")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
