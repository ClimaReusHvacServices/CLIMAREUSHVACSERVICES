"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  cliente: "Cliente",
  trabajador: "Trabajador",
};

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export function UserAvatar({ firstName, lastName, email, role }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/20 transition-colors"
      >
        {/* Circulo con iniciales */}
        <div className="w-9 h-9 rounded-full bg-accent-400 flex items-center justify-center text-white font-bold text-sm shadow-sm select-none">
          {getInitials(firstName, lastName)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-white text-sm font-medium leading-none">{firstName} {lastName}</p>
          <p className="text-primary-200 text-xs leading-none mt-0.5">{roleLabel[role] ?? role}</p>
        </div>
        <ChevronDown size={14} className={`text-primary-200 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* Info usuario */}
          <div className="px-4 py-3 bg-primary-50 border-b border-primary-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-400 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(firstName, lastName)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{firstName} {lastName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
                <span className="inline-block mt-0.5 text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                  {roleLabel[role] ?? role}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="p-1">
            {role === "cliente" && (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <User size={16} className="text-gray-400" />
                Mi Perfil
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
