import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/session";
import { LISTING_STATUSES, formatRate } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { unpublishListingAction } from "../actions";

export const metadata: Metadata = { title: "All listings" };

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireModerator();

  const { status } = await searchParams;
  const active = LISTING_STATUSES.find((s) => s === status);

  const listings = await prisma.listing.findMany({
    where: active ? { status: active } : undefined,
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: {
      owner: { select: { name: true, email: true } },
      reviewedBy: { select: { name: true } },
    },
  });

  const filters = [
    { label: "All", href: "/admin/listings", on: !active },
    ...LISTING_STATUSES.map((s) => ({
      label: s.charAt(0) + s.slice(1).toLowerCase(),
      href: `/admin/listings?status=${s}`,
      on: active === s,
    })),
  ];

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={
              f.on
                ? "btn bg-brand-500 text-white"
                : "btn border border-ink-700 text-ink-300 hover:bg-ink-800"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center text-ink-400">
          No listings match this filter.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink-800 text-xs uppercase tracking-wide text-ink-400">
              <tr>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reviewed by</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l.id} className="border-b border-ink-800/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{l.title}</div>
                    <div className="text-xs text-ink-400">
                      {l.category} · {l.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{l.owner.name}</div>
                    <div className="text-xs text-ink-400">{l.owner.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatRate(l.rateAmount, l.rateCurrency, l.rateUnit)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-400">
                    {l.reviewedBy?.name ?? "—"}
                    {l.reviewedAt && (
                      <div>{l.reviewedAt.toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {l.status === "APPROVED" && (
                        <>
                          <Link
                            href={`/listing/${l.slug}`}
                            className="btn-ghost px-3 py-1.5"
                          >
                            View
                          </Link>
                          <form action={unpublishListingAction}>
                            <input
                              type="hidden"
                              name="listingId"
                              value={l.id}
                            />
                            <button
                              type="submit"
                              className="btn-danger px-3 py-1.5"
                            >
                              Unpublish
                            </button>
                          </form>
                        </>
                      )}
                      {l.status !== "APPROVED" && (
                        <Link href="/admin" className="btn-ghost px-3 py-1.5">
                          Review
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
