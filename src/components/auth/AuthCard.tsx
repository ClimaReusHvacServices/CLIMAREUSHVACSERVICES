"use client";

import React, { useState, useRef } from "react";
import { signIn, getSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { toast } from "sonner";
import { LogIn, UserPlus, CheckCircle2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { validateRegisterData } from "@/utils/validation";


type Mode = "login" | "register";

// ── Defined at module level so React never sees it as a "new" component type ──
function AuthField({
  label, name, type = "text", placeholder, helper, pw,
  value, error, showPw, onTogglePw, onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  helper?: string;
  pw?: boolean;
  value: string;
  error?: string;
  showPw?: boolean;
  onTogglePw?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={pw ? (showPw ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`w-full px-3.5 py-2.5 ${pw ? "pr-10" : ""} text-sm border rounded-xl focus:outline-none focus:ring-1 transition-shadow bg-gray-50 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
          }`}
        />
        {pw && onTogglePw && (
          <button
            type="button"
            onClick={onTogglePw}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helper && !error && <p className="text-[10px] text-gray-400 mt-1">{helper}</p>}
    </div>
  );
}

function SuccessModal({ firstName }: { firstName: string }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
      <div
        className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center"
        style={{ animation: "authFadeIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg"
          style={{ background: "linear-gradient(135deg, #008f65, #1d7291)" }}
        >
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">¡Cuenta creada!</h2>
        <p className="text-sm text-gray-500 mb-1">
          Bienvenido/a, <span className="font-semibold text-gray-700">{firstName}</span>
        </p>
        <p className="text-xs text-gray-400 mb-7">Tu cuenta ha sido creada con éxito. Ahora puedes iniciar sesión.</p>
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #008f65, #1d7291)",
              animation: "progressFill 2s linear forwards",
            }}
          />
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          <LogIn size={15} /> Ir al inicio de sesión
        </Link>
        <style>{`
          @keyframes progressFill { from { width:0% } to { width:100% } }
        `}</style>
      </div>
    </div>
  );
}

function LoginContent({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });

  const set = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) { toast.error("Introduce tu email o usuario"); return; }
    if (!form.password) { toast.error("Introduce tu contraseña"); return; }
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
      if (res?.error) toast.error(t("auth.loginError"));
      else if (res?.ok) {
        const session = await getSession();
        const needsChange = (session?.user as any)?.requiresPasswordChange;
        window.location.href = needsChange ? `/${locale}/change-password` : "/";
      }
    } catch { toast.error(t("errors.serverError")); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8 space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">{t("auth.login")}</h2>
        <p className="text-sm text-gray-500 mt-1">Accede a tu cuenta de Clima HVAC Service</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email o usuario</label>
          <input
            name="email" type="text" value={form.email} onChange={set} placeholder="usuario@email.com"
            autoComplete="username" required
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-shadow bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("auth.password")}</label>
          <div className="relative">
            <input
              name="password" type={showPw ? "text" : "password"} value={form.password} onChange={set}
              placeholder="••••••••" autoComplete="current-password" required
              className="w-full px-3.5 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-shadow bg-gray-50"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={set}
              className="w-4 h-4 rounded border-gray-300 accent-primary-600" />
            <span className="text-xs text-gray-600">{t("auth.rememberMe")}</span>
          </label>
          <Link href="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <LogIn size={15} />}
          {loading ? "Iniciando sesión..." : t("auth.login")}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500">
        {t("auth.noAccount")}{" "}
        <button onClick={() => onSwitch("register")} className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
          {t("auth.signUp")}
        </button>
      </p>
    </div>
  );
}

type NominatimResult = {
  place_id: number;
  display_name: string;
  address: {
    road?: string; house_number?: string; city?: string; town?: string;
    village?: string; municipality?: string; postcode?: string;
  };
};

