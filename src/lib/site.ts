/**
 * Canonical site address (no trailing slash). Used for the sitemap,
 * robots.txt and social share previews. Override per environment with
 * NEXT_PUBLIC_SITE_URL if the domain changes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.medivolk.com"
).replace(/\/$/, "");

/** Public contact details shown across the site. */
export const CONTACT_EMAIL = "medivo.online@gmail.com";
export const INSTAGRAM_URL = "https://www.instagram.com/medivo.official";
export const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61594044025516";
export const TIKTOK_URL = "https://www.tiktok.com/@medivo.official";

/** Downloadable user manual (lives in /public/downloads). */
export const USER_MANUAL_URL = "/downloads/medivo-user-manual.pdf";
export const USER_MANUAL_FILENAME = "Medivo User Manual.pdf";

/** Policy pages, linked from the footer and from each other. */
export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];
