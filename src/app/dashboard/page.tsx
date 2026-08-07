import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatRate } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { deleteListingAction } from "./actions";

export const metadata: Metadata = { title: "My listings" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const { saved } = await searchParams;

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { images: true, availability: true } } },
  });

  const counts = {
    live: listings.filter((l) => l.status === "APPROVED").length,
    pending: listings.filter((l) => l.status === "PENDING").length,
    rejected: listings.filter((l) => l.status === "REJECTED").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My listings</h1>
          <p className="mt-1 text-sm text-ink-400">
            Signed in as {user.email}
          </p>
        </div>
        <Link href="/dashboard/listings/new" className="btn-primary">
          New listing
        </Link>
      </div>

      {saved && (
        <p className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Saved. Your listing is in the moderation queue — an admin will review
          it shortly.
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Live", counts.live],
          ["Awaiting review", counts.pending],
          ["Rejected", counts.rejected],
        ].map(([label, n]) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-bold">{n}</p>
            <p className="text-xs text-ink-400">{label}</p>
          </div>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-lg font-semibold">No listings yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-400">
            Create your first listing with your rate, availability and photos.
            An admin approves it before it goes live.
          </p>
          <Link href="/dashboard/listings/new" className="btn-primary mt-5">
            Create a listing
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {listings.map((listing) => (
            <li key={listing.id} className="card p-4">
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-ink-850">
                  {listing.coverImage ? (
                    <Image
                      src={listing.coverImage}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-ink-600">
                      No photo
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{listing.title}</h2>
                    <StatusBadge status={listing.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-400">
                    {listing.category} · {listing.location} ·{" "}
                    {formatRate(
                      listing.rateAmount,
                      listing.rateCurrency,
                      listing.rateUnit,
                    )}
                  </p>
                  <p className="mt-1 text-xs text-ink-600">
                    {listing._count.images} gallery photos ·{" "}
                    {listing._count.availability} time slots · updated{" "}
                    {listing.updatedAt.toLocaleDateString()}
                  </p>

                  {listing.status === "REJECTED" && listing.rejectionReason && (
                    <p className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      <strong>Admin feedback:</strong> {listing.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {listing.status === "APPROVED" && (
                    <Link href={`/listing/${listing.slug}`} className="btn-ghost">
                      View
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/listings/${listing.id}/edit`}
                    className="btn-ghost"
                  >
                    Edit
                  </Link>
                  <form action={deleteListingAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button type="submit" className="btn-danger">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
