"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { InputField } from "@/components/common/InputField";
import { Button } from "@/components/common/Button";
import { toast } from "sonner";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Introduce tu email o nombre de usuario");
      return;
    }
    if (!formData.password) {
      toast.error("Introduce tu contraseña");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(t("auth.loginError"));
      } else if (result?.ok) {
        router.push("/");
      }
    } catch {
      toast.error(t("errors.serverError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("auth.login")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email o nombre de usuario"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="ejemplo@correo.com o tu_usuario"
            autoComplete="username"
            required
          />

          <InputField
            label={t("auth.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                {t("auth.rememberMe")}
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-accent-500 hover:text-accent-600">
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            {t("auth.login")}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-accent-500 hover:text-accent-600 font-semibold">
            {t("auth.signUp")}
          </Link>
        </div>
      </div>
    </div>
  );
}
