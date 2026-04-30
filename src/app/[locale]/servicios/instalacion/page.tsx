import ServicePageLayout from "@/components/landing/ServicePageLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Instalación de Aire Acondicionado en Reus y Tarragona | Clima HVAC Service",
  description: "Instalación de aire acondicionado por instaladores certificados RITE. Presupuesto gratuito y servicio el mismo día en Reus y Tarragona.",
};

export default async function InstalacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <ServicePageLayout
      heroImage="/Imagenes/HVAC_exterior_negro.jpg"
      title={t("serviciosDetalle.install.title")}
      subtitle={t("serviciosDetalle.install.subtitle")}
      serviceTitle={t("serviciosDetalle.install.serviceTitle")}
    >
      <h2>{t("serviciosDetalle.install.h1")}</h2>
      <p>{t("serviciosDetalle.install.p1")}</p>
      <ul>
        <li><strong>{t("serviciosDetalle.install.li1t")}:</strong> {t("serviciosDetalle.install.li1")}</li>
        <li><strong>{t("serviciosDetalle.install.li2t")}:</strong> {t("serviciosDetalle.install.li2")}</li>
        <li><strong>{t("serviciosDetalle.install.li3t")}:</strong> {t("serviciosDetalle.install.li3")}</li>
      </ul>

      <h2>{t("serviciosDetalle.install.h2")}</h2>
      <ul>
        <li><strong>{t("serviciosDetalle.install.li4t")}:</strong> {t("serviciosDetalle.install.li4")}</li>
        <li><strong>{t("serviciosDetalle.install.li5t")}:</strong> {t("serviciosDetalle.install.li5")}</li>
        <li><strong>{t("serviciosDetalle.install.li6t")}:</strong> {t("serviciosDetalle.install.li6")}</li>
        <li><strong>{t("serviciosDetalle.install.li7t")}:</strong> {t("serviciosDetalle.install.li7")}</li>
      </ul>

      <h2>{t("serviciosDetalle.install.h3")}</h2>
      <ol>
        <li><strong>{t("serviciosDetalle.install.st1t")}:</strong> {t("serviciosDetalle.install.st1")}</li>
        <li><strong>{t("serviciosDetalle.install.st2t")}:</strong> {t("serviciosDetalle.install.st2")}</li>
        <li><strong>{t("serviciosDetalle.install.st3t")}:</strong> {t("serviciosDetalle.install.st3")}</li>
        <li><strong>{t("serviciosDetalle.install.st4t")}:</strong> {t("serviciosDetalle.install.st4")}</li>
        <li><strong>{t("serviciosDetalle.install.st5t")}:</strong> {t("serviciosDetalle.install.st5")}</li>
      </ol>

      <h2>{t("serviciosDetalle.install.h4")}</h2>
      <p>{t("serviciosDetalle.install.p4")}</p>
    </ServicePageLayout>
  );
}
