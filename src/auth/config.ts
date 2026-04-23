import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { verifyPassword } from "@/utils/password";
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

        const identifier = credentials.email as string;
        const isEmail = identifier.includes("@");

        const user = isEmail
          ? await db.user.findUnique({ where: { email: identifier } })
          : await db.user.findUnique({ where: { username: identifier } });

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
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phoneNumber = user.phoneNumber;
        token.address = user.address;
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
