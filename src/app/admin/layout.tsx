import Link from "next/link";
import { requireModerator } from "@/lib/session";
import { isSuperAdmin } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative check: middleware already gated /admin off the JWT, but the
  // token can be stale, so the real decision is made here against the database.
  const user = await requireModerator();

  const pending = await prisma.listing.count({ where: { status: "PENDING" } });

  const tabs = [
    { href: "/admin", label: "Moderation queue", badge: pending },
    { href: "/admin/listings", label: "All listings" },
    ...(isSuperAdmin(user.role)
      ? [{ href: "/admin/users", label: "Users" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="mt-1 text-sm text-ink-400">
            Signed in as {user.name} ·{" "}
            {isSuperAdmin(user.role) ? "Main admin" : "Admin"}
          </p>
        </div>
      </div>

      <nav className="mt-6 flex flex-wrap gap-1 border-b border-ink-800 pb-px">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-ink-850 hover:text-ink-100"
          >
            {tab.label}
            {tab.badge ? (
              <span className="badge bg-amber-500/20 text-amber-300">
                {tab.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
