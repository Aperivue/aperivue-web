import type { Metadata } from "next";
import LungRadsReportGenerator from "./LungRadsReportGenerator";
import { buildAlternates, ogUrl, SITE_AUTHOR, buildBreadcrumb } from "@/lib/seo";
import { RADS_BY_SLUG, radsBreadcrumbItems, LAST_REVIEWED, DATE_MODIFIED } from "@/lib/rads/registry";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Lung-RADS Calculator & Report Generator — v2022",
    description:
      "Free lung cancer screening CT structured report generator with Lung-RADS v2022 scoring. Supports solid, part-solid, and ground-glass nodules. Multi-nodule, S modifier, PACS-ready report.",
    keywords: [
      "Lung-RADS", "Lung-RADS v2022", "lung cancer screening",
      "LDCT", "pulmonary nodule", "structured reporting",
      "low-dose CT", "lung nodule calculator",
    ],
    alternates: buildAlternates(lang, "/rads/lungrads"),
  };
}

export default async function LungRadsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // English-only calculator body → inLanguage: "en"; only the url carries the locale.
  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Lung-RADS Calculator & Report Generator (v2022)",
    description:
      "Free lung cancer screening CT structured report generator with Lung-RADS v2022 scoring for solid, part-solid, and ground-glass nodules.",
    url: ogUrl(lang, "/rads/lungrads"),
    inLanguage: "en",
    about: {
      "@type": "MedicalTest",
      name: "Low-dose CT lung cancer screening (Lung-RADS v2022)",
    },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: RADS_BY_SLUG["lungrads"].datePublished,
    dateModified: DATE_MODIFIED,
    citation: RADS_BY_SLUG["lungrads"].citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "lungrads"));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Lung-RADS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lung-RADS (Lung CT Screening Reporting and Data System) is the ACR standard for classifying nodules on low-dose CT lung cancer screening and assigning management recommendations.",
        },
      },
      {
        "@type": "Question",
        name: "Which version does this calculator use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lung-RADS v2022, with support for solid, part-solid, and ground-glass nodules, multi-nodule scoring, and the S modifier.",
        },
      },
      {
        "@type": "Question",
        name: "Is this a medical device?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It is for educational and research purposes only, is not a regulatory-cleared medical device, and does not replace professional medical judgment.",
        },
      },
    ],
  };

  return (
    <main className="flex-1 px-4 py-10 md:px-6 md:py-16">
      <JsonLd data={medicalWebPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Aperivue RADS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Lung Cancer Screening CT Report Generator
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Structured reporting with Lung-RADS v2022 &middot; Multi-nodule
            &middot; S modifier &middot; PACS-ready output
          </p>
        </div>
        <LungRadsReportGenerator />
        <footer className="mt-10 space-y-2 rounded-xl border border-border bg-muted p-4 text-xs text-foreground/50 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> This tool is for educational and
            research purposes only. It is not a medical device and has not
            been cleared or approved by the FDA, KFDA/MFDS, or any
            regulatory authority. It is not intended for clinical diagnosis
            or treatment decisions. It does not replace professional
            medical judgment. Always correlate with clinical findings and
            institutional protocols.
          </p>
          <p>
            <strong>Reference:</strong> ACR Lung-RADS v2022 — American College
            of Radiology. Lung CT Screening Reporting &amp; Data System
            (Lung-RADS).
          </p>
        </footer>
      </div>
    </main>
  );
}
