"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Wrench } from "lucide-react";
import DataTable from "@/components/common/DataTable";

const verificationColors: Record<string, string> = {
  verified: "bg-primary-100 text-primary-700",
  pending:  "bg-gray-100 text-gray-500",
  rejected: "bg-accent-50 text-accent-700",
};

interface WorkerRow {
  id: string;
  isAvailable: boolean;
  specialties: string[];
  totalJobsCompleted: number;
  verificationStatus: string;
  user: { firstName: string; lastName: string; email: string; isActive: boolean };
}

export function WorkersTable({ workers }: { workers: WorkerRow[] }) {
  const t = useTranslations("adminWorkers");
  const [page, setPage] = useState(1);

  const from = workers.length === 0 ? 0 : 1;
  const to = Math.min(10, workers.length);

  return (
    <DataTable
      columns={[
        { key: "name", label: t("colName") },
        { key: "email", label: t("colEmail"), hideOn: "sm" },
        { key: "specialties", label: t("colSpecialties"), hideOn: "md" },
        { key: "available", label: t("colAvailable") },
        { key: "jobs", label: t("colJobs"), hideOn: "lg" },
        { key: "verified", label: t("colVerified") },
      ]}
      data={workers}
      pageSize={10}
      minWidth="540px"
      emptyComponent={workers.length === 0 ? (
        <div className="py-14 text-center">
          <Wrench size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 text-sm">{t("noWorkers")}</p>
        </div>
      ) : undefined}
      renderRow={(w: WorkerRow) => (
        <tr key={w.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
          <td className="py-3 px-4">
            <p className="font-medium text-gray-900">{w.user.firstName} {w.user.lastName}</p>
          </td>
          <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{w.user.email}</td>
          <td className="py-3 px-4 hidden md:table-cell">
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
          <td className="py-3 px-4">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${w.isAvailable ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${w.isAvailable ? "bg-primary-500" : "bg-gray-400"}`} />
              <span className="hidden sm:inline">{w.isAvailable ? t("available") : t("notAvailable")}</span>
            </span>
          </td>
          <td className="py-3 px-4 font-medium text-gray-900 hidden lg:table-cell">{w.totalJobsCompleted}</td>
          <td className="py-3 px-4">
            <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${verificationColors[w.verificationStatus] ?? "bg-gray-100 text-gray-500"}`}>
              {w.verificationStatus === "verified" ? t("verified")
                : w.verificationStatus === "rejected" ? t("rejected")
                : t("verPending")}
            </span>
          </td>
        </tr>
      )}
    />
  );
}
