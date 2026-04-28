import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";

const WA_NUMBER = "34607953886";

export default async function Footer() {
  const t = await getTranslations("landing");

  const HOURS = [
    { day: t("footer.h1day"), time: t("footer.h1time") },
    { day: t("footer.h2day"), time: t("footer.h2time") },
    { day: t("footer.h3day"), time: t("footer.h3time") },
  ];

  const BOTTOM_LINKS = [
    { href: "#",          label: t("footer.linkHome") },
    { href: "#oferta",    label: t("footer.linkOffers") },
    { href: "#servicios", label: t("footer.linkServices") },
    { href: "#contact",   label: t("footer.linkContact") },
  ];

  const closedLabel = t("footer.h3time");

  return (
    <footer className="bg-gray-50 border-t border-gray-200">

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* 1 — Brand */}
        <div>
          <h3 className="text-base font-extrabold text-gray-900 mb-2">Clima Reus HVAC Services</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center gap-2.5">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1ZYNJBntAz/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: "#1877F2" }}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 448 512" fill="white">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/climareushvacservices"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
              style={{ background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" }}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="white">
                <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 2.75a5.75 5.75 0 110 11.5 5.75 5.75 0 010-11.5zm0 1.5a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zm5.62-.38a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 2 — Address */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin size={14} className="text-primary-500" />
            {t("footer.colAddress")}
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Carrer de Balmes 29<br />
            43204 Reus, Tarragona
          </p>
          <a
            href="https://maps.google.com/?q=Carrer+de+Balmes+29,+43204+Reus"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors hover:underline"
          >
            {t("footer.mapsLink")}
          </a>
        </div>

        {/* 3 — Contact */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Phone size={14} className="text-primary-500" />
            {t("footer.colContact")}
          </h4>
          <div className="space-y-2 text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-600">{t("footer.telLabel")}</span>{" "}
              <a href="tel:+34877234166" className="hover:text-primary-600 transition-colors">
                (877) 23-41-66
              </a>
            </p>
            <p>
              <span className="font-semibold text-gray-600">{t("footer.waLabel")}</span>{" "}
              <a href={`https://wa.me/${WA_NUMBER}`} className="hover:text-primary-600 transition-colors">
                +34 607 953 886
              </a>
            </p>
            <p className="flex items-start gap-1">
              <Mail size={13} className="text-gray-400 mt-0.5 shrink-0" />
              <a
                href="mailto:ventas@climareushvacservices.es"
                className="hover:text-primary-600 transition-colors break-all"
              >
                ventas@climareushvacservices.es
              </a>
            </p>
          </div>
        </div>

        {/* 4 — Hours */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={14} className="text-primary-500" />
            {t("footer.colHours")}
          </h4>
          <div className="space-y-2">
            {HOURS.map(({ day, time }) => (
              <div key={day} className="flex justify-between text-sm">
                <span className="text-gray-500">{day}</span>
                <span className={`font-medium ${time === closedLabel ? "text-red-400" : "text-gray-700"}`}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">{t("footer.copyright")}</p>
          <nav className="flex flex-wrap items-center justify-center gap-5">
            {BOTTOM_LINKS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="text-center pb-5">
          <Link
            href="/terms"
            className="text-[11px] font-semibold tracking-widest uppercase text-primary-600 hover:text-primary-800 hover:underline transition-colors"
          >
            {t("footer.terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
