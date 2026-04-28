import ServicePageLayout from "@/components/landing/ServicePageLayout";

export const metadata = {
  title: "Instalación de Aire Acondicionado en Reus y Tarragona | Clima HVAC Service",
  description: "Instalación de aire acondicionado por instaladores certificados RITE. Presupuesto gratuito y servicio el mismo día en Reus y Tarragona.",
};

export default function InstalacionPage() {
  return (
    <ServicePageLayout
      heroImage="/Imagenes/HVAC_exterior_negro.jpg"
      title="Instalación de Aire Acondicionado en Reus y Tarragona: Tu Clima Ideal, Garantizado"
      subtitle="Expertos instaladores autorizados RITE para climatizar tu hogar o negocio con la máxima eficiencia y limpieza."
      serviceTitle="Instalación de Aire Acondicionado"
    >
      <h2>Soluciones personalizadas en climatización residencial e industrial</h2>
      <p>
        No todos los espacios son iguales. Por eso, en Clima HVAC Servicerealizamos un estudio previo para
        determinar qué sistema se adapta mejor a tu estructura y presupuesto:
      </p>
      <ul>
        <li><strong>Sistemas Split:</strong> La solución más estética y silenciosa para habitaciones individuales.</li>
        <li><strong>Multi-Split:</strong> Una sola unidad exterior para climatizar varias estancias, ahorrando espacio y energía.</li>
        <li><strong>Conductos y Cassette:</strong> Ideal para empresas o viviendas que buscan una distribución invisible y uniforme del aire.</li>
      </ul>

      <h2>¿Por qué confiar tu instalación a Clima HVAC Service?</h2>
      <ul>
        <li>
          <strong>Certificación RITE:</strong> Cumplimos estrictamente con el Reglamento de Instalaciones
          Térmicas en los Edificios. Tu seguridad y la legalidad de tu instalación son prioridad.
        </li>
        <li>
          <strong>Eficiencia Energética A++:</strong> Instalamos equipos Inverter de última generación que
          reducen tu consumo eléctrico hasta un 40% frente a modelos antiguos.
        </li>
        <li>
          <strong>Marcas de Elite:</strong> Trabajamos con los líderes del sector: Mitsubishi Electric,
          Haier, Fanworld y Seico, asegurando repuestos y durabilidad.
        </li>
        <li>
          <strong>+30 años de experiencia:</strong> Más de 4.000 instalaciones realizadas en Reus,
          Tarragona y alrededores avalan nuestra trayectoria.
        </li>
      </ul>

      <h2>Nuestro proceso de instalación en 5 pasos</h2>
      <ol>
        <li><strong>Asesoramiento:</strong> Visita técnica gratuita para medir y presupuestar.</li>
        <li><strong>Planificación:</strong> Elegimos la ubicación óptima para evitar ruidos y corrientes directas.</li>
        <li><strong>Ejecución:</strong> Instalación rápida y limpia en menos de 24/48h.</li>
        <li><strong>Pruebas de Presión:</strong> Verificamos que no existan fugas en el circuito frigorífico.</li>
        <li><strong>Explicación al cliente:</strong> Te enseñamos a usar tu equipo para que ahorres desde el primer día.</li>
      </ol>

      <h2>Servicio de instalación el mismo día</h2>
      <p>
        Disponible en Reus, Tarragona y alrededores. Acepta el presupuesto por la mañana y disfruta
        del clima perfecto esa misma tarde. Sujeto a disponibilidad técnica y condiciones estándar.
      </p>
    </ServicePageLayout>
  );
}
