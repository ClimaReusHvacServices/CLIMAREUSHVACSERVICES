import dynamic from "next/dynamic";
import Footer from "@/components/landing/Footer";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

export const metadata = {
  title: "Términos y Condiciones | Clima HVAC Service",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-12 px-4 text-center" style={{ background: "linear-gradient(160deg, #0d3c4d 0%, #1d7291 100%)" }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Términos y Condiciones</h1>
        <p className="mt-2 text-white/70 text-sm">Clima HVAC Service · Ariel Hugo José Morales</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* ─── CONDICIONES DEL SERVICIO ─── */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8 pb-3 border-b-2 border-primary-200">
          Condiciones del Servicio
        </h1>

        <Section title="Objeto">
          <p>
            Las presentes Condiciones Generales regulan la prestación de servicios de instalación,
            mantenimiento y comercialización de sistemas de climatización, aerotermia y
            ventilación ofrecidos por Ariel Hugo José Morales / Clima HVAC Service.
          </p>
          <p>
            Estas condiciones se aplican a todos los usuarios que contraten servicios a través del sitio
            web o por cualquier otro canal habilitado.
          </p>
          <p>
            El acceso, navegación y contratación implican la aceptación expresa de las presentes
            condiciones, conforme a lo establecido en la Ley 34/2002, de Servicios de la Sociedad de la
            Información y Comercio Electrónico (LSSI-CE).
          </p>
        </Section>

        <Section title="Utilización del Servicio">
          <p>
            El usuario se compromete a hacer un uso adecuado del sitio web y de los servicios ofrecidos,
            conforme a la legislación vigente, la buena fe y el orden público.
          </p>
          <p>Queda prohibido:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilizar el sitio web con fines ilícitos o fraudulentos.</li>
            <li>Introducir virus o sistemas que alteren el funcionamiento del servicio.</li>
            <li>Acceder sin autorización a sistemas o datos de la empresa.</li>
          </ul>
          <p>El incumplimiento podrá dar lugar a responsabilidades conforme al Código Civil y normativa aplicable.</p>
        </Section>

        <Section title="Presupuesto y Contratación">
          <p>El servicio de presupuesto tendrá carácter gratuito dentro de la zona de cobertura definida.</p>
          <p>El presupuesto:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tendrá carácter orientativo, conforme al artículo 1262 del Código Civil.</li>
            <li>Podrá ser revisado en función de condiciones técnicas reales detectadas durante la instalación.</li>
            <li>Tendrá una validez de 15 días naturales, salvo indicación expresa.</li>
          </ul>
          <p>
            La contratación del servicio se entenderá formalizada cuando el cliente acepte el presupuesto
            y se realice el pago de la señal correspondiente, generando un vínculo contractual.
          </p>
        </Section>

        <Section title="Instalación el Mismo Día">
          <p>
            El servicio de instalación el mismo día constituye una prestación de carácter preferente, no
            obligatoria, sujeta a disponibilidad.
          </p>
          <p>Condiciones de aplicación:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ámbito territorial: Reus, Tarragona y zonas de influencia.</li>
            <li>Aceptación inmediata del presupuesto.</li>
            <li>Cumplimiento de condiciones técnicas estándar según el RITE (Real Decreto 1027/2007).</li>
          </ul>
          <p>
            Factores externos como climatología, incidencias técnicas o logísticas podrán alterar los
            plazos, sin que ello genere responsabilidad contractual.
          </p>
        </Section>

        <Section title="Responsabilidad y Garantías">
          <p>La empresa garantiza que las instalaciones se ejecutarán conforme a la normativa vigente, incluyendo RITE (Real Decreto 1027/2007) y REBT (Real Decreto 842/2002).</p>
          <p>La garantía cubre exclusivamente defectos derivados de la ejecución de la instalación. Quedan excluidos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uso indebido o negligente.</li>
            <li>Manipulación por terceros.</li>
            <li>Deficiencias en instalaciones preexistentes.</li>
            <li>Falta de mantenimiento conforme a lo indicado por el fabricante.</li>
          </ul>
        </Section>

        <Section title="Forma de Pago">
          <p>Los servicios podrán abonarse mediante: efectivo, transferencia bancaria o Bizum.</p>
          <p>Todos los pagos deberán realizarse conforme a la normativa fiscal vigente en España.</p>
        </Section>

        <Section title="Condiciones de Pago">
          <p>Para la confirmación del servicio será obligatorio el abono de una señal previa equivalente al 30% o 50% del importe total.</p>
          <p>Dicha señal actúa como garantía de reserva del servicio y permite la planificación operativa y logística.</p>
          <p>El importe restante deberá abonarse a la finalización del servicio. La falta de pago habilita a la empresa a suspender o cancelar la prestación, conforme al artículo 1124 del Código Civil.</p>
        </Section>

        <Section title="Cancelaciones y Cambios">
          <p>El cliente deberá comunicar cualquier cancelación o modificación con un mínimo de 24 horas de antelación.</p>
          <p>En caso de incumplimiento, la empresa podrá aplicar cargos por desplazamiento técnico y costes operativos derivados.</p>
        </Section>

        <Section title="Exclusión de Responsabilidad">
          <p>La empresa no será responsable por retrasos derivados de causas ajenas, fallos en suministros eléctricos o estructurales del cliente, intervenciones de terceros, ni fuerza mayor (artículo 1105 del Código Civil).</p>
          <p>En ningún caso la responsabilidad excederá el importe del servicio contratado.</p>
        </Section>

        <Section title="Propiedad Intelectual">
          <p>
            Todos los contenidos del sitio web (textos, imágenes, logotipos, diseño) están protegidos
            conforme al Real Decreto Legislativo 1/1996 de Propiedad Intelectual.
            Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>
        </Section>

        <Section title="Legislación Aplicable y Protección de Datos">
          <p>Las presentes condiciones se rigen por la legislación española.</p>
          <p>En materia de protección de datos se aplican el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>
          <p>En caso de conflicto, las partes se someterán a los juzgados del domicilio del consumidor.</p>
        </Section>

        {/* ─── AVISO LEGAL ─── */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8 pb-3 border-b-2 border-primary-200 mt-14">
          Aviso Legal
        </h1>

        <Section title="Datos Identificativos">
          <p>En cumplimiento con lo dispuesto en la Ley 34/2002 (LSSI-CE), se informa que el presente sitio web pertenece a:</p>
          <ul className="list-none space-y-1">
            <li><strong>Titular:</strong> Ariel Hugo José Morales / Clima HVAC Service</li>
            <li><strong>Actividad:</strong> Instalación y mantenimiento de sistemas de climatización y aerotermia</li>
            <li><strong>NIF:</strong> Z-1485584-L</li>
            <li><strong>Domicilio:</strong> Calle Balmes, 29 – 43204 Reus, Tarragona</li>
            <li><strong>Teléfono:</strong> 607 953 886</li>
            <li><strong>Email:</strong> ventas@climareushvacservices.es</li>
          </ul>
        </Section>

        <Section title="Objeto del Sitio Web">
          <p>
            El presente sitio web tiene como finalidad ofrecer información sobre los servicios prestados
            por Clima HVAC Service, así como permitir el contacto y solicitud de presupuestos.
          </p>
        </Section>

        <Section title="Condiciones de Uso">
          <p>El acceso y uso del sitio web atribuye la condición de usuario e implica la aceptación de las presentes condiciones, así como la Política de Privacidad y la Política de Cookies.</p>
        </Section>

        <Section title="Responsabilidad">
          <p>La empresa no se responsabiliza de errores u omisiones en los contenidos, falta de disponibilidad del sitio web ni daños derivados del uso indebido.</p>
        </Section>

        <Section title="Propiedad Intelectual">
          <p>Todos los contenidos del sitio web están protegidos por la normativa vigente en materia de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.</p>
        </Section>

        <Section title="Enlaces a Terceros">
          <p>El sitio web puede contener enlaces a páginas externas. La empresa no se responsabiliza del contenido, políticas o prácticas de dichos sitios, conforme a lo establecido en la LSSI-CE.</p>
        </Section>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
