import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "./prisma";
import { canModerate, isSuperAdmin } from "./constants";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

/**
 * The authoritative identity check. The JWT carries a role claim that can go
 * stale (a promotion or a suspension lands while a session is open), so every
 * protected page and server action re-reads the user from the database instead
 * of trusting the token.
 */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  if (!user || user.status === "SUSPENDED") return null;
  return user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

/** Admin or main admin — may approve and reject listings. */
export async function requireModerator(): Promise<SessionUser> {
  const user = await requireUser();
  if (!canModerate(user.role)) redirect("/dashboard");
  return user;
}

/** Main admin only — may change roles and suspend accounts. */
export async function requireSuperAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (!isSuperAdmin(user.role)) redirect("/admin");
  return user;
}
