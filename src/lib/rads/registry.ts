/**
 * RADS metadata registry — single source of truth for cross-page concerns
 * (BreadcrumbList, MedicalWebPage GEO fields, /llms.txt).
 *
 * Pure metadata only — does NOT import the scoring engines in this directory.
 * Citations are structured from the references already shown on each RADS page;
 * no new medical claims are introduced here.
 */

type Citation = {
  "@type": "ScholarlyArticle";
  name: string;
  publication?: string;
  datePublished?: string;
};

export type RadsEntry = {
  slug: string;
  /** Short system name, used as the breadcrumb leaf and llms.txt title. */
  name: string;
  /** One-line description for /llms.txt. */
  blurb: string;
  /** ISO date the calculator first shipped (from git history). */
  datePublished: string;
  citation: Citation[];
};

/** Shared review dates for all RADS MedicalWebPage schemas (kept in one place). */
export const LAST_REVIEWED = "2026-06-03";
export const DATE_MODIFIED = "2026-06-03";

export const RADS_REGISTRY: RadsEntry[] = [
  {
    slug: "tirads",
    name: "TI-RADS",
    blurb:
      "Thyroid ultrasound structured reporting with ACR TI-RADS, K-TIRADS, and EU-TIRADS scoring (multi-nodule, FNA criteria).",
    datePublished: "2026-04-05",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "ACR Thyroid Imaging, Reporting and Data System (TI-RADS): White Paper of the ACR TI-RADS Committee",
        publication: "Journal of the American College of Radiology",
        datePublished: "2017",
      },
      {
        "@type": "ScholarlyArticle",
        name: "2021 Korean Thyroid Imaging Reporting and Data System and Imaging-Based Management of Thyroid Nodules (K-TIRADS)",
        publication: "Korean Journal of Radiology",
        datePublished: "2021",
      },
      {
        "@type": "ScholarlyArticle",
        name: "European Thyroid Association Guidelines for Ultrasound Malignancy Risk Stratification of Thyroid Nodules in Adults: the EU-TIRADS",
        publication: "European Thyroid Journal",
        datePublished: "2017",
      },
    ],
  },
  {
    slug: "lungrads",
    name: "Lung-RADS",
    blurb:
      "Lung cancer screening CT report generator with Lung-RADS v2022 (solid, part-solid, ground-glass nodules, S modifier).",
    datePublished: "2026-04-06",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "Lung CT Screening Reporting & Data System (Lung-RADS) version 2022",
        publication: "American College of Radiology",
        datePublished: "2022",
      },
    ],
  },
  {
    slug: "birads",
    name: "BI-RADS",
    blurb:
      "Breast imaging structured reporting with BI-RADS assessment categories for mammography, ultrasound, and MRI.",
    datePublished: "2026-04-10",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "ACR BI-RADS Atlas, 5th Edition",
        publication: "American College of Radiology",
        datePublished: "2013",
      },
    ],
  },
  {
    slug: "lirads",
    name: "LI-RADS",
    blurb:
      "Liver imaging reporting for CT and MRI with the LI-RADS v2018 diagnostic algorithm (LR-M, LR-TIV, ancillary features).",
    datePublished: "2026-06-03",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "Liver Imaging Reporting and Data System (LI-RADS) Version 2018",
        publication: "Radiology",
        datePublished: "2018",
      },
    ],
  },
  {
    slug: "pirads",
    name: "PI-RADS",
    blurb:
      "Prostate multiparametric MRI reporting with PI-RADS v2.1 (zone-aware scoring, DCE resolution).",
    datePublished: "2026-06-03",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "Prostate Imaging Reporting and Data System Version 2.1: 2019 Update of PI-RADS Version 2",
        publication: "European Urology",
        datePublished: "2019",
      },
    ],
  },
  {
    slug: "orads",
    name: "O-RADS",
    blurb:
      "Ovarian-adnexal reporting with O-RADS US v2022 and MRI 2022 (lexicon-based risk stratification, color score, time-intensity curve).",
    datePublished: "2026-06-03",
    citation: [
      {
        "@type": "ScholarlyArticle",
        name: "O-RADS US v2022: An Update from the ACR O-RADS US Committee",
        publication: "Radiology",
        datePublished: "2023",
      },
      {
        "@type": "ScholarlyArticle",
        name: "O-RADS MRI Risk Stratification System: Guide for Assessing Adnexal Lesions from the ACR O-RADS Committee",
        publication: "Radiology",
        datePublished: "2022",
      },
    ],
  },
];

export const RADS_BY_SLUG: Record<string, RadsEntry> = Object.fromEntries(
  RADS_REGISTRY.map((r) => [r.slug, r]),
);

/** Localized breadcrumb items (Home › RADS › <name>) for a RADS calculator page. */
export function radsBreadcrumbItems(
  lang: string,
  slug: string,
): { name: string; path: string }[] {
  const entry = RADS_BY_SLUG[slug];
  const home = lang === "ko" ? "홈" : "Home";
  return [
    { name: home, path: "" },
    { name: "RADS", path: "/rads" },
    { name: entry?.name ?? slug, path: `/rads/${slug}` },
  ];
}
