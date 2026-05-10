"use client";

import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { LogIn, Wrench, CheckCircle2, Clock, Shield } from "lucide-react";
import { requestServiceConsultation } from "@/app/[locale]/servicios/actions";
import { waService } from "@/lib/whatsapp";

export default function ServiceContactForm({ serviceTitle }: { serviceTitle: string }) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role ?? "";
  const locale = useLocale();
  const [requesting, startRequest] = useTransition();

  const waMsg = waService(serviceTitle);

  function handleRequest() {
    startRequest(async () => {
      await requestServiceConsultation(serviceTitle, locale);
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-7 sticky top-24 flex flex-col gap-5">
      {/* Header */}
      <div>
        <span className="text-xs font-bold tracking-widest uppercase text-primary-600 block mb-1">
          Solicitar servicio
        </span>
        <h3 className="text-xl font-bold text-gray-900 leading-snug">{serviceTitle}</h3>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          Pide presupuesto sin compromiso. Te contactamos en menos de 24h.
        </p>
      </div>

      {/* Trust badges */}
      <div className="space-y-2">
        {[
          { icon: CheckCircle2, text: "Presupuesto gratuito y sin compromiso" },
          { icon: Clock, text: "Respuesta en menos de 24h" },
          { icon: Shield, text: "Instaladores certificados RITE" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
            <Icon size={13} className="text-primary-500 shrink-0" />
            {text}
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        {role === "cliente" ? (
          <button
            onClick={handleRequest}
            disabled={requesting}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {requesting
              ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Wrench size={15} />}
            {requesting ? "Enviando solicitud..." : "Solicitar este servicio"}
          </button>
        ) : role === "" ? (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 shadow-sm"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            <LogIn size={15} />
            Iniciar sesión para solicitar
          </Link>
        ) : null}

        <a
          href={waMsg}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.15-.199.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.476-.885-.788-1.482-1.761-1.655-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.199-.298.298-.497.1-.198.05-.372-.025-.52-.074-.149-.672-1.62-.923-2.219-.242-.583-.487-.503-.672-.513l-.573-.01c-.198 0-.52.074-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.273-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.535 5.849L.509 21.83a.5.5 0 00.611.637l4.106-1.066A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
