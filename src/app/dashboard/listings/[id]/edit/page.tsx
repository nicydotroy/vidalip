import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import ListingForm from "@/components/ListingForm";
import StatusBadge from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      availability: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
    },
  });

  // Same 404 for "does not exist" and "not yours" — no existence oracle.
  if (!listing || listing.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Edit listing</h1>
        <StatusBadge status={listing.status} />
      </div>

      {listing.status === "REJECTED" && listing.rejectionReason && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <strong>Admin feedback:</strong> {listing.rejectionReason}
        </p>
      )}

      <div className="mt-8">
        <ListingForm
          isEdit
          initial={{
            id: listing.id,
            title: listing.title,
            category: listing.category,
            location: listing.location,
            description: listing.description,
            rateAmount: String(listing.rateAmount),
            rateCurrency: listing.rateCurrency,
            rateUnit: listing.rateUnit,
            contactEmail: listing.contactEmail ?? "",
            phone: listing.phone ?? "",
            website: listing.website ?? "",
            metaTitle: listing.metaTitle ?? "",
            metaDescription: listing.metaDescription ?? "",
            metaImage: listing.metaImage ?? "",
            coverImage: listing.coverImage ?? "",
            galleryImages: listing.images.map((img) => img.url),
            availability: listing.availability.map((slot) => ({
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
            })),
          }}
        />
      </div>
    </div>
  );
}
