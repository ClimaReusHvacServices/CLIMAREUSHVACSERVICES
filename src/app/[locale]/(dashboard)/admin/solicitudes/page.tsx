import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageSquare } from "lucide-react";
import { BackButton } from "@/components/common/BackButton";

export const dynamic = "force-dynamic";

async function getAllRequests() {
  return db.serviceRequest.findMany({
    include: { takenBy: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });
}

const STATUS_COLORS: Record<string, string> = {
  nueva: "bg-blue-50 text-blue-700 border-blue-200",
  tomada: "bg-amber-50 text-amber-700 border-amber-200",
  resuelta: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-gray-100 text-gray-500 border-gray-200",
};

export default async function AdminSolicitudesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const [requests, t] = await Promise.all([getAllRequests(), getTranslations("serviceRequest")]);

  return (
    <div className="space-y-5">
      <BackButton />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={22} className="text-accent-600 shrink-0" />
          {t("adminTitle")}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("adminSubtitle")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {requests.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm">{t("noAvailable")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colNumber")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colName")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colPhone")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">{t("colDescription")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">{t("colTakenBy")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">{t("colDate")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{r.number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-700 hover:underline font-medium text-xs flex items-center gap-1"
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "#25D366" }}
                        >
                          <svg width="9" height="9" viewBox="0 0 448 512" fill="white">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                          </svg>
                        </span>
                        {r.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-gray-600 text-xs max-w-xs truncate" title={r.description}>{r.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {t(`status_${r.status}` as any)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-500">
                      {r.takenBy ? `${r.takenBy.firstName} ${r.takenBy.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                      {r.createdAt.toLocaleDateString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
