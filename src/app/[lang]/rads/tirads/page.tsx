import type { Metadata } from "next";
import ThyroidReportGenerator from "./ThyroidReportGenerator";
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
    title: "TIRADS Calculator & Report Generator — ACR TI-RADS · K-TIRADS · EU-TIRADS",
    description:
      "Free thyroid ultrasound structured report generator with TIRADS scoring. Supports ACR TI-RADS (2017), 2021 K-TIRADS, EU-TIRADS. Multi-nodule, size-based FNA, lymph node assessment, PACS-ready report.",
    keywords: [
      "TIRADS", "TI-RADS", "K-TIRADS", "EU-TIRADS",
      "thyroid nodule", "FNA", "radiology calculator",
      "thyroid ultrasound report", "structured reporting",
      "biopsy criteria", "PACS",
    ],
    alternates: buildAlternates(lang, "/rads/tirads"),
  };
}

export default async function TiradsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // The calculator body is English-only, so structured data is tagged inLanguage: "en"
  // regardless of the URL locale; only the url carries the /{lang} prefix.
  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "TI-RADS Calculator & Report Generator",
    description:
      "Free thyroid ultrasound structured report generator with TIRADS scoring (ACR TI-RADS, K-TIRADS, EU-TIRADS).",
    url: ogUrl(lang, "/rads/tirads"),
    inLanguage: "en",
    about: {
      "@type": "MedicalTest",
      name: "Thyroid ultrasound TI-RADS risk stratification",
    },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: RADS_BY_SLUG["tirads"].datePublished,
    dateModified: DATE_MODIFIED,
    citation: RADS_BY_SLUG["tirads"].citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "tirads"));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is TI-RADS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TI-RADS (Thyroid Imaging Reporting and Data System) is a standardized scheme for risk-stratifying thyroid nodules on ultrasound and deciding whether fine-needle aspiration (FNA) is warranted.",
        },
      },
      {
        "@type": "Question",
        name: "Which TI-RADS systems does this calculator support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ACR TI-RADS (2017), 2021 K-TIRADS, and EU-TIRADS, with multi-nodule support and size-based FNA criteria.",
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
            Thyroid US Report Generator
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Structured reporting with TIRADS scoring &middot; Multi-nodule
            &middot; PACS-ready output
          </p>
        </div>
        <ThyroidReportGenerator />
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
            <strong>References:</strong> ACR TI-RADS — Tessler et al., JACR
            2017. K-TIRADS — Ha et al., Korean J Radiol 2021;22(12):2094-2123.
            EU-TIRADS — Russ et al., Eur Thyroid J 2017.
          </p>
        </footer>
      </div>
    </main>
  );
}
