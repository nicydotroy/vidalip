"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";

export type AuthFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { fieldErrors: { email: "An account with this email already exists" } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Everyone signs up as a plain user. Roles are granted only by the main
  // admin from /admin/users — never from a public form.
  await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
  });

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter both your email and password" };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      const message = (err.cause as { err?: Error } | undefined)?.err?.message;
      if (message === "ACCOUNT_SUSPENDED") {
        return { error: "This account has been suspended. Contact the site admin." };
      }
      return { error: "Incorrect email or password" };
    }
    throw err;
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
