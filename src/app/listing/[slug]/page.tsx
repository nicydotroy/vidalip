import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/session";
import { canModerate, DAY_NAMES, formatRate } from "@/lib/constants";

async function getListing(slug: string) {
  return prisma.listing.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true } },
      images: { orderBy: { sortOrder: "asc" } },
      availability: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) return { title: "Listing not found" };

  // Unapproved listings are reachable only as a private preview, so keep them
  // out of search engines and social cards entirely.
  if (listing.status !== "APPROVED") {
    return { title: "Listing preview", robots: { index: false, follow: false } };
  }

  const title = listing.metaTitle || listing.title;
  const description =
    listing.metaDescription || listing.description.slice(0, 155);
  const image = listing.metaImage || listing.coverImage || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/listing/${listing.slug}` },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/listing/${listing.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) notFound();

  // Public visitors only ever see approved listings. The owner and any
  // moderator can open the same URL to preview one that is still in review.
  if (listing.status !== "APPROVED") {
    const viewer = await currentUser();
    const mayPreview =
      viewer && (viewer.id === listing.owner.id || canModerate(viewer.role));
    if (!mayPreview) notFound();
  }

  const byDay = DAY_NAMES.map((day, index) => ({
    day,
    slots: listing.availability.filter((s) => s.dayOfWeek === index),
  }));

  const hasHours = listing.availability.length > 0;

  // Structured data helps the listing surface properly in search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: listing.title,
    description: listing.description.slice(0, 500),
    areaServed: listing.location,
    category: listing.category,
    provider: { "@type": "Person", name: listing.owner.name },
    offers: {
      "@type": "Offer",
      price: listing.rateAmount,
      priceCurrency: listing.rateCurrency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {listing.status !== "APPROVED" && (
        <p className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <strong>Preview.</strong> This listing is {listing.status.toLowerCase()}{" "}
          and is not visible to the public yet.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-ink-800 bg-ink-850">
            {listing.coverImage ? (
              <Image
                src={listing.coverImage}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-ink-600">
                No cover photo
              </div>
            )}
          </div>

          {listing.images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {listing.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-ink-800"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? listing.title}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            {listing.title}
          </h1>
          <p className="mt-2 text-ink-400">
            {listing.category} · {listing.location}
          </p>

          <div className="mt-6 whitespace-pre-line leading-relaxed text-ink-300">
            {listing.description}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <p className="text-sm text-ink-400">Rate</p>
            <p className="mt-1 text-2xl font-bold text-brand-400">
              {formatRate(
                listing.rateAmount,
                listing.rateCurrency,
                listing.rateUnit,
              )}
            </p>

            <hr className="my-4 border-ink-800" />

            <p className="text-sm font-semibold">Availability</p>
            {hasHours ? (
              <ul className="mt-2 space-y-1.5 text-sm">
                {byDay.map(({ day, slots }) => (
                  <li key={day} className="flex justify-between gap-3">
                    <span className="text-ink-400">{day}</span>
                    <span className="text-right">
                      {slots.length === 0 ? (
                        <span className="text-ink-600">—</span>
                      ) : (
                        slots.map((s, i) => (
                          <span key={s.id} className="block">
                            {s.startTime}–{s.endTime}
                            {i < slots.length - 1 ? "" : ""}
                          </span>
                        ))
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-400">
                Contact for availability.
              </p>
            )}
          </div>

          <div className="card p-5">
            <p className="text-sm font-semibold">Get in touch</p>
            <p className="mt-1 text-sm text-ink-400">
              Listed by {listing.owner.name}
            </p>

            <div className="mt-4 space-y-2">
              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}`}
                  className="btn-primary w-full"
                >
                  Email
                </a>
              )}
              {listing.phone && (
                <a href={`tel:${listing.phone}`} className="btn-ghost w-full">
                  {listing.phone}
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn-ghost w-full"
                >
                  Website
                </a>
              )}
              {!listing.contactEmail && !listing.phone && !listing.website && (
                <p className="text-sm text-ink-400">
                  No contact details provided.
                </p>
              )}
            </div>
          </div>

          <Link href="/" className="btn-ghost w-full">
            ← Back to all listings
          </Link>
        </aside>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
