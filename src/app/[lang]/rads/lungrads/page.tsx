import type { Metadata } from "next";
import LungRadsReportGenerator from "./LungRadsReportGenerator";
import { buildAlternates, ogUrl, SITE_AUTHOR, buildBreadcrumb } from "@/lib/seo";
import { RADS_BY_SLUG, radsBreadcrumbItems, LAST_REVIEWED, DATE_MODIFIED } from "@/lib/rads/registry";
import { JsonLd } from "@/components/JsonLd";
import CriteriaSection from "@/components/rads/CriteriaSection";

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

const PAGE_TEXT = {
  en: {
    criteria: {
      heading: "Lung-RADS v2022 — assessment categories",
      caption:
        "Malignancy likelihood and management by ACR Lung-RADS v2022 category. Management strings mirror this calculator's output.",
      columnLabels: { category: "Category", risk: "Malignancy likelihood", management: "Typical management" },
      categories: [
        { category: "Lung-RADS 0", risk: "n/a (incomplete)", management: "Additional imaging or comparison needed (prior CT for comparison or complete lung imaging)." },
        { category: "Lung-RADS 1", risk: "<1%", management: "Continue annual screening with LDCT (LDCT in 12 months)." },
        { category: "Lung-RADS 2", risk: "<1%", management: "Continue annual screening with LDCT (LDCT in 12 months)." },
        { category: "Lung-RADS 3", risk: "1–2%", management: "LDCT in 6 months." },
        { category: "Lung-RADS 4A", risk: "5–15%", management: "LDCT in 3 months; PET/CT may be used." },
        { category: "Lung-RADS 4B", risk: ">15%", management: "Tissue sampling, PET/CT, or both; management as clinically indicated." },
        { category: "Lung-RADS 4X", risk: ">15%", management: "Tissue sampling and/or PET/CT, with additional workup as indicated." },
      ],
      rulesHeading: "Key decision rules (v2022)",
      rules: [
        "Nodule type (solid, part-solid, or ground-glass [GGN]) is the first branch point; for part-solid nodules the solid-component size, not the total size, drives the category.",
        "Solid nodules: <6 mm is category 1, 6 to <8 mm is category 3, 8 to <15 mm is category 4A, and ≥15 mm is category 4B (baseline or new).",
        "Part-solid nodules: a solid component <4 mm scores category 2–3, 4 to <6 mm scores category 4A, and ≥6 mm scores category 4B (baseline or new).",
        "Ground-glass nodules: <30 mm is category 2 at baseline (or 3 if new); ≥30 mm is category 3.",
        "New vs stable vs growing changes the threshold: a stable nodule ≥12 months is downgraded toward category 2, while a growing nodule is upgraded (e.g. a solid nodule growing to ≥8 mm becomes category 4B).",
        "The S modifier flags a clinically significant or potentially significant non-Lung-RADS finding (e.g. spiculation, lymphadenopathy, direct invasion, pleural effusion); when any suspicious feature is present the assessment is escalated to category 4X.",
        "Category 0 is assigned when prior CT is unavailable for comparison or the lungs are not fully imaged; category 1 also covers a completely calcified nodule or a fat-density (hamartoma) nodule.",
      ],
    },
  },
  ko: {
    criteria: {
      heading: "Lung-RADS v2022 — 평가 카테고리",
      caption:
        "ACR Lung-RADS v2022 카테고리별 악성 가능성 및 관리. 관리 문구는 본 계산기의 출력과 일치합니다.",
      columnLabels: { category: "카테고리", risk: "악성 가능성", management: "일반적 관리" },
      categories: [
        { category: "Lung-RADS 0", risk: "해당 없음 (불완전)", management: "추가 영상 또는 비교가 필요합니다(비교용 prior CT 또는 완전한 폐 영상)." },
        { category: "Lung-RADS 1", risk: "<1%", management: "LDCT로 연간 선별검사를 지속합니다(12개월 후 LDCT)." },
        { category: "Lung-RADS 2", risk: "<1%", management: "LDCT로 연간 선별검사를 지속합니다(12개월 후 LDCT)." },
        { category: "Lung-RADS 3", risk: "1–2%", management: "6개월 후 LDCT." },
        { category: "Lung-RADS 4A", risk: "5–15%", management: "3개월 후 LDCT; PET/CT를 사용할 수 있습니다." },
        { category: "Lung-RADS 4B", risk: ">15%", management: "조직 검사, PET/CT 또는 둘 다; 임상적으로 적절한 관리." },
        { category: "Lung-RADS 4X", risk: ">15%", management: "조직 검사 및/또는 PET/CT, 필요 시 추가 검사." },
      ],
      rulesHeading: "핵심 결정 규칙 (v2022)",
      rules: [
        "병변 유형(solid, part-solid, ground-glass [GGN])이 1차 분기점이며, part-solid 결절은 전체 크기가 아니라 solid component 크기가 카테고리를 결정합니다.",
        "Solid 결절: <6 mm는 카테고리 1, 6–<8 mm는 카테고리 3, 8–<15 mm는 카테고리 4A, ≥15 mm는 카테고리 4B입니다(baseline 또는 new).",
        "Part-solid 결절: solid component <4 mm는 카테고리 2–3, 4–<6 mm는 카테고리 4A, ≥6 mm는 카테고리 4B입니다(baseline 또는 new).",
        "Ground-glass 결절: <30 mm는 baseline에서 카테고리 2(new이면 3), ≥30 mm는 카테고리 3입니다.",
        "New·stable·growing 여부가 임계값을 바꿉니다: ≥12개월 stable 결절은 카테고리 2 쪽으로 하향되고, growing 결절은 상향됩니다(예: solid 결절이 ≥8 mm로 성장하면 카테고리 4B).",
        "S modifier는 임상적으로 유의하거나 유의할 수 있는 non-Lung-RADS 소견(예: spiculation, lymphadenopathy, direct invasion, pleural effusion)을 표시하며, 의심 소견이 있으면 평가가 카테고리 4X로 상향됩니다.",
        "카테고리 0은 비교용 prior CT가 없거나 폐가 완전히 영상화되지 않은 경우에 부여되며, 카테고리 1은 완전히 석회화된 결절이나 지방 밀도(hamartoma) 결절도 포함합니다.",
      ],
    },
  },
} as const;

export default async function LungRadsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: "en" | "ko" = lang === "ko" ? "ko" : "en";
  const t = PAGE_TEXT[locale];

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
        <CriteriaSection content={t.criteria} />
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
