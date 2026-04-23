import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { verifyPassword, hashPassword } from "@/utils/password";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      phoneNumber?: string;
      address?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber?: string;
    address?: string;
  }

  interface JWT {
    id: string;
    role: UserRole;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son obligatorios");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) throw new Error("Usuario no encontrado");
        if (!user.isActive) throw new Error("Cuenta inactiva");

        const passwordMatch = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) throw new Error("Contraseña incorrecta");

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phoneNumber: user.phoneNumber ?? undefined,
          address: user.address ?? undefined,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Credentials sign-in: user es el objeto de authorize()
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
      }

      // Google sign-in: buscar o crear usuario en nuestra BD
      if (account?.provider === "google" && profile?.email) {
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
        });

        if (existingUser) {
          token.id = existingUser.id;
          token.role = existingUser.role;
          token.username = existingUser.username;
          token.firstName = existingUser.firstName;
          token.lastName = existingUser.lastName;
          token.phoneNumber = existingUser.phoneNumber ?? undefined;
          token.address = existingUser.address ?? undefined;
        } else {
          // Generar username único desde el email
          const baseUsername = profile.email.split("@")[0].slice(0, 18).replace(/[^a-zA-Z0-9_-]/g, "_");
          let username = baseUsername;
          let attempt = 1;
          while (await db.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${attempt++}`;
          }

          const googleProfile = profile as Record<string, string>;
          const newUser = await db.user.create({
            data: {
              email: profile.email,
              username,
              firstName: googleProfile.given_name || profile.name?.split(" ")[0] || "",
              lastName: googleProfile.family_name || profile.name?.split(" ").slice(1).join(" ") || "",
              password: hashPassword(`google-${Date.now()}`),
              role: UserRole.cliente,
              profileImageUrl: googleProfile.picture || undefined,
              emailVerified: true,
              isActive: true,
            },
          });

          // Crear registro de Cliente
          await db.cliente.create({ data: { userId: newUser.id } });

          token.id = newUser.id;
          token.role = newUser.role;
          token.username = newUser.username;
          token.firstName = newUser.firstName;
          token.lastName = newUser.lastName;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const t = token as unknown as {
          id: string;
          role: UserRole;
          username: string;
          firstName: string;
          lastName: string;
          phoneNumber?: string;
          address?: string;
        };
        session.user.id = t.id;
        session.user.role = t.role;
        session.user.username = t.username;
        session.user.firstName = t.firstName;
        session.user.lastName = t.lastName;
        session.user.phoneNumber = t.phoneNumber;
        session.user.address = t.address;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
});
