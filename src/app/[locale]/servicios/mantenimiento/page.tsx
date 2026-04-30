import ServicePageLayout from "@/components/landing/ServicePageLayout";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata = {
  title: "Mantenimiento de Aire Acondicionado en Reus | Clima HVAC Service",
  description: "Mantenimiento preventivo de aire acondicionado en Reus y Tarragona. Alarga la vida de tu equipo y respira aire limpio con nuestro servicio técnico certificado.",
};

export default async function MantenimientoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <ServicePageLayout
      heroImage="/Imagenes/Interior_confortable.jpg"
      title={t("serviciosDetalle.manten.title")}
      subtitle={t("serviciosDetalle.manten.subtitle")}
      serviceTitle={t("serviciosDetalle.manten.serviceTitle")}
    >
      <h2>{t("serviciosDetalle.manten.h1")}</h2>
      <p>{t("serviciosDetalle.manten.p1a")}</p>
      <p>{t("serviciosDetalle.manten.p1b")}</p>

      <h2>{t("serviciosDetalle.manten.h2")}</h2>
      <ul>
        <li><strong>{t("serviciosDetalle.manten.li1t")}:</strong> {t("serviciosDetalle.manten.li1")}</li>
        <li><strong>{t("serviciosDetalle.manten.li2t")}:</strong> {t("serviciosDetalle.manten.li2")}</li>
        <li><strong>{t("serviciosDetalle.manten.li3t")}:</strong> {t("serviciosDetalle.manten.li3")}</li>
        <li><strong>{t("serviciosDetalle.manten.li4t")}:</strong> {t("serviciosDetalle.manten.li4")}</li>
        <li><strong>{t("serviciosDetalle.manten.li5t")}:</strong> {t("serviciosDetalle.manten.li5")}</li>
        <li><strong>{t("serviciosDetalle.manten.li6t")}:</strong> {t("serviciosDetalle.manten.li6")}</li>
      </ul>

      <h2>{t("serviciosDetalle.manten.h3")}</h2>
      <p>{t("serviciosDetalle.manten.p3")}</p>

      <h2>{t("serviciosDetalle.manten.h4")}</h2>
      <p>{t("serviciosDetalle.manten.p4")}</p>
    </ServicePageLayout>
  );
}
