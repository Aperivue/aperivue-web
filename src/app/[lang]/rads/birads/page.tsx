import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import BreastReportGenerator from "./BreastReportGenerator";
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
    title: "BI-RADS Calculator & Report Generator — Mammography · Ultrasound · MRI",
    description:
      "Free breast imaging structured report generator with BI-RADS assessment. Supports mammography, ultrasound, and MRI. ACR BI-RADS 5th edition descriptors, kinetic curve analysis, multi-finding support, and PACS-ready report output.",
    keywords: [
      "BI-RADS",
      "breast imaging",
      "mammography",
      "breast ultrasound",
      "breast MRI",
      "ACR BI-RADS",
      "breast structured report",
      "radiology calculator",
      "PACS",
      "breast cancer screening",
      "breast mass",
      "calcifications",
      "kinetic curve",
      "NME",
      "non-mass enhancement",
      "background parenchymal enhancement",
    ],
    alternates: buildAlternates(lang, "/rads/birads"),
  };
}

const PAGE_TEXT = {
  en: {
    badge: "Aperivue RADS",
    title: "Breast Imaging Report Generator",
    subtitle:
      "Structured reporting with BI-RADS assessment · Mammography, Ultrasound & MRI · PACS-ready output",
    disclaimer:
      "This tool is for educational and research purposes only. It is not a medical device and has not been cleared or approved by the FDA, KFDA/MFDS, or any regulatory authority. It is not intended for clinical diagnosis or treatment decisions. It does not replace professional medical judgment. Always correlate with clinical findings and institutional protocols.",
    reference:
      "Reference: ACR BI-RADS Atlas 5th Edition — D'Orsi CJ, et al. Reston, VA: American College of Radiology; 2013.",
    mwpName: "BI-RADS Calculator & Report Generator",
    mwpDescription:
      "Free breast imaging structured report generator with BI-RADS assessment for mammography, ultrasound, and MRI.",
    criteria: {
      heading: "BI-RADS — assessment categories",
      caption:
        "Malignancy risk and management by ACR BI-RADS Atlas 5th Edition category. The same values drive this calculator.",
      columnLabels: { category: "Category", risk: "Malignancy risk", management: "Management" },
      categories: [
        { category: "BI-RADS 0", risk: "N/A", management: "Additional imaging evaluation needed and/or prior mammograms for comparison." },
        { category: "BI-RADS 1", risk: "Essentially 0%", management: "Routine screening." },
        { category: "BI-RADS 2", risk: "Essentially 0%", management: "Routine screening." },
        { category: "BI-RADS 3", risk: ">0% but ≤2%", management: "Short-interval (6-month) follow-up." },
        { category: "BI-RADS 4A", risk: ">2% to ≤10%", management: "Tissue sampling." },
        { category: "BI-RADS 4B", risk: ">10% to ≤50%", management: "Tissue sampling." },
        { category: "BI-RADS 4C", risk: ">50% to <95%", management: "Tissue sampling." },
        { category: "BI-RADS 5", risk: "≥95%", management: "Tissue sampling." },
        { category: "BI-RADS 6", risk: "N/A", management: "Surgical excision when clinically appropriate." },
      ],
      rulesHeading: "Key category rules",
      rules: [
        "BI-RADS assessment categories are shared across mammography, ultrasound, and MRI; the same 0–6 scale applies to every modality.",
        "BI-RADS 0 is an incomplete assessment — additional imaging and/or prior studies for comparison are needed before a final category is assigned.",
        "BI-RADS 3 (probably benign) implies a >0% to ≤2% malignancy risk and is managed with short-interval (typically 6-month) follow-up rather than immediate biopsy.",
        "BI-RADS 4 is subdivided into 4A, 4B, and 4C by increasing suspicion (>2–≤10%, >10–≤50%, and >50–<95% respectively), all warranting tissue sampling.",
        "BI-RADS 5 carries a ≥95% malignancy risk; BI-RADS 6 denotes biopsy-proven malignancy already established before imaging.",
      ],
    },
    faq: [
      {
        q: "What is BI-RADS?",
        a: "BI-RADS (Breast Imaging Reporting and Data System) is the ACR standard for describing breast imaging findings and assigning assessment categories (0–6) with management recommendations.",
      },
      {
        q: "Which modalities are supported?",
        a: "Mammography, ultrasound, and MRI, using ACR BI-RADS 5th edition descriptors, with kinetic curve analysis and multi-finding support.",
      },
      {
        q: "Is this a medical device?",
        a: "No. It is for educational and research purposes only, is not a regulatory-cleared medical device, and does not replace professional medical judgment.",
      },
    ],
  },
  ko: {
    badge: "Aperivue RADS",
    title: "유방 영상 리포트 생성기",
    subtitle:
      "BI-RADS 평가를 포함한 구조화 리포트 · 유방촬영, 초음파 & MRI · PACS 바로 복사",
    disclaimer:
      "이 도구는 교육 및 연구 목적으로만 사용됩니다. 의료기기가 아니며 FDA, KFDA/MFDS 또는 어떤 규제 기관의 허가도 받지 않았습니다. 임상적 진단이나 치료 결정에 사용될 수 없으며, 전문적인 의학적 판단을 대체하지 않습니다. 항상 임상 소견 및 기관 프로토콜과 함께 판단하십시오.",
    reference:
      "참고문헌: ACR BI-RADS Atlas 5th Edition — D'Orsi CJ, et al. Reston, VA: American College of Radiology; 2013.",
    mwpName: "BI-RADS 계산기 및 리포트 생성기",
    mwpDescription:
      "유방촬영, 초음파, MRI를 위한 BI-RADS 평가 기반 무료 유방 영상 구조화 리포트 생성기.",
    criteria: {
      heading: "BI-RADS — 평가 카테고리",
      caption:
        "ACR BI-RADS Atlas 5th Edition 카테고리별 악성 위험도 및 관리. 동일한 값이 이 계산기를 구동합니다.",
      columnLabels: { category: "카테고리", risk: "악성 위험도", management: "관리" },
      categories: [
        { category: "BI-RADS 0", risk: "N/A", management: "추가 영상 평가 및/또는 비교를 위한 이전 유방촬영이 필요합니다." },
        { category: "BI-RADS 1", risk: "사실상 0%", management: "정기 선별검사." },
        { category: "BI-RADS 2", risk: "사실상 0%", management: "정기 선별검사." },
        { category: "BI-RADS 3", risk: ">0%–≤2%", management: "단기간(6개월) 추적 검사." },
        { category: "BI-RADS 4A", risk: ">2%–≤10%", management: "조직 검사." },
        { category: "BI-RADS 4B", risk: ">10%–≤50%", management: "조직 검사." },
        { category: "BI-RADS 4C", risk: ">50%–<95%", management: "조직 검사." },
        { category: "BI-RADS 5", risk: "≥95%", management: "조직 검사." },
        { category: "BI-RADS 6", risk: "N/A", management: "임상적으로 적절한 경우 수술적 절제." },
      ],
      rulesHeading: "핵심 카테고리 규칙",
      rules: [
        "BI-RADS 평가 카테고리는 유방촬영, 초음파, MRI에서 공통으로 사용되며 동일한 0–6 척도가 모든 모달리티에 적용됩니다.",
        "BI-RADS 0은 불완전한 평가로, 최종 카테고리를 부여하기 전에 추가 영상 및/또는 비교를 위한 이전 검사가 필요합니다.",
        "BI-RADS 3(probably benign)은 >0%–≤2%의 악성 위험도를 의미하며, 즉시 조직 검사보다는 단기간(일반적으로 6개월) 추적 검사로 관리합니다.",
        "BI-RADS 4는 의심도가 증가함에 따라 4A, 4B, 4C로 세분되며(각각 >2%–≤10%, >10%–≤50%, >50%–<95%), 모두 조직 검사가 필요합니다.",
        "BI-RADS 5는 ≥95%의 악성 위험도를 가지며, BI-RADS 6는 영상 검사 이전에 이미 확인된 조직검사로 입증된 악성을 의미합니다.",
      ],
    },
    faq: [
      {
        q: "BI-RADS란 무엇인가요?",
        a: "BI-RADS(유방 영상 보고 데이터 시스템)는 유방 영상 소견을 기술하고 평가 카테고리(0–6)와 권고 사항을 부여하는 ACR 표준입니다.",
      },
      {
        q: "어떤 모달리티를 지원하나요?",
        a: "유방촬영, 초음파, MRI를 지원하며 ACR BI-RADS 5판 기술어, 조영 증강 곡선 분석, 다중 소견 입력을 제공합니다.",
      },
      {
        q: "의료기기인가요?",
        a: "아닙니다. 교육 및 연구 목적의 도구이며, 규제 인증을 받은 의료기기가 아니고, 전문적인 의학적 판단을 대체하지 않습니다.",
      },
    ],
  },
} as const;

export default async function BiRadsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as "en" | "ko";
  const t = PAGE_TEXT[locale];

  // BI-RADS body is localized, so JSON-LD language matches the URL locale.
  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.mwpName,
    description: t.mwpDescription,
    url: ogUrl(lang, "/rads/birads"),
    inLanguage: locale,
    about: { "@type": "MedicalTest", name: "Breast imaging BI-RADS assessment" },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: RADS_BY_SLUG["birads"].datePublished,
    dateModified: DATE_MODIFIED,
    citation: RADS_BY_SLUG["birads"].citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "birads"));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="flex-1 px-4 py-10 md:px-6 md:py-16">
      <JsonLd data={medicalWebPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            {t.badge}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-sm text-foreground/60">{t.subtitle}</p>
        </div>

        <BreastReportGenerator locale={locale} />

        <CriteriaSection content={t.criteria} />

        <footer className="mt-10 space-y-2 rounded-xl border border-border bg-muted p-4 text-xs text-foreground/50 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> {t.disclaimer}
          </p>
          <p>
            <strong>Reference:</strong> {t.reference}
          </p>
        </footer>
      </div>
    </main>
  );
}
