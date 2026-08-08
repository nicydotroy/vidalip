import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import {
  CITIES,
  browseHref,
  type Category,
  type City,
} from "@/lib/locations";

function chipClass(active: boolean) {
  return active
    ? "btn bg-brand-500 text-white"
    : "btn border border-ink-700 text-ink-300 hover:bg-ink-800";
}

/**
 * Category filter chips. Every link is a real path (/models,
 * /models-mumbai) rather than a query string, so each combination is its own
 * indexable page.
 */
export function CategoryLinks({
  activeCategory,
  city,
}: {
  activeCategory: Category | null;
  city: City | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={browseHref({ category: null, city })}
        className={chipClass(!activeCategory)}
      >
        All
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={browseHref({ category, city })}
          className={chipClass(activeCategory === category)}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}

/**
 * City chips with the number of approved listings in each. Counts come from
 * the caller so the page can fetch them in one batch.
 */
export function CityLinks({
  activeCity,
  category,
  counts,
}: {
  activeCity: City | null;
  category: Category | null;
  counts: Record<City, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={browseHref({ category, city: null })}
        className={chipClass(!activeCity)}
      >
        All cities
      </Link>
      {CITIES.map((city) => (
        <Link
          key={city}
          href={browseHref({ category, city })}
          className={chipClass(activeCity === city)}
        >
          {city}
          <span
            className={
              activeCity === city
                ? "text-xs text-white/70"
                : "text-xs text-ink-400"
            }
          >
            {counts[city]}
          </span>
        </Link>
      ))}
    </div>
  );
}
