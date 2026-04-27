"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/InputField";
import { updateProfile } from "@/app/[locale]/(dashboard)/profile/actions";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

export function ProfileForm({ user }: { user: ProfileData }) {
  const t = useTranslations("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    postalCode: user.postalCode ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success(t("updateSuccess"));
    } catch {
      toast.error(t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t("firstName")}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <InputField
          label={t("lastName")}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">{t("email")}</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">{t("emailNote")}</p>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">{t("username")}</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">{t("usernameNote")}</p>
        </div>
      </div>

      <InputField
        label={t("phone")}
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <InputField
        label={t("address")}
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t("city")}
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
        <InputField
          label={t("postalCode")}
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>

      <div className="pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}
