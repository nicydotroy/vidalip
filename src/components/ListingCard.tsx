import Image from "next/image";
import Link from "next/link";
import { formatRate } from "@/lib/constants";

export default function ListingCard({
  listing,
}: {
  listing: {
    slug: string;
    title: string;
    category: string;
    location: string;
    coverImage: string | null;
    rateAmount: number;
    rateCurrency: string;
    rateUnit: string;
  };
}) {
  return (
    <Link
      href={`/listing/${listing.slug}`}
      className="card group overflow-hidden transition hover:border-brand-500/60"
    >
      <div className="relative aspect-4/3 bg-ink-850">
        {listing.coverImage ? (
          <Image
            src={listing.coverImage}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-ink-600">
            No photo
          </div>
        )}
        <span className="absolute left-3 top-3 badge bg-ink-950/80 text-ink-100 backdrop-blur">
          {listing.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="truncate font-semibold">{listing.title}</h3>
        <p className="mt-1 text-sm text-ink-400">{listing.location}</p>
        <p className="mt-2 font-semibold text-brand-400">
          {formatRate(listing.rateAmount, listing.rateCurrency, listing.rateUnit)}
        </p>
      </div>
    </Link>
  );
}
