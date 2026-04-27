"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/InputField";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setIsLoading(false);
    setSubmitted(true);
    toast.info(t("comingSoon"));
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-primary-50 rounded-full">
              <MailCheck size={36} className="text-primary-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{t("successTitle")}</h2>
            <p className="text-gray-500 mt-2 text-sm">{t("successDesc")}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-accent-500 hover:text-accent-600 font-medium"
          >
            <ArrowLeft size={16} />
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-500 mt-2 text-sm">{t("description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label={t("email")}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading} variant="primary">
            {t("send")}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={14} />
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
