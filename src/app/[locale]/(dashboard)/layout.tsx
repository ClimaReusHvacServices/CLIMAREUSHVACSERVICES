import { auth } from "@/auth/config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/common/DashboardShell";
import { ClientShell } from "@/components/common/ClientShell";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const user = session?.user;
  const t = await getTranslations("nav");

  if (user?.role === "cliente") {
    return (
      <ClientShell
        myOrdersLabel={t("myOrders")}
        myProfileLabel={t("myProfile")}
        firstName={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
      >
        {children}
      </ClientShell>
    );
  }

  const navLabels = {
    adminSection:      t("adminSection"),
    clienteSection:    t("clienteSection"),
    trabajadorSection: t("trabajadorSection"),
    adminHome:         t("adminHome"),
    users:             t("users"),
    workers:           t("workers"),
    orders:            t("orders"),
    products:          t("products"),
    shop:              t("shop"),
    myOrders:          t("myOrders"),
    myProfile:         t("myProfile"),
    myTasks:           t("myTasks"),
    historial:         t("historial"),
  };

  return (
    <DashboardShell
      user={{
        firstName: user?.firstName ?? "",
        lastName:  user?.lastName ?? "",
        email:     user?.email ?? "",
        role:      user?.role ?? "",
      }}
      navLabels={navLabels}
    >
      {children}
    </DashboardShell>
  );
}
