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
  try {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth();
    const user = session?.user;
    const t = await getTranslations("nav");

    // Clientes usan el shell estilo landing; admin/trabajador usan DashboardShell
    if (user?.role === "cliente") {
      return (
        <ClientShell
          myOrdersLabel={t("myOrders")}
          myProfileLabel={t("myProfile")}
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ""}` : String(err);
    return (
      <div style={{ padding: "2rem", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "1rem", margin: "1rem" }}>
        <h2 style={{ color: "#dc2626", marginBottom: "0.5rem", fontWeight: "bold" }}>Dashboard layout error</h2>
        <pre style={{ color: "#b91c1c", fontSize: "12px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{msg}</pre>
      </div>
    );
  }
}
