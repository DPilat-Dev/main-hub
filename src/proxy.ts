import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge proxy (Next 16): enforces the `authorized` callback for /admin routes.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
