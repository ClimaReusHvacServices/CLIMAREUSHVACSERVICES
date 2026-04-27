import ServicePageLayout from "@/components/landing/ServicePageLayout";

export const metadata = {
  title: "Reparación Urgente de Aire Acondicionado en Reus | Clima Reus HVAC",
  description: "Reparación urgente de aire acondicionado en Reus y Tarragona. Servicio técnico multimarca rápido y garantizado. Diagnóstico y presupuesto sin compromiso.",
};

export default function ReparacionPage() {
  return (
    <ServicePageLayout
      heroImage="/Imagenes/Exterior_edificio.jpg"
      title="Reparación Urgente de Aire Acondicionado en Reus y Tarragona"
      subtitle="Servicio técnico multimarca rápido y garantizado. No dejes que una avería arruine tu día."
      serviceTitle="Reparación de Aire Acondicionado"
    >
      <h2>Solucionamos cualquier fallo en tu sistema de climatización</h2>
      <p>
        ¿Tu aire acondicionado hace ruido, no enfría o huele mal? Nuestro equipo técnico se
        desplaza a tu ubicación con las herramientas y recambios necesarios para solucionar el
        problema en la primera visita.
      </p>
      <p>
        Trabajamos con todas las marcas del mercado: Mitsubishi, Haier, Daikin, Samsung,
        Panasonic, LG, Toshiba, Fujitsu y muchas más.
      </p>

      <h2>Averías comunes que reparamos a diario</h2>
      <ul>
        <li>
          <strong>Fugas de Gas Refrigerante:</strong> Localizamos el poro, sellamos y
          recargamos con gas ecológico certificado.
        </li>
        <li>
          <strong>Fallos en el Compresor o Ventilador:</strong> Reparamos o sustituimos
          componentes críticos de la unidad exterior con piezas originales.
        </li>
        <li>
          <strong>Problemas Electrónicos:</strong> Solucionamos errores en placas base,
          sensores y termostatos que impiden el funcionamiento normal.
        </li>
        <li>
          <strong>Obstrucciones en el Desagüe:</strong> Limpieza profunda para eliminar
          bloqueos de agua que provocan goteras y humedades.
        </li>
        <li>
          <strong>Ruidos y Vibraciones:</strong> Identificamos y eliminamos cualquier ruido
          anormal causado por desgaste mecánico o suciedad acumulada.
        </li>
        <li>
          <strong>Error de Comunicación entre Unidades:</strong> Diagnóstico electrónico
          avanzado para restaurar la comunicación interior-exterior.
        </li>
      </ul>

      <h2>Compromiso Clima Reus: Sin sorpresas en la factura</h2>
      <p>
        Antes de cualquier reparación, realizamos un diagnóstico claro y te entregamos un
        presupuesto cerrado. Solo procedemos con tu autorización expresa. Sin letras pequeñas,
        sin costes ocultos.
      </p>

      <h2>Garantía en todas nuestras reparaciones</h2>
      <p>
        Todas las reparaciones incluyen garantía por escrito sobre la pieza sustituida y la
        mano de obra. Si el problema reaparece dentro del período de garantía, volvemos sin
        coste adicional.
      </p>
    </ServicePageLayout>
  );
}
