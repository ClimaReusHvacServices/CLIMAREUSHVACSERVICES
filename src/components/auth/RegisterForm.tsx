"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { validateRegisterData } from "@/utils/validation";
import { AlertTriangle, CheckCircle2, LogIn } from "lucide-react";

function SuccessModal({ firstName, onRedirect }: { firstName: string; onRedirect: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center animate-scale-in">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg"
          style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
        >
          <CheckCircle2 size={40} strokeWidth={2} className="text-white" />
        </div>

        {/* Texts */}
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">¡Cuenta creada!</h2>
        <p className="text-gray-500 text-sm mb-1">
          Bienvenido/a, <span className="font-semibold text-gray-700">{firstName}</span>
        </p>
        <p className="text-gray-400 text-xs mb-7">
          Tu cuenta ha sido creada con éxito. Ahora puedes iniciar sesión.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #008f65, #1d7291)",
              animation: "progress-fill 2s linear forwards",
            }}
          />
        </div>

        <button
          onClick={onRedirect}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <LogIn size={15} />
          Ir al inicio de sesión
        </button>

        <style>{`
          @keyframes progress-fill {
            from { width: 0% }
            to   { width: 100% }
          }
          @keyframes scale-in {
            from { transform: scale(0.85); opacity: 0 }
            to   { transform: scale(1);    opacity: 1 }
          }
          .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        `}</style>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    const validation = validateRegisterData(formData);
    if (!validation.success) {
      setErrors(validation.errors!);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        setGeneralError(result.message || t("auth.registerError"));
      } else {
        setRegisteredName(formData.firstName);
        setShowSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      setGeneralError(t("errors.serverError"));
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <SuccessModal
          firstName={registeredName}
          onRedirect={() => router.push("/login")}
        />
      )}

      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{t("auth.signUp")}</h1>
            <p className="text-gray-600 mt-2">
              {t("auth.hasAccount")}{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                {t("auth.login")}
              </Link>
            </p>
          </div>

          {generalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-start gap-2">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t("auth.firstName")} type="text" name="firstName"
                value={formData.firstName} onChange={handleInputChange}
                error={errors.firstName} placeholder={t("auth.firstName")} required
              />
              <InputField
                label={t("auth.lastName")} type="text" name="lastName"
                value={formData.lastName} onChange={handleInputChange}
                error={errors.lastName} placeholder={t("auth.lastName")} required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t("auth.phoneNumber")} type="tel" name="phoneNumber"
                value={formData.phoneNumber} onChange={handleInputChange}
                error={errors.phoneNumber} placeholder="+34 612 345 678" required
              />
              <InputField
                label={t("auth.email")} type="email" name="email"
                value={formData.email} onChange={handleInputChange}
                error={errors.email} placeholder="ejemplo@correo.com" required
              />
            </div>

            <InputField
              label={t("auth.address")} type="text" name="address"
              value={formData.address} onChange={handleInputChange}
              error={errors.address} placeholder="Calle Principal, 123" required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t("auth.username")} type="text" name="username"
                value={formData.username} onChange={handleInputChange}
                error={errors.username} placeholder="tu_usuario"
                helperText="Solo letras, números, - y _" required
              />
              <InputField
                label={t("auth.password")} type="password" name="password"
                value={formData.password} onChange={handleInputChange}
                error={errors.password} placeholder="••••••••"
                helperText="Min 8 caracteres, mayúscula, número y especial" required
              />
            </div>

            <InputField
              label={t("auth.confirmPassword")} type="password" name="confirmPassword"
              value={formData.confirmPassword} onChange={handleInputChange}
              error={errors.confirmPassword} placeholder="••••••••" required
            />

            <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
              {t("auth.signUp")}
            </Button>
          </form>

          <p className="text-xs text-gray-600 text-center">
            Al registrarte, aceptas nuestros términos y condiciones de uso y la política de privacidad.
          </p>
        </div>
      </div>
    </>
  );
}
