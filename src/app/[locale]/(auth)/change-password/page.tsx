"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { KeyRound, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { changePasswordAction } from "./actions";

export default function ChangePasswordPage() {
  const locale = useLocale();
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await changePasswordAction(newPwd, confirmPwd);
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
        setTimeout(() => signOut({ callbackUrl: `/${locale}/login` }), 1800);
      }
    });
  }

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-white/10 p-10 flex flex-col items-center text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
          >
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
          <p className="text-sm text-gray-500 mb-6">Redirigiendo al inicio de sesión…</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(to right, #008f65, #1d7291)",
                animation: "progressFill 1.8s linear forwards",
              }}
            />
          </div>
          <style>{`@keyframes progressFill { from { width:0% } to { width:100% } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header stripe */}
        <div
          className="px-8 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, #0d3c4d 0%, #1d7291 60%, #008f65 100%)" }}
        >
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/25">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Cambia tu contraseña</h1>
          <p className="text-sm text-white/70 mt-1.5 leading-relaxed">
            Por seguridad, establece una contraseña privada antes de continuar.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* New password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nueva contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound size={15} className="text-gray-400" />
              </div>
              <input
                type={showNew ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirmar contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound size={15} className="text-gray-400" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-400 focus:border-primary-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {isPending ? (
              <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck size={16} />
            )}
            {isPending ? "Guardando…" : "Establecer nueva contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
