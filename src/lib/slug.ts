import { prisma } from "./prisma";

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "listing";
}

/**
 * Returns a slug that is not taken by any other listing.
 * `excludeId` lets an existing listing keep its own slug while editing.
 */
export async function uniqueSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(title);
  let candidate = base;

  for (let n = 2; ; n++) {
    const clash = await prisma.listing.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash || clash.id === excludeId) return candidate;
    candidate = `${base}-${n}`;
  }
}
