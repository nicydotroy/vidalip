import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage() {
  if (await currentUser()) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-ink-400">
        Post a listing in minutes. An admin reviews it before it goes live.
      </p>

      <div className="card mt-6 p-6">
        <SignupForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
