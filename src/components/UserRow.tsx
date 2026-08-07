"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  setUserRoleAction,
  setUserStatusAction,
  type AdminActionState,
} from "@/app/admin/actions";
import { ROLES } from "@/lib/constants";
import StatusBadge from "./StatusBadge";

const ROLE_LABEL: Record<string, string> = {
  USER: "Member",
  ADMIN: "Admin",
  SUPER_ADMIN: "Main admin",
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  listingCount: number;
  joined: string;
};

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-ghost px-3 py-1.5" disabled={pending}>
      {pending ? "…" : label}
    </button>
  );
}

export default function UserRow({
  user,
  isSelf,
}: {
  user: AdminUser;
  isSelf: boolean;
}) {
  const [roleState, setRole] = useActionState<AdminActionState, FormData>(
    setUserRoleAction,
    {},
  );
  const [statusState, setStatus] = useActionState<AdminActionState, FormData>(
    setUserStatusAction,
    {},
  );

  const error = roleState.error ?? statusState.error;
  const ok = roleState.ok ?? statusState.ok;
  const suspended = user.status === "SUSPENDED";

  return (
    <tr className="border-b border-ink-800/60 last:border-0 align-top">
      <td className="px-4 py-3">
        <div className="font-medium">
          {user.name}
          {isSelf && <span className="ml-2 text-xs text-ink-400">(you)</span>}
        </div>
        <div className="text-xs text-ink-400">{user.email}</div>
        <div className="mt-1 text-xs text-ink-600">
          {user.listingCount} listing{user.listingCount === 1 ? "" : "s"} · joined{" "}
          {user.joined}
        </div>
        {(error || ok) && (
          <p
            role="status"
            className={`mt-2 text-xs ${error ? "text-red-300" : "text-emerald-300"}`}
          >
            {error ?? ok}
          </p>
        )}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={user.status} />
      </td>

      <td className="px-4 py-3">
        {isSelf ? (
          // The main admin cannot demote themselves — that is the one change
          // that could leave the site with no way back in.
          <span className="text-sm text-ink-400">{ROLE_LABEL[user.role]}</span>
        ) : (
          <form action={setRole} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <select
              name="role"
              defaultValue={user.role}
              className="input w-36 py-1.5"
              aria-label={`Role for ${user.name}`}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <SaveButton label="Save" />
          </form>
        )}
      </td>

      <td className="px-4 py-3">
        {isSelf ? (
          <span className="text-sm text-ink-400">—</span>
        ) : (
          <form action={setStatus}>
            <input type="hidden" name="userId" value={user.id} />
            <input
              type="hidden"
              name="status"
              value={suspended ? "ACTIVE" : "SUSPENDED"}
            />
            <button
              type="submit"
              className={suspended ? "btn-success px-3 py-1.5" : "btn-danger px-3 py-1.5"}
            >
              {suspended ? "Restore" : "Suspend"}
            </button>
          </form>
        )}
      </td>
    </tr>
  );
}
