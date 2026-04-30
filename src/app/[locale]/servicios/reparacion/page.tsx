import ServicePageLayout from "@/components/landing/ServicePageLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Reparación Urgente de Aire Acondicionado en Reus | Clima HVAC Service",
  description: "Reparación urgente de aire acondicionado en Reus y Tarragona. Servicio técnico multimarca rápido y garantizado. Diagnóstico y presupuesto sin compromiso.",
};

export default async function ReparacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <ServicePageLayout
      heroImage="/Imagenes/Exterior_edificio.jpg"
      title={t("serviciosDetalle.repair.title")}
      subtitle={t("serviciosDetalle.repair.subtitle")}
      serviceTitle={t("serviciosDetalle.repair.serviceTitle")}
    >
      <h2>{t("serviciosDetalle.repair.h1")}</h2>
      <p>{t("serviciosDetalle.repair.p1a")}</p>
      <p>{t("serviciosDetalle.repair.p1b")}</p>

      <h2>{t("serviciosDetalle.repair.h2")}</h2>
      <ul>
        <li><strong>{t("serviciosDetalle.repair.li1t")}:</strong> {t("serviciosDetalle.repair.li1")}</li>
        <li><strong>{t("serviciosDetalle.repair.li2t")}:</strong> {t("serviciosDetalle.repair.li2")}</li>
        <li><strong>{t("serviciosDetalle.repair.li3t")}:</strong> {t("serviciosDetalle.repair.li3")}</li>
        <li><strong>{t("serviciosDetalle.repair.li4t")}:</strong> {t("serviciosDetalle.repair.li4")}</li>
        <li><strong>{t("serviciosDetalle.repair.li5t")}:</strong> {t("serviciosDetalle.repair.li5")}</li>
        <li><strong>{t("serviciosDetalle.repair.li6t")}:</strong> {t("serviciosDetalle.repair.li6")}</li>
      </ul>

      <h2>{t("serviciosDetalle.repair.h3")}</h2>
      <p>{t("serviciosDetalle.repair.p3")}</p>

      <h2>{t("serviciosDetalle.repair.h4")}</h2>
      <p>{t("serviciosDetalle.repair.p4")}</p>
    </ServicePageLayout>
  );
}
