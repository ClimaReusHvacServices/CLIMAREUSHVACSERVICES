"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export function InputField({
  label,
  error,
  icon,
  helperText,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-primary-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          className={`
            w-full px-4 py-2 border rounded-lg outline-none transition-colors
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-primary-600 focus:border-primary-600 focus:ring-primary-100"
                : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-primary-600 flex items-center gap-1">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