function AddressAutocomplete({
  value, error,
  onChange, onSelect,
}: {
  value: string; error?: string;
  onChange: (val: string) => void;
  onSelect: (street: string, city: string, postalCode: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 5) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&countrycodes=es&limit=5`,
          { headers: { "Accept-Language": "es" } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch { /* silent */ }
      finally { setSearching(false); }
    }, 500);
  };

  const pick = (r: NominatimResult) => {
    const { road, house_number, city, town, village, municipality, postcode } = r.address;
    const street = [road, house_number].filter(Boolean).join(", ") || r.display_name.split(",")[0];
    const resolvedCity = city ?? town ?? village ?? municipality ?? "";
    const resolvedPostal = postcode?.split(";")[0] ?? "";
    onSelect(street, resolvedCity, resolvedPostal);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Dirección (calle y número)</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); search(e.target.value); }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Calle Principal, 123"
          autoComplete="off"
          className={`w-full px-3.5 py-2.5 pr-8 text-sm border rounded-xl focus:outline-none focus:ring-1 transition-shadow bg-gray-50 ${
            error ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
          }`}
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {suggestions.map(r => (
            <li
              key={r.place_id}
              onMouseDown={() => pick(r)}
              className="px-3.5 py-2.5 text-xs text-gray-700 hover:bg-primary-50 cursor-pointer border-b border-gray-50 last:border-0 leading-snug"
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RegisterContent({ onSwitch }: { onSwitch: (m: Mode) => void }) {
  const t = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phoneNumber: "", address: "",
    city: "", postalCode: "",
    email: "", username: "", password: "", confirmPassword: "",
  });

  const set = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleAddressSelect = (street: string, city: string, postalCode: string) => {
    setForm(p => ({ ...p, address: street, city, postalCode }));
    setErrors(p => ({ ...p, address: "", city: "", postalCode: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    const v = validateRegisterData(form);
    if (!v.success) { setErrors(v.errors!); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v.data),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setGeneralError(data.message || t("auth.registerError"));
      } else {
        setFirstName(form.firstName);
        setShowSuccess(true);
        setTimeout(() => router.push("/login"), 2100);
      }
    } catch { setGeneralError(t("errors.serverError")); }
    finally { setLoading(false); }
  };

  return (
    <>
      {showSuccess && <SuccessModal firstName={firstName} />}
      <div className="p-8 space-y-5">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900">{t("auth.signUp")}</h2>
          <p className="text-sm text-gray-500 mt-1">Crea tu cuenta en Clima HVAC Service</p>
        </div>
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-red-700 text-sm flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {generalError}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <AuthField label={t("auth.firstName")} name="firstName" placeholder={t("auth.firstName")}
              value={form.firstName} error={errors.firstName} onChange={set} />
            <AuthField label={t("auth.lastName")} name="lastName" placeholder={t("auth.lastName")}
              value={form.lastName} error={errors.lastName} onChange={set} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AuthField label={t("auth.phoneNumber")} name="phoneNumber" type="tel" placeholder="+34 612 345 678"
              value={form.phoneNumber} error={errors.phoneNumber} onChange={set} />
            <AuthField label={t("auth.email")} name="email" type="email" placeholder="email@ejemplo.com"
              value={form.email} error={errors.email} onChange={set} />
          </div>
          <AddressAutocomplete
            value={form.address}
            error={errors.address}
            onChange={val => { setForm(p => ({ ...p, address: val })); if (errors.address) setErrors(p => ({ ...p, address: "" })); }}
            onSelect={handleAddressSelect}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ciudad</label>
              <input
                name="city" type="text" value={form.city}
                onChange={set} placeholder="Reus"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 transition-shadow bg-gray-50 ${
                  errors.city ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                              : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
                }`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Código postal</label>
              <input
                name="postalCode" type="text" value={form.postalCode}
                onChange={set} placeholder="43201" maxLength={5}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-1 transition-shadow bg-gray-50 ${
                  errors.postalCode ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                                    : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
                }`}
              />
              {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AuthField label={t("auth.username")} name="username" placeholder="tu_usuario"
              helper="Letras, números, - y _"
              value={form.username} error={errors.username} onChange={set} />
            <AuthField label={t("auth.password")} name="password" placeholder="••••••••"
              helper="Mín 8 car., may., nº y especial" pw
              value={form.password} error={errors.password}
              showPw={showPw} onTogglePw={() => setShowPw(v => !v)} onChange={set} />
          </div>
          <AuthField label={t("auth.confirmPassword")} name="confirmPassword" placeholder="••••••••" pw
            value={form.confirmPassword} error={errors.confirmPassword}
            showPw={showPw} onTogglePw={() => setShowPw(v => !v)} onChange={set} />
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <UserPlus size={15} />}
            {loading ? "Creando cuenta..." : t("auth.signUp")}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          {t("auth.hasAccount")}{" "}
          <button onClick={() => onSwitch("login")} className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
            {t("auth.login")}
          </button>
        </p>
        <p className="text-[10px] text-gray-400 text-center">Al registrarte aceptas nuestros términos y política de privacidad.</p>
      </div>
    </>
  );
}

export function AuthCard({ initialMode = "login" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [animKey, setAnimKey] = useState(0);
  const t = useTranslations();

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="w-full max-w-lg">
      {/* Tab switcher */}
      <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-1 mb-4">
        {(["login", "register"] as const).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              mode === m
                ? "bg-white text-primary-800 shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            {m === "login" ? <LogIn size={14} /> : <UserPlus size={14} />}
            {m === "login" ? t("auth.login") : t("auth.signUp")}
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div key={animKey} style={{ animation: "authFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both" }}>
          {mode === "login"
            ? <LoginContent onSwitch={switchMode} />
            : <RegisterContent onSwitch={switchMode} />}
        </div>
      </div>
    </div>
  );
}
