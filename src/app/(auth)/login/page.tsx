import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-400">
        Log in to manage your listings.
      </p>

      <div className="card mt-6 p-6">
        <LoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-brand-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
