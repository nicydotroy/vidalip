"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { listingSchema } from "@/lib/validation";
import { uniqueSlug } from "@/lib/slug";

export type ListingFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  if (typeof value !== "string" || value === "") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function collectFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

/**
 * Creates a listing, or updates one the signed-in user owns.
 *
 * Editing an already-approved listing sends it back to PENDING: otherwise a
 * user could get an innocuous listing approved and then swap in different
 * content behind the moderators' backs.
 */
export async function saveListingAction(
  _prev: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const user = await requireUser();
  const listingId = String(formData.get("listingId") ?? "").trim();

  const parsed = listingSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    location: formData.get("location"),
    description: formData.get("description"),
    rateAmount: formData.get("rateAmount"),
    rateCurrency: formData.get("rateCurrency"),
    rateUnit: formData.get("rateUnit"),
    contactEmail: formData.get("contactEmail"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaImage: formData.get("metaImage"),
    coverImage: formData.get("coverImage"),
    galleryImages: parseJsonArray(formData.get("galleryImages")),
    availability: parseJsonArray(formData.get("availability")),
  });

  if (!parsed.success) {
    return { fieldErrors: collectFieldErrors(parsed.error.issues) };
  }

  const data = parsed.data;
  const { galleryImages, availability, ...fields } = data;

  if (listingId) {
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, userId: true, slug: true, title: true },
    });

    if (!existing || existing.userId !== user.id) {
      return { error: "That listing does not exist, or is not yours to edit." };
    }

    const slug =
      existing.title === fields.title
        ? existing.slug
        : await uniqueSlug(fields.title, existing.id);

    await prisma.$transaction([
      prisma.listingImage.deleteMany({ where: { listingId: existing.id } }),
      prisma.availability.deleteMany({ where: { listingId: existing.id } }),
      prisma.listing.update({
        where: { id: existing.id },
        data: {
          ...fields,
          slug,
          status: "PENDING",
          rejectionReason: null,
          reviewedAt: null,
          reviewedById: null,
          images: {
            create: galleryImages.map((url, i) => ({ url, sortOrder: i })),
          },
          availability: { create: availability },
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath(`/listing/${slug}`);
  } else {
    const slug = await uniqueSlug(fields.title);

    await prisma.listing.create({
      data: {
        ...fields,
        slug,
        userId: user.id,
        status: "PENDING",
        images: {
          create: galleryImages.map((url, i) => ({ url, sortOrder: i })),
        },
        availability: { create: availability },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
  }

  redirect("/dashboard?saved=1");
}

export async function deleteListingAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("listingId") ?? "");

  // Scoping the delete by userId means a forged id cannot touch someone
  // else's listing — it simply matches zero rows.
  await prisma.listing.deleteMany({ where: { id, userId: user.id } });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  revalidatePath("/");
}
