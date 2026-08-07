import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next 16 renamed the `middleware` file convention to `proxy`, and it needs a
// real function export (a destructured `export const` is not detected).
// Built from the edge-safe config only — see src/auth.config.ts.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
