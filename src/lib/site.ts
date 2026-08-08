/**
 * Company and contact details used across the legal, support and security
 * pages. Everything in SQUARE BRACKETS is a placeholder — fill these in once
 * here and every page picks it up.
 *
 * The grievance officer fields are not optional decoration: India's IT
 * (Intermediary Guidelines) Rules 2021 require a platform that hosts
 * user-submitted content to publish an officer's name and contact details.
 */
export const SITE = {
  name: "Vidalip",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vidalip.vercel.app",

  /**
   * Entity that operates the site. If you are registered under a fuller formal
   * name (e.g. "Vidalip Private Limited"), put that exact name here — the
   * legal pages cite it as the contracting party.
   */
  legalEntity: "Vidalip",
  address: "[REGISTERED OFFICE ADDRESS, CITY, STATE, PIN]",
  country: "India",

  email: {
    support: "[support@yourdomain.com]",
    privacy: "[privacy@yourdomain.com]",
    abuse: "[report@yourdomain.com]",
    advertising: "[advertise@yourdomain.com]",
  },

  /** Required under the IT Rules 2021. Must be a real, reachable person. */
  grievanceOfficer: {
    name: "[GRIEVANCE OFFICER NAME]",
    email: "[grievance@yourdomain.com]",
    phone: "[+91 XXXXX XXXXX]",
  },

  /** Bump when you change any policy text. */
  lastUpdated: "8 August 2026",
} as const;

/** Minimum age to register, post a listing, or contact an advertiser. */
export const MIN_AGE = 18;
