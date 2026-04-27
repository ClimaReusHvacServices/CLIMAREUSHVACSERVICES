import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users } from "lucide-react";

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

const roleColors: Record<string, string> = {
  admin:      "bg-primary-100 text-primary-700",
  cliente:    "bg-accent-100 text-accent-700",
  trabajador: "bg-orange-100 text-orange-700",
};

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={24} className="text-primary-600" />
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
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colRole")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colStatus")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">{t("colJoined")}</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 text-sm">
                    <Users size={36} className="mx-auto mb-3 text-gray-200" />
                    {t("noUsers")}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-400">@{user.username}</p>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{user.email}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${roleColors[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {t(`role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` as any)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${user.isActive ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-600"}`}>
                        {user.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString(locale)}
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
