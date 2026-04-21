"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { validateRegisterData } from "@/utils/validation";

export function RegisterForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [generalSuccess, setGeneralSuccess] = useState("");
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");
    setGeneralSuccess("");
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
        setGeneralSuccess(t("auth.registerSuccess"));
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
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("auth.signUp")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("auth.hasAccount")}{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t("auth.login")}
            </Link>
          </p>
        </div>

        {/* Mensajes */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{generalError}</span>
          </div>
        )}
        {generalSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm flex items-start gap-2">
            <span className="text-lg">✅</span>
            <span>{generalSuccess}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("auth.firstName")}
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              placeholder={t("auth.firstName")}
              required
            />
            <InputField
              label={t("auth.lastName")}
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              placeholder={t("auth.lastName")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("auth.phoneNumber")}
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              placeholder="+34 612 345 678"
              required
            />
            <InputField
              label={t("auth.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <InputField
            label={t("auth.address")}
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            placeholder="Calle Principal, 123"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("auth.username")}
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              placeholder="tu_usuario"
              helperText="Solo letras, números, - y _"
              required
            />
            <InputField
              label={t("auth.password")}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="••••••••"
              helperText="Min 8 caracteres, mayúscula, número y especial"
              required
            />
          </div>

          <InputField
            label={t("auth.confirmPassword")}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            {t("auth.signUp")}
          </Button>
        </form>

        <p className="text-xs text-gray-600 text-center">
          Al registrarte, aceptas nuestros términos y condiciones de uso y la
          política de privacidad.
        </p>
      </div>
    </div>
  );
}
