"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { changePasswordSchema } from "@/lib/validation";

export type AccountFormState = {
  error?: string;
  ok?: string;
  fieldErrors?: Record<string, string>;
};

export async function changePasswordAction(
  _prev: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const user = await requireUser();

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { fieldErrors };
  }

  const { currentPassword, newPassword } = parsed.data;

  // Re-read the hash rather than trusting anything from the session.
  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!record) return { error: "Your account could not be found." };

  const ok = await bcrypt.compare(currentPassword, record.passwordHash);
  if (!ok) {
    return { fieldErrors: { currentPassword: "That is not your current password" } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 12) },
  });

  return { ok: "Password changed. Use it the next time you sign in." };
}
