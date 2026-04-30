import ServicePageLayout from "@/components/landing/ServicePageLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Instalación de Aerotermia en Tarragona | Clima HVAC Service",
  description: "Aerotermia en Tarragona: ahorra hasta un 70% en tus facturas. Instalación certificada RITE de sistemas 3 en 1 para calefacción, refrigeración y ACS.",
};

export default async function AerotermiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <ServicePageLayout
      heroImage="/Imagenes/aerotermia_techo_aire_libre.jpg"
      title={t("serviciosDetalle.aerot.title")}
      subtitle={t("serviciosDetalle.aerot.subtitle")}
      serviceTitle={t("serviciosDetalle.aerot.serviceTitle")}
    >
      <h2>{t("serviciosDetalle.aerot.h1")}</h2>
      <p>{t("serviciosDetalle.aerot.p1")}</p>
      <ol>
        <li>{t("serviciosDetalle.aerot.li1")}</li>
        <li>{t("serviciosDetalle.aerot.li2")}</li>
        <li>{t("serviciosDetalle.aerot.li3")}</li>
      </ol>

      <h2>{t("serviciosDetalle.aerot.h2")}</h2>
      <ul>
        <li><strong>{t("serviciosDetalle.aerot.li4t")}:</strong> {t("serviciosDetalle.aerot.li4")}</li>
        <li><strong>{t("serviciosDetalle.aerot.li5t")}:</strong> {t("serviciosDetalle.aerot.li5")}</li>
        <li><strong>{t("serviciosDetalle.aerot.li6t")}:</strong> {t("serviciosDetalle.aerot.li6")}</li>
        <li><strong>{t("serviciosDetalle.aerot.li7t")}:</strong> {t("serviciosDetalle.aerot.li7")}</li>
        <li><strong>{t("serviciosDetalle.aerot.li8t")}:</strong> {t("serviciosDetalle.aerot.li8")}</li>
      </ul>

      <h2>{t("serviciosDetalle.aerot.h3")}</h2>
      <p>{t("serviciosDetalle.aerot.p3a")}</p>
      <p>{t("serviciosDetalle.aerot.p3b")}</p>

      <h2>{t("serviciosDetalle.aerot.h4")}</h2>
      <p>{t("serviciosDetalle.aerot.p4")}</p>
    </ServicePageLayout>
  );
}
