"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  approveListingAction,
  rejectListingAction,
  type AdminActionState,
} from "@/app/admin/actions";
import { DAY_SHORT, formatRate } from "@/lib/constants";
import StatusBadge from "./StatusBadge";

export type ModerationListing = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  coverImage: string | null;
  rateAmount: number;
  rateCurrency: string;
  rateUnit: string;
  status: string;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
  images: string[];
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
};

function PendingButton({
  className,
  idle,
  busy,
}: {
  className: string;
  idle: string;
  busy: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? busy : idle}
    </button>
  );
}

export default function ModerationCard({
  listing,
}: {
  listing: ModerationListing;
}) {
  const [showReject, setShowReject] = useState(false);

  const [approveState, approve] = useActionState<AdminActionState, FormData>(
    approveListingAction,
    {},
  );
  const [rejectState, reject] = useActionState<AdminActionState, FormData>(
    rejectListingAction,
    {},
  );

  const message = approveState.ok ?? rejectState.ok;
  const error = approveState.error ?? rejectState.error;

  return (
    <li className="card overflow-hidden">
      <div className="flex flex-wrap gap-5 p-5">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg bg-ink-850 sm:w-52">
          {listing.coverImage ? (
            <Image
              src={listing.coverImage}
              alt=""
              fill
              sizes="208px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-ink-600">
              No cover photo
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{listing.title}</h2>
            <StatusBadge status={listing.status} />
          </div>

          <p className="mt-1 text-sm text-ink-400">
            {listing.category} · {listing.location} ·{" "}
            <span className="font-medium text-ink-300">
              {formatRate(
                listing.rateAmount,
                listing.rateCurrency,
                listing.rateUnit,
              )}
            </span>
          </p>

          <p className="mt-1 text-xs text-ink-600">
            by {listing.ownerName} ({listing.ownerEmail}) · submitted{" "}
            {listing.createdAt}
          </p>

          <p className="mt-3 line-clamp-3 text-sm text-ink-300">
            {listing.description}
          </p>

          {listing.availability.length > 0 && (
            <p className="mt-3 flex flex-wrap gap-1.5 text-xs">
              {listing.availability.map((slot, i) => (
                <span
                  key={i}
                  className="rounded bg-ink-800 px-2 py-1 text-ink-300"
                >
                  {DAY_SHORT[slot.dayOfWeek]} {slot.startTime}–{slot.endTime}
                </span>
              ))}
            </p>
          )}

          {listing.images.length > 0 && (
            <div className="mt-3 flex gap-2">
              {listing.images.slice(0, 6).map((url, i) => (
                <div
                  key={`${url}-${i}`}
                  className="relative h-14 w-14 overflow-hidden rounded border border-ink-700"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ))}
              {listing.images.length > 6 && (
                <div className="grid h-14 w-14 place-items-center rounded border border-ink-700 text-xs text-ink-400">
                  +{listing.images.length - 6}
                </div>
              )}
            </div>
          )}

          {(listing.metaTitle || listing.metaDescription) && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-ink-400 hover:text-ink-100">
                SEO metadata
              </summary>
              <div className="mt-2 rounded-lg border border-ink-700 bg-ink-850 p-3">
                <p className="text-brand-400">{listing.metaTitle || "—"}</p>
                <p className="mt-1 text-ink-300">
                  {listing.metaDescription || "—"}
                </p>
              </div>
            </details>
          )}
        </div>
      </div>

      {(message || error) && (
        <p
          role="status"
          className={`px-5 pb-3 text-sm ${error ? "text-red-300" : "text-emerald-300"}`}
        >
          {error ?? message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-ink-800 bg-ink-850/50 px-5 py-3">
        <form action={approve}>
          <input type="hidden" name="listingId" value={listing.id} />
          <PendingButton
            className="btn-success"
            idle="✓ Approve"
            busy="Approving…"
          />
        </form>

        <button
          type="button"
          className="btn-danger"
          onClick={() => setShowReject((v) => !v)}
        >
          ✕ Reject
        </button>

        <Link href={`/listing/${listing.slug}`} className="btn-ghost">
          Preview
        </Link>
      </div>

      {showReject && (
        <form action={reject} className="border-t border-ink-800 px-5 py-4">
          <input type="hidden" name="listingId" value={listing.id} />
          <label className="label" htmlFor={`reason-${listing.id}`}>
            Why are you rejecting this? The owner will see it.
          </label>
          <textarea
            id={`reason-${listing.id}`}
            name="reason"
            rows={2}
            required
            minLength={5}
            className="input resize-y"
            placeholder="e.g. The cover photo is low resolution and the rate is missing a currency."
          />
          <div className="mt-3 flex gap-2">
            <PendingButton
              className="btn-danger"
              idle="Confirm rejection"
              busy="Rejecting…"
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowReject(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
