import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash una contraseña de forma segura usando bcrypt
 * @param password - La contraseña en texto plano
 * @returns La contraseña hasheada
 */
export function hashPassword(password: string): string {
  const hash = bcryptjs.hashSync(password, SALT_ROUNDS);
  return hash;
}

/**
 * Verifica una contraseña contra su hash
 * @param password - La contraseña en texto plano
 * @param hash - El hash almacenado en la base de datos
 * @returns true si la contraseña es correcta
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Genera un token único para "Recuérdame"
 * El token se hashea antes de almacenarse en la BD
 * @returns Token en formato legible (para cliente) y su hash (para BD)
 */
export function generateRememberToken(): {
  token: string;
  hash: string;
} {
  const token = require("crypto").randomBytes(32).toString("hex");
  const hash = hashPassword(token);
  return { token, hash };
}

/**
 * Verifica un token de "Recuérdame"
 * @param token - Token en texto plano del cliente
 * @param hash - Hash almacenado en la BD
 * @returns true si el token es válido
 */
export async function verifyRememberToken(
  token: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(token, hash);
}
