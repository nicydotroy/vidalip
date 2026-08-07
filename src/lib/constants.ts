export const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const LISTING_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const RATE_UNITS = ["HOUR", "DAY", "SESSION", "PROJECT"] as const;
export type RateUnit = (typeof RATE_UNITS)[number];

export const RATE_UNIT_LABEL: Record<RateUnit, string> = {
  HOUR: "per hour",
  DAY: "per day",
  SESSION: "per session",
  PROJECT: "per project",
};

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "AED"] as const;

export const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  AED: "AED ",
};

export const CATEGORIES = [
  "Fashion Model",
  "Commercial Model",
  "Runway Model",
  "Fitness Model",
  "Photographer",
  "Makeup Artist",
  "Stylist",
  "Other",
] as const;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Admins and the main admin can both moderate listings. */
export function canModerate(role: string | undefined | null): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Only the main admin can grant/revoke roles or suspend accounts. */
export function isSuperAdmin(role: string | undefined | null): boolean {
  return role === "SUPER_ADMIN";
}

export function formatRate(
  amount: number,
  currency: string,
  unit: string,
): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  const value = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  const label = RATE_UNIT_LABEL[unit as RateUnit] ?? unit.toLowerCase();
  return `${symbol}${value} ${label}`;
}
