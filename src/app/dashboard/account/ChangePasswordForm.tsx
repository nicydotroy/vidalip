"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePasswordAction, type AccountFormState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Change password"}
    </button>
  );
}

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState<AccountFormState, FormData>(
    changePasswordAction,
    {},
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      {state.ok && (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
        >
          {state.ok}
        </p>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <div>
        <label className="label" htmlFor="currentPassword">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className="input"
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="newPassword">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="input"
        />
        <p className="hint">At least 8 characters.</p>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="input"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
