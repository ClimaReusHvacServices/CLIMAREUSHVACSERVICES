import ServicePageLayout from "@/components/landing/ServicePageLayout";

export const metadata = {
  title: "Instalación de Aerotermia en Tarragona | Clima HVAC Service",
  description: "Aerotermia en Tarragona: ahorra hasta un 70% en tus facturas. Instalación certificada RITE de sistemas 3 en 1 para calefacción, refrigeración y ACS.",
};

export default function AerotermiaPage() {
  return (
    <ServicePageLayout
      heroImage="/Imagenes/aerotermia_techo_aire_libre.jpg"
      title="Instalación de Aerotermia en Tarragona: Energía Limpia para tu Hogar"
      subtitle="Sustituye tu vieja caldera y ahorra hasta un 70% en tus facturas con la tecnología térmica más avanzada del mercado."
      serviceTitle="Instalación de Aerotermia"
    >
      <h2>¿Qué es la Aerotermia y cómo te beneficia?</h2>
      <p>
        La aerotermia es una tecnología que extrae la energía gratuita del aire exterior para
        climatizar tu vivienda. Es el sistema <strong>&quot;3 en 1&quot;</strong> definitivo:
      </p>
      <ol>
        <li>Calefacción eficiente para el invierno.</li>
        <li>Refrigeración refrescante para el verano.</li>
        <li>Agua Caliente Sanitaria (ACS) durante todo el año.</li>
      </ol>

      <h2>Ventajas de dar el salto a la Aerotermia</h2>
      <ul>
        <li>
          <strong>Ahorro Imbatible:</strong> Al no depender de combustibles fósiles (gas o gasóil),
          el coste de mantenimiento y consumo es mínimo.
        </li>
        <li>
          <strong>Seguridad Total:</strong> Sin depósitos de combustible, sin humos y sin riesgo de
          fugas de gas.
        </li>
        <li>
          <strong>Respeto al Medio Ambiente:</strong> Reduce drásticamente las emisiones de CO₂ de
          tu vivienda.
        </li>
        <li>
          <strong>Mínimo Mantenimiento:</strong> Su funcionamiento es similar al de una nevera;
          sencillo y duradero.
        </li>
        <li>
          <strong>Subvenciones disponibles:</strong> Puede ser compatible con ayudas del Plan MOVES
          y otros programas de eficiencia energética.
        </li>
      </ul>

      <h2>Expertos en integración con Suelo Radiante y Radiadores</h2>
      <p>
        Analizamos si tu sistema actual es compatible. Somos especialistas en combinar aerotermia
        con suelo radiante para un confort térmico inigualable, manteniendo una temperatura
        constante sin ruidos ni corrientes de aire.
      </p>
      <p>
        También realizamos la integración con radiadores de baja temperatura y fancoils para
        maximizar el rendimiento del sistema en tu vivienda o negocio.
      </p>

      <h2>¿Cuánto tarda la instalación?</h2>
      <p>
        Una instalación estándar de aerotermia se completa en 1 o 2 días laborables.
        Nuestro equipo técnico gestiona toda la burocracia: legalización, registro y
        documentación RITE incluidos en el servicio.
      </p>
    </ServicePageLayout>
  );
}
