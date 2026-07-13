import type { Metadata } from "next";
import skillsEn from "@/content/data/skills.en.json";
import catalogCounts from "@/content/data/catalog_counts.snapshot.json";

// NOTE: dictionaries.ts carries `import "server-only"`, so importing the locale
// list from there would make this module transitively server-only and break any
// client component that imports SKILL_COUNT. Locale constants are defined locally
// to keep this helper client-safe (a plain JSON import is client-safe).
const LOCALES = ["en", "ko"] as const;
const DEFAULT_LOCALE = "en";

export const BASE = "https://aperivue.com";

/** Build canonical + hreflang alternates. `path` example: "/skills"; home is "". */
export function buildAlternates(lang: string, path: string): Metadata["alternates"] {
  return {
    canonical: `${BASE}/${lang}${path}`,
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}${path}`])),
      "x-default": `${BASE}/${DEFAULT_LOCALE}${path}`,
    },
  };
}

/** Locale-aware openGraph url. Always use this so og:url keeps the /{lang} prefix. */
export const ogUrl = (lang: string, path: string) => `${BASE}/${lang}${path}`;

export const DEFAULT_OG_IMAGES = [{ url: "/og-image.png", width: 1200, height: 630 }];

/**
 * Shared schema.org Person for `author` / `reviewedBy` on medical pages.
 * Credentials are limited to what is already public on /about.
 */
export const SITE_AUTHOR = {
  "@type": "Person",
  name: "Yoojin Nam, M.D.",
  url: `${BASE}/en/about`,
  jobTitle: "Radiologist",
  affiliation: { "@type": "Organization", name: "Aperivue", url: BASE },
  knowsAbout: ["Radiology", "Medical imaging", "RADS", "Medical AI"],
} as const;

/** Build a BreadcrumbList JSON-LD object. `path` example: "/rads/orads"; home is "". */
export function buildBreadcrumb(
  lang: string,
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE}/${lang}${it.path}`,
    })),
  };
}

/** Single source of truth for the skill count — never hardcode, always import this. */
export const SKILL_COUNT = skillsEn.skills.length;

/**
 * Counts vendored from the repo's own SSOT (medsci-skills `metadata/catalog_counts.json`,
 * refreshed by `npm run skills:refresh`). The site once said "Claude Code only" and never
 * mentioned the detectors at all — the one thing that actually distinguishes the toolkit —
 * because these numbers lived in prose. They are placeholders now, and a test forbids a
 * hardcoded digit from creeping back into the copy.
 */
export const DETECTOR_COUNT = catalogCounts.integrity_detectors;
export const GUIDELINE_COUNT = catalogCounts.reporting_guidelines;
