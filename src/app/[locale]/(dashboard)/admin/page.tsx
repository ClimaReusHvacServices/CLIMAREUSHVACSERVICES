import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, Package, Banknote, Wrench, ShoppingBag, UserCog, BarChart3 } from "lucide-react";

async function getAdminStats() {
  const [totalUsers, totalOrders, revenueAggregate, activeWorkers] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
    db.user.count({ where: { role: "trabajador", isActive: true } }),
  ]);
  return {
    totalUsers,
    totalOrders,
    totalRevenue: Number(revenueAggregate._sum.totalAmount ?? 0),
    activeWorkers,
  };
}

const statusColors: Record<string, string> = {
  pendiente:   "bg-yellow-100 text-yellow-800",
  confirmada:  "bg-accent-100 text-accent-700",
  en_progreso: "bg-purple-100 text-purple-700",
  completada:  "bg-primary-100 text-primary-700",
  cancelada:   "bg-red-100 text-red-700",
};

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "admin") redirect("/");

  const stats = await getAdminStats();
  const t = await getTranslations("admin");
  const tStatus = await getTranslations("status");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 mt-1">{t("welcome")}, {session.user?.firstName}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={22} className="text-primary-600" />} label={t("totalUsers")} value={stats.totalUsers} bg="border-primary-500" />
        <StatCard icon={<Package size={22} className="text-accent-500" />} label={t("totalOrders")} value={stats.totalOrders} bg="border-accent-400" />
        <StatCard icon={<Banknote size={22} className="text-green-600" />} label={t("totalRevenue")} value={`€${stats.totalRevenue.toFixed(2)}`} bg="border-green-400" />
        <StatCard icon={<Wrench size={22} className="text-orange-500" />} label={t("activeWorkers")} value={stats.activeWorkers} bg="border-orange-400" />
      </div>

      {/* Acciones rapidas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">{t("quickActions")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <QuickLink href="/admin/users" icon={<UserCog size={20} className="text-primary-600" />} label={t("manageUsers")} desc={t("manageUsersDesc")} />
          <QuickLink href="/admin/workers" icon={<Wrench size={20} className="text-accent-500" />} label={t("manageWorkers")} desc={t("manageWorkersDesc")} />
          <QuickLink href="/admin/orders" icon={<ShoppingBag size={20} className="text-orange-500" />} label={t("viewOrders")} desc={t("viewOrdersDesc")} />
        </div>
      </div>

      {/* Pedidos recientes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary-600" />
            {t("recentOrders")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase">{t("colNumber")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase">{t("colClient")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase">{t("colStatus")}</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 text-xs uppercase">{t("colTotal")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { num: "#001", cliente: "Juan Garcia", estado: "pendiente", total: "€1,250.00" },
                { num: "#002", cliente: "Maria Lopez", estado: "en_progreso", total: "€2,100.00" },
                { num: "#003", cliente: "Carlos Martinez", estado: "completada", total: "€950.00" },
              ].map((row) => (
                <tr key={row.num} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-medium text-gray-900">{row.num}</td>
                  <td className="py-3 px-3 text-gray-700">{row.cliente}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[row.estado]}`}>
                      {tStatus(row.estado as any)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string | number; bg: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Link
      href={href as any}
      className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all"
    >
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}
