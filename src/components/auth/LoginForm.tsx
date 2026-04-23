"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
// signIn kept for credentials submit below
import { useRouter, Link } from "@/i18n/routing";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { validateLoginData } from "@/utils/validation";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");
    setErrors({});

    const validation = validateLoginData(formData);
    if (!validation.success) {
      setErrors(validation.errors!);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setGeneralError(t("auth.loginError"));
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      setGeneralError(t("errors.serverError"));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("auth.login")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("auth.noAccount")}{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t("auth.register")}
            </Link>
          </p>
        </div>

        {/* Error general */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{generalError}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <InputField
            label={t("auth.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          {/* Checkbox Recuérdame */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 cursor-pointer"
            >
              {t("auth.rememberMe")}
            </label>
          </div>

          {/* Link recuperar contraseña */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            variant="primary"
          >
            {t("auth.login")}
          </Button>
        </form>

        {/* Link a registro */}
        <div className="text-center text-sm text-gray-600">
          <p>
            {t("auth.hasAccount")}{" "}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              {t("auth.signUp")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
