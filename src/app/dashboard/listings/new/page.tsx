import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import ListingForm, { emptyListing } from "@/components/ListingForm";

export const metadata: Metadata = { title: "New listing" };

export default async function NewListingPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Create a listing</h1>
      <p className="mt-1 text-sm text-ink-400">
        Fill in your details, set your rate and availability, then submit for
        review.
      </p>

      <div className="mt-8">
        <ListingForm initial={emptyListing} />
      </div>
    </div>
  );
}
