import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database / bcrypt here).
 * Used by middleware and spread into the full config in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days — how long a login stays valid
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const onAdmin = nextUrl.pathname.startsWith("/admin");
      if (onAdmin) return isLoggedIn; // redirect to /login when not authed
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role ?? "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "ADMIN";
      }
      return session;
    },
  },
  providers: [], // real providers live in auth.ts (Node runtime)
} satisfies NextAuthConfig;
