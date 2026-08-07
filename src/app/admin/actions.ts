"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireSuperAdmin } from "@/lib/session";
import { ROLES, USER_STATUSES } from "@/lib/constants";
import { rejectSchema } from "@/lib/validation";

export type AdminActionState = { error?: string; ok?: string };

function refreshModerationViews(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  revalidatePath("/dashboard");
  revalidatePath("/");
  if (slug) revalidatePath(`/listing/${slug}`);
}

/* ------------------------------------------------------------------ *
 * Listing moderation — admins and the main admin
 * ------------------------------------------------------------------ */

export async function approveListingAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const moderator = await requireModerator();
  const id = String(formData.get("listingId") ?? "");

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!listing) return { error: "That listing no longer exists." };

  await prisma.listing.update({
    where: { id },
    data: {
      status: "APPROVED",
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedById: moderator.id,
    },
  });

  refreshModerationViews(listing.slug);
  return { ok: "Listing approved and published." };
}

export async function rejectListingAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const moderator = await requireModerator();
  const id = String(formData.get("listingId") ?? "");

  const parsed = rejectSchema.safeParse({ reason: formData.get("reason") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a reason." };
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!listing) return { error: "That listing no longer exists." };

  await prisma.listing.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: parsed.data.reason,
      reviewedAt: new Date(),
      reviewedById: moderator.id,
    },
  });

  refreshModerationViews(listing.slug);
  return { ok: "Listing rejected and the owner has been given your reason." };
}

/** Pull a live listing back into the queue. */
export async function unpublishListingAction(formData: FormData) {
  const moderator = await requireModerator();
  const id = String(formData.get("listingId") ?? "");

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!listing) return;

  await prisma.listing.update({
    where: { id },
    data: {
      status: "PENDING",
      reviewedAt: new Date(),
      reviewedById: moderator.id,
    },
  });

  refreshModerationViews(listing.slug);
}

/* ------------------------------------------------------------------ *
 * User management — main admin only
 * ------------------------------------------------------------------ */

export async function setUserRoleAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return { error: "Unknown role." };
  }

  // Guard rails against locking the site's own admins out.
  if (userId === admin.id) {
    return { error: "You cannot change your own role." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return { error: "That user no longer exists." };

  if (target.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const remaining = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE", id: { not: userId } },
    });
    if (remaining === 0) {
      return { error: "There must always be at least one main admin." };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });

  revalidatePath("/admin/users");
  return { ok: "Role updated." };
}

export async function setUserStatusAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!USER_STATUSES.includes(status as (typeof USER_STATUSES)[number])) {
    return { error: "Unknown status." };
  }

  if (userId === admin.id) {
    return { error: "You cannot suspend your own account." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!target) return { error: "That user no longer exists." };

  if (target.role === "SUPER_ADMIN" && status === "SUSPENDED") {
    const remaining = await prisma.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE", id: { not: userId } },
    });
    if (remaining === 0) {
      return { error: "There must always be at least one active main admin." };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { status } });

  // A suspended owner's listings should not stay public.
  if (status === "SUSPENDED") {
    await prisma.listing.updateMany({
      where: { userId, status: "APPROVED" },
      data: { status: "PENDING" },
    });
  }

  revalidatePath("/admin/users");
  revalidatePath("/");
  return { ok: status === "SUSPENDED" ? "Account suspended." : "Account restored." };
}
