const PHONE = "34607953886";
const SITE = "climahvacservice.es";

function link(msg: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

export const WA_PHONE = PHONE;

export const WA_GENERAL = link(
  `Hola, les contacto desde la página web ${SITE}. Me gustaría recibir información sobre vuestros servicios de climatización. ¿Podéis ayudarme?`
);

export const WA_AEROTERMIA = link(
  `Hola, les contacto desde la página web ${SITE}. Estoy interesado/a en la aerotermia. ¿Podéis asesorarme y darme un presupuesto sin compromiso?`
);

export const WA_CALDERAS = link(
  `Hola, les contacto desde la página web ${SITE}. Me interesa información sobre calderas de gas. ¿Podéis asesorarme y darme un presupuesto sin compromiso?`
);

export const WA_SOBRE_NOSOTROS = link(
  `Hola, les contacto desde la página web ${SITE}. Me gustaría obtener más información sobre vuestros servicios. ¿Podéis ayudarme?`
);

export function waProduct(name: string, brand?: string | null) {
  const b = brand ? ` de ${brand}` : "";
  return link(
    `Hola, les contacto desde la página web ${SITE}. Estoy interesado/a en el equipo *${name}*${b}. ¿Podéis darme más información y un presupuesto con instalación?`
  );
}

export function waService(title: string) {
  return link(
    `Hola, les contacto desde la página web ${SITE}. Me interesa el servicio de *${title}*. ¿Podéis informarme y darme un presupuesto sin compromiso?`
  );
}

export function waOfertaProduct(name: string) {
  return link(
    `Hola, les contacto desde la página web ${SITE}. Me interesa el producto: *${name}*. ¿Podéis darme más información y un presupuesto con instalación?`
  );
}
