import type { MetadataRoute } from "next";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { SITE_URL } from "@/lib/site";

const APP_DIR = path.join(process.cwd(), "src", "app");

/** Relative importance hints for search engines; anything not listed gets 0.6. */
const PRIORITY: Record<string, number> = {
  "/": 1,
  "/product": 0.9,
  "/solution": 0.9,
  "/preorder": 0.9,
  "/how-it-works": 0.8,
  "/platform": 0.8,
  "/about": 0.8,
  "/problem": 0.7,
  "/faq": 0.7,
  "/user-manual": 0.7,
  "/privacy-policy": 0.3,
  "/terms-of-service": 0.3,
  "/cookie-policy": 0.3,
};

/** Every folder under src/app containing a page.tsx is a public route. */
function findRoutes(dir: string, route = ""): { route: string; file: string }[] {
  const found: { route: string; file: string }[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip private folders, route groups' parentheses and dynamic segments.
      if (entry.name.startsWith("_") || entry.name.startsWith("[")) continue;
      const segment = entry.name.startsWith("(") ? "" : `/${entry.name}`;
      found.push(...findRoutes(full, route + segment));
    } else if (entry.name === "page.tsx") {
      found.push({ route: route || "/", file: full });
    }
  }
  return found;
}

// Generated once at build time, so new pages are picked up automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  return findRoutes(APP_DIR)
    .map(({ route, file }) => ({
      url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
      lastModified: statSync(file).mtime,
      changeFrequency: (PRIORITY[route] ?? 0.6) <= 0.3 ? "yearly" as const : "monthly" as const,
      priority: PRIORITY[route] ?? 0.6,
    }))
    .sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url));
}
