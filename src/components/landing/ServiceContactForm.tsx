"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const WA = "34607953886";

export default function ServiceContactForm({ serviceTitle }: { serviceTitle: string }) {
  const t = useTranslations("landing");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola, me interesa el servicio de *${serviceTitle}*.\n\nNombre: ${form.name}\nTeléfono: ${form.phone}\nEmail: ${form.email}\n\n${form.message || "Quisiera recibir más información."}`
    );
    window.open(`https://wa.me/${WA}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-7 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-5">{t("serviceForm.title")}</h3>

      {sent ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#25D366" }}>
            <svg className="w-7 h-7" viewBox="0 0 448 512" fill="white">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-23.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
          </div>
          <p className="font-semibold text-gray-800">{t("serviceForm.sentTitle")}</p>
          <p className="text-sm text-gray-500 mt-1">{t("serviceForm.sentDesc")}</p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary-600 hover:underline">
            {t("serviceForm.sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t("serviceForm.name")}</label>
            <input
              name="name" value={form.name} onChange={handle} required
              placeholder={t("serviceForm.namePlaceholder")}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t("serviceForm.phone")}</label>
            <input
              name="phone" value={form.phone} onChange={handle} required
              placeholder="6XX XXX XXX" type="tel"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t("serviceForm.email")}</label>
            <input
              name="email" value={form.email} onChange={handle}
              placeholder="correo@ejemplo.com" type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">{t("serviceForm.message")}</label>
            <textarea
              name="message" value={form.message} onChange={handle} rows={4}
              placeholder={t("serviceForm.messagePlaceholder")}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {t("serviceForm.submit")}
          </button>
          <p className="text-[11px] text-gray-400 text-center">
            {t("serviceForm.note")}
          </p>
        </form>
      )}
    </div>
  );
}
