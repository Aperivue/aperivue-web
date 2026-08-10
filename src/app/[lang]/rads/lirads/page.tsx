import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import LiverReportGenerator from "./LiverReportGenerator";
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
    title: "LI-RADS Calculator & Report Generator — CT/MRI LI-RADS v2018",
    description:
      "Free liver imaging structured report generator with LI-RADS CT/MRI v2018 scoring. Diagnostic table (LR-1 to LR-5), LR-M, LR-TIV, LR-NC, ancillary features, ECA and hepatobiliary agent washout, multi-observation, PACS-ready report.",
    keywords: [
      "LI-RADS",
      "LI-RADS calculator",
      "LI-RADS v2018",
      "HCC",
      "hepatocellular carcinoma",
      "liver MRI",
      "liver CT",
      "LR-5",
      "LR-M",
      "radiology calculator",
      "structured reporting",
      "PACS",
    ],
    alternates: buildAlternates(lang, "/rads/lirads"),
  };
}

const PAGE_TEXT = {
  en: {
    badge: "Aperivue RADS",
    title: "Liver Imaging Report Generator",
    subtitle: "Structured reporting with LI-RADS CT/MRI v2018 · Multi-observation · PACS-ready output",
    disclaimer:
      "This tool is for educational and research purposes only. It is not a medical device and has not been cleared or approved by the FDA, KFDA/MFDS, or any regulatory authority. It is not intended for clinical diagnosis or treatment decisions. It does not replace professional medical judgment. LI-RADS applies only to patients at high risk for HCC. Always correlate with clinical findings and institutional protocols.",
    reference:
      "References: ACR CT/MRI LI-RADS v2018 Core. Chernyak V, et al. Liver Imaging Reporting and Data System (LI-RADS) Version 2018. Radiology. 2018;289(3):816-830.",
    mwpName: "LI-RADS Calculator & Report Generator",
    mwpDescription:
      "Free liver imaging structured report generator with LI-RADS CT/MRI v2018 scoring for HCC risk categorization.",
    criteria: {
      heading: "LI-RADS CT/MRI v2018 — diagnostic categories",
      caption:
        "HCC probability and management by ACR CT/MRI LI-RADS v2018 category. Mirrors the categories assigned by the calculator above.",
      columnLabels: { category: "Category", risk: "HCC probability", management: "Typical management" },
      categories: [
        { category: "LR-1", risk: "Definitely benign", management: "Return to routine surveillance (e.g., 6-month imaging)." },
        { category: "LR-2", risk: "Probably benign", management: "Surveillance imaging, generally in 6 months." },
        { category: "LR-3", risk: "Intermediate probability of malignancy", management: "Repeat or alternative diagnostic imaging in 3–6 months." },
        { category: "LR-4", risk: "Probably HCC", management: "Multidisciplinary discussion; consider biopsy or repeat/alternative imaging." },
        { category: "LR-5", risk: "Definitely HCC", management: "Biopsy not required; multidisciplinary management." },
        { category: "LR-M", risk: "Probably/definitely malignant, not HCC-specific", management: "Multidisciplinary discussion; biopsy usually required." },
        { category: "LR-TIV", risk: "Definite tumor in vein", management: "Multidisciplinary discussion; treat as malignant." },
        { category: "LR-NC", risk: "Cannot be categorized", management: "Repeat or alternative imaging, generally within 3 months." },
      ],
      rulesHeading: "Key decision rules (CT/MRI v2018)",
      rules: [
        "LI-RADS v2018 applies only to patients at high risk for HCC (cirrhosis, chronic HBV, or current/prior HCC); it is not used in the general population.",
        "The diagnostic table combines the major features — nonrim APHE, nonperipheral washout, enhancing capsule, and threshold growth — with observation size to assign LR-3 through LR-5.",
        "LR-M is assigned for targetoid or rim-APHE features that favor a malignancy other than HCC, and takes precedence over the diagnostic table.",
        "LR-TIV indicates definite tumor in vein (enhancing soft tissue within a vessel).",
        "LR-NC is assigned when the study cannot be categorized because of image omission or degradation.",
        "Ancillary features can adjust the category by up to one step (up for malignancy, down for benignity) but cannot raise an observation to LR-5.",
      ],
    },
    faq: [
      {
        q: "What is LI-RADS?",
        a: "LI-RADS (Liver Imaging Reporting and Data System) is the ACR standard for categorizing liver observations in patients at high risk for hepatocellular carcinoma, assigning categories from LR-1 (definitely benign) to LR-5 (definitely HCC), plus LR-M, LR-TIV, and LR-NC.",
      },
      {
        q: "Which LI-RADS version does this calculator use?",
        a: "ACR CT/MRI LI-RADS v2018, including the diagnostic table, LR-M and LR-TIV criteria, ancillary features, and washout rules for both extracellular and hepatobiliary contrast agents.",
      },
      {
        q: "Is this a medical device?",
        a: "No. It is for educational and research purposes only, is not a regulatory-cleared medical device, and does not replace professional medical judgment.",
      },
    ],
  },
  ko: {
    badge: "Aperivue RADS",
    title: "간 영상 리포트 생성기",
    subtitle: "LI-RADS CT/MRI v2018 기반 구조화 리포트 · 다중 병변 · PACS 바로 복사",
    disclaimer:
      "이 도구는 교육 및 연구 목적으로만 사용됩니다. 의료기기가 아니며 FDA, KFDA/MFDS 또는 어떤 규제 기관의 허가도 받지 않았습니다. 임상적 진단이나 치료 결정에 사용될 수 없으며, 전문적인 의학적 판단을 대체하지 않습니다. LI-RADS는 간세포암 고위험군 환자에게만 적용됩니다. 항상 임상 소견 및 기관 프로토콜과 함께 판단하십시오.",
    reference:
      "참고문헌: ACR CT/MRI LI-RADS v2018 Core. Chernyak V, et al. Liver Imaging Reporting and Data System (LI-RADS) Version 2018. Radiology. 2018;289(3):816-830.",
    mwpName: "LI-RADS 계산기 및 리포트 생성기",
    mwpDescription:
      "LI-RADS CT/MRI v2018 기반 간세포암 위험 분류 무료 간 영상 구조화 리포트 생성기.",
    criteria: {
      heading: "LI-RADS CT/MRI v2018 — 진단 카테고리",
      caption:
        "ACR CT/MRI LI-RADS v2018 카테고리별 HCC 확률 및 관리. 위 계산기가 부여하는 카테고리와 동일합니다.",
      columnLabels: { category: "카테고리", risk: "HCC 확률", management: "일반적 관리" },
      categories: [
        { category: "LR-1", risk: "명백한 양성", management: "정기 추적 감시로 복귀 (예: 6개월 영상)." },
        { category: "LR-2", risk: "양성 가능성 높음", management: "추적 감시 영상, 대개 6개월." },
        { category: "LR-3", risk: "악성 중간 확률", management: "3–6개월 내 재검 또는 대체 진단 영상." },
        { category: "LR-4", risk: "HCC 가능성 높음", management: "다학제 논의; 조직검사 또는 재검/대체 영상 고려." },
        { category: "LR-5", risk: "명백한 HCC", management: "조직검사 불필요; 다학제 관리." },
        { category: "LR-M", risk: "악성 가능성 높음/명백, HCC 비특이적", management: "다학제 논의; 대개 조직검사 필요." },
        { category: "LR-TIV", risk: "명백한 종양 정맥 침범", management: "다학제 논의; 악성에 준하여 치료." },
        { category: "LR-NC", risk: "분류 불가", management: "재검 또는 대체 영상, 대개 3개월 이내." },
      ],
      rulesHeading: "핵심 결정 규칙 (CT/MRI v2018)",
      rules: [
        "LI-RADS v2018은 HCC 고위험군 환자(간경변, 만성 HBV, 현재/과거 HCC)에게만 적용되며, 일반 인구에는 사용하지 않습니다.",
        "진단표는 major feature — nonrim APHE, nonperipheral washout, enhancing capsule, threshold growth — 와 병변 크기를 조합하여 LR-3에서 LR-5까지 부여합니다.",
        "LR-M은 HCC 이외의 악성을 시사하는 targetoid 또는 rim-APHE 소견에 부여되며, 진단표보다 우선합니다.",
        "LR-TIV는 명백한 종양 정맥 침범(혈관 내 조영증강 연부조직)을 의미합니다.",
        "LR-NC는 영상 누락 또는 화질 저하로 인해 분류할 수 없을 때 부여합니다.",
        "보조 소견(ancillary feature)은 카테고리를 한 단계까지 조정할 수 있으나(악성은 상향, 양성은 하향), LR-5로 올릴 수는 없습니다.",
      ],
    },
    faq: [
      {
        q: "LI-RADS란 무엇인가요?",
        a: "LI-RADS(간 영상 보고 데이터 시스템)는 간세포암 고위험군 환자의 간 병변을 분류하는 ACR 표준으로, LR-1(명백한 양성)부터 LR-5(명백한 간세포암)까지와 LR-M, LR-TIV, LR-NC 카테고리를 부여합니다.",
      },
      {
        q: "어떤 LI-RADS 버전을 사용하나요?",
        a: "ACR CT/MRI LI-RADS v2018을 사용하며, 진단표, LR-M 및 LR-TIV 기준, 보조 소견, 세포외 조영제 및 간담도 조영제의 washout 규칙을 포함합니다.",
      },
      {
        q: "의료기기인가요?",
        a: "아닙니다. 교육 및 연구 목적의 도구이며, 규제 인증을 받은 의료기기가 아니고, 전문적인 의학적 판단을 대체하지 않습니다.",
      },
    ],
  },
} as const;

export default async function LiradsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as "en" | "ko";
  const t = PAGE_TEXT[locale];

  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.mwpName,
    description: t.mwpDescription,
    url: ogUrl(lang, "/rads/lirads"),
    inLanguage: locale,
    about: { "@type": "MedicalTest", name: "Liver imaging LI-RADS categorization" },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: RADS_BY_SLUG["lirads"].datePublished,
    dateModified: DATE_MODIFIED,
    citation: RADS_BY_SLUG["lirads"].citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "lirads"));

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
          <p className="text-xs font-medium uppercase tracking-widest text-accent-text">{t.badge}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
          <p className="mt-3 text-sm text-foreground/60">{t.subtitle}</p>
        </div>

        <LiverReportGenerator locale={locale} />

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
