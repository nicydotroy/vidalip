import type { NextAuthConfig } from "next-auth";
import { canModerate } from "@/lib/constants";

/**
 * Edge-safe half of the auth setup: no Prisma, no bcrypt.
 * `middleware.ts` builds a NextAuth instance from this alone, so everything
 * here must run on the Edge runtime. The Credentials provider (which needs
 * the database) is added in `src/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    // Copy identity onto the token at sign-in; later calls just pass it through.
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.status = user.status ?? "ACTIVE";
      }
      // Lets a server action refresh the claim after a role change without
      // forcing the user to sign out.
      if (trigger === "update" && session?.role) {
        token.role = session.role as string;
      }
      return token;
    },

    session({ session, token }) {
      // JWT claims are loosely typed, so read them defensively rather than
      // leaning on module augmentation to line the types up.
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        session.user.role = typeof token.role === "string" ? token.role : "USER";
        session.user.status =
          typeof token.status === "string" ? token.status : "ACTIVE";
      }
      return session;
    },

    /**
     * Coarse gate for whole route trees. This reads the role from the JWT,
     * which can be stale, so it is a first line of defence only — every page
     * and server action re-checks against the database via src/lib/session.ts.
     */
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        if (!user) return false;
        // Signed in but not a moderator: send them somewhere useful rather
        // than bouncing them to the login page.
        if (!canModerate(user.role)) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (path.startsWith("/dashboard")) return !!user;

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
