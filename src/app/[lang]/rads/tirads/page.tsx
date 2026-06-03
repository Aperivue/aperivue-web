import type { Metadata } from "next";
import { hasLocale } from "../../dictionaries";
import ThyroidReportGenerator from "./ThyroidReportGenerator";
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

const PAGE_TEXT = {
  en: {
    criteriaAcr: {
      heading: "ACR TI-RADS (2017) — point-based categories",
      caption:
        "Malignancy risk and size-based management by ACR TI-RADS category, mirroring this calculator's own scoring engine. Thresholds reflect the FNA / follow-up size cut-offs the calculator applies.",
      columnLabels: { category: "Category", risk: "Malignancy risk", management: "Size-based management" },
      categories: [
        { category: "ACR TR1 (Benign)", risk: "<2%", management: "No FNA; no follow-up needed." },
        { category: "ACR TR2 (Not Suspicious)", risk: "~2%", management: "No FNA; no follow-up needed." },
        { category: "ACR TR3 (Mildly Suspicious)", risk: "~5%", management: "FNA if ≥ 2.5 cm; follow-up if ≥ 1.5 cm." },
        { category: "ACR TR4 (Moderately Suspicious)", risk: "5–20%", management: "FNA if ≥ 1.5 cm; follow-up if ≥ 1.0 cm." },
        { category: "ACR TR5 (Highly Suspicious)", risk: ">20%", management: "FNA if ≥ 1.0 cm; follow-up if ≥ 0.5 cm." },
      ],
      rulesHeading: "Key decision rules (ACR TI-RADS)",
      rules: [
        "Points are summed across five feature categories: composition, echogenicity, shape, margin, and echogenic foci.",
        "Composition (0–2), echogenicity (0–3), shape (wider-than-tall 0, taller-than-wide 3), and margin (0–3) each contribute, plus the single most suspicious echogenic-foci finding (0–3).",
        "Total points map to a category: 0 = TR1, 1–2 = TR2, 3 = TR3, 4–6 = TR4, and ≥ 7 = TR5.",
        "FNA versus follow-up is then decided by nodule size within the category, using the size thresholds in the table above.",
        "Higher categories carry both higher malignancy risk and lower size thresholds for biopsy.",
      ],
    },
    criteriaK: {
      heading: "2021 K-TIRADS — pattern-based categories",
      caption:
        "Malignancy risk and management by 2021 K-TIRADS category (Ha et al., Korean J Radiol 2021), mirroring this calculator's own scoring engine. The calculator scores nodules from K-TIRADS 2; category 1 (no nodule) is listed for completeness.",
      columnLabels: { category: "Category", risk: "Malignancy risk", management: "Size-based management" },
      categories: [
        { category: "K-TIRADS 1 (No nodule)", risk: "No nodule (not assessed)", management: "Not applicable." },
        { category: "K-TIRADS 2 (Benign)", risk: "<3%", management: "Biopsy not routinely indicated; US follow-up at 2–5 years depending on size." },
        { category: "K-TIRADS 3 (Low Suspicion)", risk: "3–10%", management: "FNA if > 2.0 cm; US at 1, 3, and 5 years." },
        { category: "K-TIRADS 4 (Intermediate Suspicion)", risk: "10–40%", management: "FNA if > 1.0–1.5 cm; US at 1, 3, and 5 years." },
        { category: "K-TIRADS 5 (High Suspicion)", risk: ">60%", management: "FNA if > 1.0 cm; US every 6 months for 1–2 years, then yearly." },
      ],
      rulesHeading: "Key decision rules (2021 K-TIRADS)",
      rules: [
        "Composition and echogenicity first define the base pattern; pure cysts and iso-/hyperechoic spongiform nodules are K-TIRADS 2 (benign).",
        "Three suspicious US features are assessed: punctate echogenic foci, nonparallel orientation (taller-than-wide), and irregular margin.",
        "A solid hypoechoic nodule with any suspicious feature is K-TIRADS 5; a solid hypoechoic nodule without any suspicious feature is K-TIRADS 4.",
        "A partially cystic or iso-/hyperechoic nodule is K-TIRADS 4 if any suspicious feature is present, otherwise K-TIRADS 3.",
        "An entirely calcified nodule is classified as K-TIRADS 4.",
        "Within each category, FNA versus follow-up is decided by nodule size using the thresholds in the table above.",
      ],
    },
    criteriaEu: {
      heading: "EU-TIRADS — feature-based categories",
      caption:
        "Malignancy risk and size-based management by EU-TIRADS category (Russ et al., Eur Thyroid J 2017), mirroring this calculator's own scoring engine.",
      columnLabels: { category: "Category", risk: "Malignancy risk", management: "Size-based management" },
      categories: [
        { category: "EU-TIRADS 1 (Benign)", risk: "<1%", management: "No FNA; no follow-up needed." },
        { category: "EU-TIRADS 2 (Not Suspicious)", risk: "0–3%", management: "No FNA; no follow-up needed." },
        { category: "EU-TIRADS 3 (Low Risk)", risk: "2–4%", management: "FNA if ≥ 2.0 cm; follow-up if ≥ 1.0 cm." },
        { category: "EU-TIRADS 4 (Intermediate Risk)", risk: "6–17%", management: "FNA if ≥ 1.5 cm; follow-up if ≥ 1.0 cm." },
        { category: "EU-TIRADS 5 (High Risk)", risk: ">26%", management: "FNA if ≥ 1.0 cm; consider FNA if < 1.0 cm with suspicious features." },
      ],
      rulesHeading: "Key decision rules (EU-TIRADS)",
      rules: [
        "Category is driven by composition and echogenicity, with a single high-risk modifier.",
        "A purely cystic nodule is EU-TIRADS 1, and a spongiform nodule is EU-TIRADS 2 (no/very low risk).",
        "A solid, isoechoic or hyperechoic nodule with no high-risk features is EU-TIRADS 3 (low risk).",
        "A solid, mildly hypoechoic nodule with no high-risk features is EU-TIRADS 4 (intermediate risk).",
        "A markedly hypoechoic nodule, or a mildly hypoechoic nodule with high-risk features, is EU-TIRADS 5 (high risk).",
        "Within each category, FNA versus follow-up is decided by nodule size using the thresholds in the table above.",
      ],
    },
  },
  ko: {
    criteriaAcr: {
      heading: "ACR TI-RADS (2017) — 점수 기반 카테고리",
      caption:
        "ACR TI-RADS 카테고리별 악성 위험도 및 크기 기반 관리로, 본 계산기의 채점 엔진과 동일합니다. 임계값은 계산기가 적용하는 FNA / 추적 크기 기준을 반영합니다.",
      columnLabels: { category: "카테고리", risk: "악성 위험도", management: "크기 기반 관리" },
      categories: [
        { category: "ACR TR1 (Benign)", risk: "<2%", management: "FNA 불필요; 추적 불필요." },
        { category: "ACR TR2 (Not Suspicious)", risk: "~2%", management: "FNA 불필요; 추적 불필요." },
        { category: "ACR TR3 (Mildly Suspicious)", risk: "~5%", management: "≥ 2.5 cm이면 FNA; ≥ 1.5 cm이면 추적." },
        { category: "ACR TR4 (Moderately Suspicious)", risk: "5–20%", management: "≥ 1.5 cm이면 FNA; ≥ 1.0 cm이면 추적." },
        { category: "ACR TR5 (Highly Suspicious)", risk: ">20%", management: "≥ 1.0 cm이면 FNA; ≥ 0.5 cm이면 추적." },
      ],
      rulesHeading: "핵심 결정 규칙 (ACR TI-RADS)",
      rules: [
        "다섯 가지 feature 카테고리(composition, echogenicity, shape, margin, echogenic foci)의 점수를 합산합니다.",
        "Composition(0–2), echogenicity(0–3), shape(wider-than-tall 0, taller-than-wide 3), margin(0–3)이 각각 기여하며, 가장 의심스러운 echogenic foci 소견 한 가지(0–3)를 더합니다.",
        "총점이 카테고리로 매핑됩니다: 0 = TR1, 1–2 = TR2, 3 = TR3, 4–6 = TR4, ≥ 7 = TR5.",
        "이후 FNA 대 추적 여부는 카테고리 내에서 결절 크기로 결정하며, 위 표의 크기 임계값을 사용합니다.",
        "카테고리가 높을수록 악성 위험도가 높고 생검을 위한 크기 임계값이 낮아집니다.",
      ],
    },
    criteriaK: {
      heading: "2021 K-TIRADS — 패턴 기반 카테고리",
      caption:
        "2021 K-TIRADS 카테고리별 악성 위험도 및 관리(Ha et al., Korean J Radiol 2021)로, 본 계산기의 채점 엔진과 동일합니다. 계산기는 K-TIRADS 2부터 채점하며, 카테고리 1(결절 없음)은 완전성을 위해 표기합니다.",
      columnLabels: { category: "카테고리", risk: "악성 위험도", management: "크기 기반 관리" },
      categories: [
        { category: "K-TIRADS 1 (No nodule)", risk: "결절 없음(평가 안 함)", management: "해당 없음." },
        { category: "K-TIRADS 2 (Benign)", risk: "<3%", management: "생검은 통상 권장되지 않음; 크기에 따라 2–5년 후 US 추적." },
        { category: "K-TIRADS 3 (Low Suspicion)", risk: "3–10%", management: "> 2.0 cm이면 FNA; 1, 3, 5년에 US." },
        { category: "K-TIRADS 4 (Intermediate Suspicion)", risk: "10–40%", management: "> 1.0–1.5 cm이면 FNA; 1, 3, 5년에 US." },
        { category: "K-TIRADS 5 (High Suspicion)", risk: ">60%", management: "> 1.0 cm이면 FNA; 1–2년간 6개월마다 US 후 매년." },
      ],
      rulesHeading: "핵심 결정 규칙 (2021 K-TIRADS)",
      rules: [
        "Composition과 echogenicity가 먼저 기본 패턴을 정의하며, 순수 낭종과 iso-/hyperechoic spongiform 결절은 K-TIRADS 2(양성)입니다.",
        "세 가지 의심 US feature를 평가합니다: punctate echogenic foci, nonparallel orientation(taller-than-wide), irregular margin.",
        "Solid hypoechoic 결절이 의심 feature를 하나라도 가지면 K-TIRADS 5이며, 의심 feature가 없으면 K-TIRADS 4입니다.",
        "Partially cystic 또는 iso-/hyperechoic 결절은 의심 feature가 있으면 K-TIRADS 4, 없으면 K-TIRADS 3입니다.",
        "전체가 석회화된(entirely calcified) 결절은 K-TIRADS 4로 분류합니다.",
        "각 카테고리 내에서 FNA 대 추적 여부는 위 표의 임계값을 사용하여 결절 크기로 결정합니다.",
      ],
    },
    criteriaEu: {
      heading: "EU-TIRADS — feature 기반 카테고리",
      caption:
        "EU-TIRADS 카테고리별 악성 위험도 및 크기 기반 관리(Russ et al., Eur Thyroid J 2017)로, 본 계산기의 채점 엔진과 동일합니다.",
      columnLabels: { category: "카테고리", risk: "악성 위험도", management: "크기 기반 관리" },
      categories: [
        { category: "EU-TIRADS 1 (Benign)", risk: "<1%", management: "FNA 불필요; 추적 불필요." },
        { category: "EU-TIRADS 2 (Not Suspicious)", risk: "0–3%", management: "FNA 불필요; 추적 불필요." },
        { category: "EU-TIRADS 3 (Low Risk)", risk: "2–4%", management: "≥ 2.0 cm이면 FNA; ≥ 1.0 cm이면 추적." },
        { category: "EU-TIRADS 4 (Intermediate Risk)", risk: "6–17%", management: "≥ 1.5 cm이면 FNA; ≥ 1.0 cm이면 추적." },
        { category: "EU-TIRADS 5 (High Risk)", risk: ">26%", management: "≥ 1.0 cm이면 FNA; < 1.0 cm이라도 의심 feature가 있으면 FNA 고려." },
      ],
      rulesHeading: "핵심 결정 규칙 (EU-TIRADS)",
      rules: [
        "카테고리는 composition과 echogenicity로 결정되며, 단일 high-risk modifier가 적용됩니다.",
        "순수 낭종은 EU-TIRADS 1, spongiform 결절은 EU-TIRADS 2(위험도 없음/매우 낮음)입니다.",
        "High-risk feature가 없는 solid isoechoic 또는 hyperechoic 결절은 EU-TIRADS 3(저위험)입니다.",
        "High-risk feature가 없는 solid mildly hypoechoic 결절은 EU-TIRADS 4(중간 위험)입니다.",
        "Markedly hypoechoic 결절, 또는 high-risk feature를 동반한 mildly hypoechoic 결절은 EU-TIRADS 5(고위험)입니다.",
        "각 카테고리 내에서 FNA 대 추적 여부는 위 표의 임계값을 사용하여 결절 크기로 결정합니다.",
      ],
    },
  },
} as const;

export default async function TiradsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: "en" | "ko" = hasLocale(lang) ? (lang as "en" | "ko") : "en";
  const t = PAGE_TEXT[locale];

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

        <CriteriaSection content={t.criteriaAcr} />
        <CriteriaSection content={t.criteriaK} />
        <CriteriaSection content={t.criteriaEu} />

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
