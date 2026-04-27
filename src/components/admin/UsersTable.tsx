"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Users } from "lucide-react";
import DataTable from "@/components/common/DataTable";

const PAGE_SIZE = 10;

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

const roleColors: Record<string, string> = {
  admin:      "bg-primary-100 text-primary-700",
  cliente:    "bg-accent-100 text-accent-700",
  trabajador: "bg-gray-100 text-gray-600",
};

const roleBorderColors: Record<string, string> = {
  admin:      "border-l-primary-500",
  cliente:    "border-l-accent-400",
  trabajador: "border-l-gray-400",
};

export function UsersTable({ users, locale }: { users: UserRow[]; locale: string }) {
  const t = useTranslations("adminUsers");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      q === "" ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const from = filtered.length === 0 ? 0 : (1 - 1) * 10 + 1; // placeholders used by DataTable
  const to = Math.min(10, filtered.length);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleRole = (v: string) => { setRoleFilter(v); setPage(1); };

  const roleLabel = (role: string) => {
    if (role === "admin") return t("roleAdmin");
    if (role === "cliente") return t("roleCliente");
    return t("roleTrabajador");
  };

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-accent-400 focus:ring-1 focus:ring-accent-100 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {(["all", "admin", "cliente", "trabajador"] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                roleFilter === role ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {role === "all" ? t("filterAll") : roleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: "name", label: t("colName") },
          { key: "email", label: t("colEmail"), hideOn: "sm" },
          { key: "role", label: t("colRole") },
          { key: "status", label: t("colStatus") },
          { key: "joined", label: t("colJoined"), hideOn: "lg" },
        ]}
        data={filtered}
        pageSize={10}
        minWidth="480px"
        emptyComponent={filtered.length === 0 ? (
          <div className="py-14 text-center">
            <Users size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm">{users.length === 0 ? t("noUsers") : t("noResults")}</p>
          </div>
        ) : undefined}
        renderRow={(user: UserRow) => (
          <tr key={user.id} className={`border-b border-gray-50 hover:bg-gray-50/70 transition-colors border-l-2 ${roleBorderColors[user.role] ?? "border-l-gray-200"}`}>
            <td className="py-3 px-4">
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </td>
            <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{user.email}</td>
            <td className="py-3 px-4">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${roleColors[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                {roleLabel(user.role)}
              </span>
            </td>
            <td className="py-3 px-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${user.isActive ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-600"}`}>
                <span className={`size-1.5 rounded-full shrink-0 ${user.isActive ? "bg-primary-500" : "bg-gray-400"}`} />
                {user.isActive ? t("active") : t("inactive")}
              </span>
            </td>
            <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">{new Date(user.createdAt).toLocaleDateString(locale)}</td>
          </tr>
        )}
      />
    </div>
  );
}
