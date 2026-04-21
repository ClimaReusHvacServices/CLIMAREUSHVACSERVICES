import { z } from "zod";
import { FormErrors } from "@/types";

// ============================================
// SCHEMAS DE VALIDACIÓN CON ZOD
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Email inválido").or(z.string().min(3, "Usuario inválido")),
  password: z.string().min(1, "La contraseña es requerida"),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    phoneNumber: z.string().regex(/^[0-9+\-\s()]+$/, "Teléfono inválido"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    email: z.string().email("Email inválido"),
    username: z
      .string()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(20, "El nombre de usuario no puede exceder 20 caracteres")
      .regex(/^[a-zA-Z0-9_-]+$/, "El nombre de usuario solo puede contener letras, números, _ y -"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .regex(/[!@#$%^&*]/, "La contraseña debe contener al menos un carácter especial (!@#$%^&*)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ============================================
// TYPES PARA SCHEMAS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Valida datos de login y retorna errores formateados
 */
export function validateLoginData(data: unknown): {
  success: boolean;
  data?: LoginInput;
  errors?: FormErrors;
} {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const errors: FormErrors = {};
    result.error.errors.forEach((err) => {
      const path = err.path[0] as string;
      errors[path] = err.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}

/**
 * Valida datos de registro y retorna errores formateados
 */
export function validateRegisterData(data: unknown): {
  success: boolean;
  data?: RegisterInput;
  errors?: FormErrors;
} {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    const errors: FormErrors = {};
    result.error.errors.forEach((err) => {
      const path = err.path[0] as string;
      errors[path] = err.message;
    });
    return { success: false, errors };
  }

  return { success: true, data: result.data };
}
