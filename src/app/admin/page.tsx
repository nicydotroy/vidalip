import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireModerator } from "@/lib/session";
import ModerationCard, {
  type ModerationListing,
} from "@/components/ModerationCard";

export const metadata: Metadata = { title: "Moderation queue" };

export default async function AdminQueuePage() {
  await requireModerator();

  const listings = await prisma.listing.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      owner: { select: { name: true, email: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { url: true } },
      availability: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        select: { dayOfWeek: true, startTime: true, endTime: true },
      },
    },
  });

  if (listings.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-lg font-semibold">The queue is empty</p>
        <p className="mt-1 text-sm text-ink-400">
          Every submitted listing has been reviewed.
        </p>
      </div>
    );
  }

  const cards: ModerationListing[] = listings.map((l) => ({
    id: l.id,
    slug: l.slug,
    title: l.title,
    category: l.category,
    location: l.location,
    description: l.description,
    coverImage: l.coverImage,
    rateAmount: l.rateAmount,
    rateCurrency: l.rateCurrency,
    rateUnit: l.rateUnit,
    status: l.status,
    metaTitle: l.metaTitle,
    metaDescription: l.metaDescription,
    createdAt: l.createdAt.toLocaleDateString(),
    ownerName: l.owner.name,
    ownerEmail: l.owner.email,
    images: l.images.map((i) => i.url),
    availability: l.availability,
  }));

  return (
    <>
      <p className="mb-4 text-sm text-ink-400">
        {cards.length} listing{cards.length === 1 ? "" : "s"} waiting for review,
        oldest first.
      </p>
      <ul className="space-y-4">
        {cards.map((listing) => (
          <ModerationCard key={listing.id} listing={listing} />
        ))}
      </ul>
    </>
  );
}
