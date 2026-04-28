import ServicePageLayout from "@/components/landing/ServicePageLayout";

export const metadata = {
  title: "Mantenimiento de Aire Acondicionado en Reus | Clima HVAC Service",
  description: "Mantenimiento preventivo de aire acondicionado en Reus y Tarragona. Alarga la vida de tu equipo y respira aire limpio con nuestro servicio técnico certificado.",
};

export default function MantenimientoPage() {
  return (
    <ServicePageLayout
      heroImage="/Imagenes/Interior_confortable.jpg"
      title="Mantenimiento de Aire Acondicionado en Reus: Respira Aire Puro"
      subtitle="Alarga la vida de tu equipo, evita averías costosas y asegura un ambiente libre de bacterias y alérgenos."
      serviceTitle="Mantenimiento de Aire Acondicionado"
    >
      <h2>¿Por qué es vital el mantenimiento regular?</h2>
      <p>
        Un equipo de aire acondicionado sin mantenimiento no solo consume más luz, sino que puede
        convertirse en un foco de infecciones respiratorias. En Clima HVAC Service cuidamos tu salud y tu
        bolsillo.
      </p>
      <p>
        Un mantenimiento anual puede reducir el consumo energético hasta un <strong>25%</strong> y
        multiplicar por tres la vida útil de tu equipo.
      </p>

      <h2>¿Qué incluye nuestra revisión técnica profesional?</h2>
      <ul>
        <li>
          <strong>Limpieza de Filtros y Evaporadores:</strong> Fundamental para eliminar polvo,
          ácaros y malos olores que afectan la calidad del aire interior.
        </li>
        <li>
          <strong>Desinfección de la Unidad:</strong> Aplicamos productos bactericidas certificados
          que eliminan hongos, bacterias y alérgenos acumulados.
        </li>
        <li>
          <strong>Comprobación de Carga de Gas:</strong> Una carga baja hace que el compresor
          trabaje forzado y gaste el doble. La detectamos antes de que sea un problema mayor.
        </li>
        <li>
          <strong>Revisión del Sistema Eléctrico:</strong> Verificamos conexiones para evitar
          cortocircuitos o fallos en la placa electrónica.
        </li>
        <li>
          <strong>Limpieza de Desagües:</strong> Evitamos goteos incómodos y humedades en tus
          paredes que dañan la estructura y generan moho.
        </li>
        <li>
          <strong>Inspección de la Unidad Exterior:</strong> Revisamos ventilador, compresor y
          aletas para garantizar el correcto intercambio de calor.
        </li>
      </ul>

      <h2>Planes de mantenimiento anuales</h2>
      <p>
        Ofrecemos contratos de mantenimiento anuales con revisiones programadas para particulares
        y empresas. Incluyen prioridad en atención, descuentos en reparaciones y tranquilidad todo
        el año. Consulta nuestras tarifas sin compromiso.
      </p>

      <h2>Mantenimiento para comunidades y empresas</h2>
      <p>
        Gestionamos el mantenimiento de instalaciones completas en comunidades de vecinos,
        hoteles, oficinas y naves industriales. Emitimos informe técnico tras cada revisión
        y nos adaptamos al horario que menos moleste.
      </p>
    </ServicePageLayout>
  );
}
