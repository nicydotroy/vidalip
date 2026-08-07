import { z } from "zod";
import { CATEGORIES, CURRENCIES, RATE_UNITS } from "./constants";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Minutes since midnight, for comparing "HH:MM" strings. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password is too long"),
});

export const availabilitySlotSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(TIME_RE, "Use 24-hour HH:MM"),
    endTime: z.string().regex(TIME_RE, "Use 24-hour HH:MM"),
  })
  .refine((slot) => toMinutes(slot.endTime) > toMinutes(slot.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

/**
 * Images must come from /api/upload — either a local path (dev) or a Vercel
 * Blob URL (production). Rejecting anything else keeps `javascript:`/`data:`
 * URLs out of src attributes, and keeps next/image restricted to hosts that
 * are actually in the remotePatterns allowlist.
 */
const LOCAL_UPLOAD_RE = /^\/uploads\/[A-Za-z0-9._-]+$/;
const BLOB_URL_RE =
  /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[A-Za-z0-9._\-/]+$/;

export function isStoredImage(value: string): boolean {
  return LOCAL_UPLOAD_RE.test(value) || BLOB_URL_RE.test(value);
}

const imagePath = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => v === undefined || isStoredImage(v), {
    message: "Upload the image instead of pasting a link",
  });

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => v === undefined || /^https?:\/\/\S+$/.test(v), {
    message: "Enter a full URL starting with http:// or https://",
  });

export const listingSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  category: z.enum(CATEGORIES, { message: "Choose a category" }),
  location: z.string().trim().min(2, "Location is required").max(120),
  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters")
    .max(5000),

  rateAmount: z.coerce
    .number({ message: "Enter a valid rate" })
    .positive("Rate must be greater than 0")
    .max(10_000_000),
  rateCurrency: z.enum(CURRENCIES),
  rateUnit: z.enum(RATE_UNITS),

  contactEmail: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Enter a valid contact email",
    }),
  phone: optionalText(40),
  website: optionalUrl,

  // SEO — meta title/description fall back to the listing title/description
  // at render time when left blank.
  metaTitle: optionalText(70),
  metaDescription: optionalText(200),
  metaImage: imagePath,

  coverImage: imagePath,
  galleryImages: z
    .array(z.string().refine(isStoredImage, "Invalid image"))
    .max(12)
    .default([]),
  availability: z.array(availabilitySlotSchema).max(21).default([]),
});

export type ListingInput = z.infer<typeof listingSchema>;

export const rejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Give the user a reason of at least 5 characters")
    .max(500),
});
