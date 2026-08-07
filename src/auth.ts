import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Hash a throwaway value when the account is missing so that a bad
        // email and a bad password take a similar amount of time to answer.
        if (!user) {
          await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
          return null;
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        if (user.status === "SUSPENDED") {
          throw new Error("ACCOUNT_SUSPENDED");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],
});
