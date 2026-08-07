import Link from "next/link";
import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Account" };

const ROLE_LABEL: Record<string, string> = {
  USER: "Member",
  ADMIN: "Admin",
  SUPER_ADMIN: "Main admin",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-ink-400">
        {user.name} · {user.email} · {ROLE_LABEL[user.role] ?? user.role}
      </p>

      <div className="card mt-8 p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-ink-400">
          Do this as soon as you sign in for the first time.
        </p>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </div>

      <Link href="/dashboard" className="btn-ghost mt-6">
        ← Back to my listings
      </Link>
    </div>
  );
}
