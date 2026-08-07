import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/session";
import UserRow, { type AdminUser } from "@/components/UserRow";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  // Main admin only. A plain ADMIN who guesses this URL is redirected
  // back to /admin by requireSuperAdmin.
  const admin = await requireSuperAdmin();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { listings: true } } },
  });

  const rows: AdminUser[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    listingCount: u._count.listings,
    joined: u.createdAt.toLocaleDateString(),
  }));

  return (
    <>
      <p className="mb-4 text-sm text-ink-400">
        Only the main admin can grant roles or suspend accounts. Suspending an
        account also pulls that person&apos;s live listings off the site.
      </p>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-800 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Account</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <UserRow key={user.id} user={user} isSelf={user.id === admin.id} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
