"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signupAction, type AuthFormState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useActionState<AuthFormState, FormData>(
    signupAction,
    {},
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <div>
        <label className="label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          className="input"
          placeholder="Alex Doe"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="input"
          placeholder="At least 8 characters"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
