"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { X, Send, CheckCircle2, Wrench } from "lucide-react";

const MIN_WORDS = 5;

function isValidPhone(raw: string): boolean {
  const trimmed = raw.trim();
  if (!/^[+\d][\d\s\-().+]*$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ServiceRequestWidget() {
  const t = useTranslations("serviceRequest");
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role ?? "";

  const [showBubble, setShowBubble] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [descTouched, setDescTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bubbleTimerRef.current = setTimeout(() => setShowBubble(true), 4000);
    return () => { if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current); };
  }, []);

  function openForm() {
    setShowBubble(false);
    setOpen(true);
    setDone(false);
    setError("");
  }

  function closeForm() {
    setOpen(false);
    setName("");
    setPhone("");
    setDescription("");
    setError("");
    setDone(false);
    setPhoneTouched(false);
    setDescTouched(false);
  }

  const phoneError = phoneTouched && !isValidPhone(phone);
  const descError = descTouched && countWords(description) < MIN_WORDS;
  const canSubmit = name.trim() && isValidPhone(phone) && countWords(description) >= MIN_WORDS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneTouched(true);
    setDescTouched(true);
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), description: description.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t("errorDesc"));
        return;
      }
      setDone(true);
    } catch {
      setError(t("errorDesc"));
    } finally {
      setSubmitting(false);
    }
  }

  if (status !== "loading" && (role === "admin" || role === "trabajador")) return null;

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
        {showBubble && !open && (
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-2.5 text-sm text-gray-800 max-w-[200px] text-center cursor-pointer relative"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))" }}
            onClick={openForm}
          >
            {t("bubbleText")}
            <button
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
            >
              <X size={10} />
            </button>
            <div className="absolute -bottom-2 right-4 w-4 h-2 overflow-hidden">
              <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 translate-y-[-50%] translate-x-[4px] shadow" />
            </div>
          </div>
        )}

        <button
          onClick={openForm}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 text-white"
          style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
          aria-label={t("formTitle")}
        >
          <Wrench size={22} />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
        >
          <div
            className="w-full sm:w-[380px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "90vh" }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
            >
              <div>
                <p className="text-white font-bold text-base">{t("formTitle")}</p>
                <p className="text-white/70 text-xs mt-0.5">{t("widgetSubtitle")}</p>
              </div>
              <button onClick={closeForm} className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 72px)" }}>
              {done ? (
                <div className="py-6 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}>
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{t("successTitle")}</p>
                    <p className="text-gray-500 text-sm mt-1">{t("successDesc")}</p>
                  </div>
                  <button
                    onClick={() => { setDone(false); setName(""); setPhone(""); setDescription(""); setPhoneTouched(false); setDescTouched(false); }}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("name")} *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("namePlaceholder")}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("phone")} *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (phoneTouched) setPhoneTouched(true); }}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder={t("phonePlaceholderFree")}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors ${
                        phoneError
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-primary-300 focus:border-primary-400"
                      }`}
                    />
                    {phoneError ? (
                      <p className="text-xs text-red-500 mt-1">{t("phoneInvalid")}</p>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-1">{t("phoneHint")}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("description")} *</label>
                    <textarea
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); if (descTouched) setDescTouched(true); }}
                      onBlur={() => setDescTouched(true)}
                      placeholder={t("descriptionPlaceholder")}
                      rows={4}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
                        descError
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-primary-300 focus:border-primary-400"
                      }`}
                    />
                    {descError ? (
                      <p className="text-xs text-red-500 mt-1">{t("descriptionMinWords")}</p>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {countWords(description)}/{MIN_WORDS} {t("descriptionWordsHint")}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
                    style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {submitting ? t("submitting") : t("submit")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
