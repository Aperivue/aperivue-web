import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import AdnexalReportGenerator from "./AdnexalReportGenerator";
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
    title: "O-RADS Calculator & Report Generator — Adnexal US v2022 & MRI 2022",
    description:
      "Free ovarian-adnexal structured report generator with O-RADS US v2022 and O-RADS MRI 2022 risk stratification. Lexicon-based scoring, color score, time-intensity curve, multi-lesion, PACS-ready report.",
    keywords: [
      "O-RADS",
      "O-RADS calculator",
      "O-RADS US v2022",
      "O-RADS MRI",
      "ovarian-adnexal",
      "adnexal mass",
      "ovarian cyst risk",
      "color score",
      "time-intensity curve",
      "pelvic ultrasound",
      "pelvic MRI",
      "radiology calculator",
      "structured reporting",
      "PACS",
    ],
    alternates: buildAlternates(lang, "/rads/orads"),
  };
}

const PAGE_TEXT = {
  en: {
    badge: "Aperivue RADS",
    title: "Ovarian-Adnexal Report Generator",
    subtitle: "Structured reporting with O-RADS US v2022 & MRI 2022 · Multi-lesion · PACS-ready output",
    disclaimer:
      "This tool is for educational and research purposes only. It is not a medical device and has not been cleared or approved by the FDA, KFDA/MFDS, or any regulatory authority. It is not intended for clinical diagnosis or treatment decisions. It does not replace professional medical judgment. O-RADS is a risk-stratification category; management is individualized and may be modified by clinical risk factors, symptoms, and professional judgement. Always correlate with clinical findings and institutional protocols.",
    reference:
      "References: Strachowski LM, et al. O-RADS US v2022: An Update from the ACR O-RADS US Committee. Radiology. 2023;308(3):e230685. Sadowski EA, Thomassin-Naggara I, et al. O-RADS MRI Risk Stratification System. Radiology. 2022;303(1):35-47.",
    mwpName: "O-RADS Calculator & Report Generator",
    mwpDescription:
      "Free ovarian-adnexal structured report generator with O-RADS US v2022 and O-RADS MRI 2022 risk stratification.",
    criteriaUs: {
      heading: "O-RADS US v2022 — assessment categories",
      caption:
        "Malignancy risk by ACR O-RADS US v2022 category. The 0–5 scale is shared with O-RADS MRI but the risk basis differs.",
      columnLabels: { category: "Category", risk: "Malignancy risk", management: "Typical management" },
      categories: [
        { category: "O-RADS US 0", risk: "Incomplete", management: "Repeat or complete the ultrasound evaluation." },
        { category: "O-RADS US 1", risk: "Normal (≈0%)", management: "Physiologic premenopausal finding; no follow-up." },
        { category: "O-RADS US 2", risk: "Almost certainly benign (<1%)", management: "Often none; some lesions warrant follow-up by type and size." },
        { category: "O-RADS US 3", risk: "Low (1 to <10%)", management: "Ultrasound specialist, follow-up, or MRI per context." },
        { category: "O-RADS US 4", risk: "Intermediate (10 to <50%)", management: "Consider MRI and gynecologic (oncology) specialist referral." },
        { category: "O-RADS US 5", risk: "High (≥50%)", management: "Gynecologic oncology referral." },
      ],
      rulesHeading: "Key decision rules (US v2022)",
      rules: [
        "Lesion type (physiologic, cystic [uni-, bi-, multilocular], or solid) and the presence of any solid component protruding ≥3 mm are the primary branch points.",
        "Color score (1–4) grades vascularity and modifies the category for multilocular cysts and lesions with solid tissue.",
        "A unilocular cyst with a solid component and ≥4 papillary projections is O-RADS 5; fewer projections (or a non-papillary solid component) is O-RADS 4.",
        "A smooth solid lesion with a low color score is typically O-RADS 3–4; an irregular contour or color score 3–4 raises the category.",
        "Ascites and/or peritoneal nodules not otherwise explained are O-RADS 5.",
      ],
    },
    criteriaMri: {
      heading: "O-RADS MRI 2022 — risk scores",
      caption:
        "Estimated positive predictive value (PPV) by ACR O-RADS MRI 2022 score — a different risk framework from O-RADS US despite the shared 0–5 scale.",
      columnLabels: { category: "Score", risk: "Approx. PPV for malignancy", management: "Typical management" },
      categories: [
        { category: "O-RADS MRI 0", risk: "Incomplete", management: "Repeat or complete the MRI evaluation." },
        { category: "O-RADS MRI 1", risk: "Normal ovaries", management: "No adnexal lesion; no follow-up." },
        { category: "O-RADS MRI 2", risk: "Almost certainly benign (PPV ≈0.5%)", management: "Usually none." },
        { category: "O-RADS MRI 3", risk: "Low risk (PPV ~5%)", management: "Management individualized by clinical context." },
        { category: "O-RADS MRI 4", risk: "Intermediate risk (PPV ~50%)", management: "Gynecologic specialist evaluation." },
        { category: "O-RADS MRI 5", risk: "High risk (PPV ~90%)", management: "Gynecologic oncology referral." },
      ],
      rulesHeading: "Key decision rules (MRI 2022)",
      rules: [
        "The presence and dynamic enhancement of solid tissue drive the score.",
        "Lesions without enhancing solid tissue (simple or benign-type fluid, fat, or fibrous tissue) fall in O-RADS MRI 1–3.",
        "Solid tissue that is homogeneously dark on T2 and on high-b-value DWI (fibrous) is O-RADS MRI 2 (benign).",
        "Enhancing solid tissue is scored by its dynamic contrast-enhanced time-intensity curve: a low-risk curve is O-RADS 4 and a high-risk curve is O-RADS 5; without DCE, enhancement relative to the myometrium at 30–40 s is used.",
        "Peritoneal, mesenteric, or omental nodularity or irregular thickening is O-RADS MRI 5.",
      ],
    },
    faq: [
      {
        q: "What is O-RADS?",
        a: "O-RADS (Ovarian-Adnexal Reporting and Data System) is the ACR standard for stratifying the malignancy risk of ovarian and adnexal lesions, assigning a category from 0 (incomplete) and 1 (normal) through 5 (high risk, ≥50%). Separate systems exist for ultrasound (US v2022) and MRI (2022).",
      },
      {
        q: "How do the US and MRI systems differ?",
        a: "O-RADS US v2022 scores lesions from their sonographic lexicon descriptors (lesion type, size, inner wall, solid component, papillary projections, and color score). O-RADS MRI 2022 centers on the presence of enhancing solid tissue and its dynamic contrast-enhanced time-intensity curve, with a dedicated benign category for homogeneously dark-T2/dark-DWI (fibrous) tissue.",
      },
      {
        q: "Is this a medical device?",
        a: "No. It is for educational and research purposes only, is not a regulatory-cleared medical device, and does not replace professional medical judgment.",
      },
    ],
  },
  ko: {
    badge: "Aperivue RADS",
    title: "난소-부속기 리포트 생성기",
    subtitle: "O-RADS US v2022 & MRI 2022 기반 구조화 리포트 · 다중 병변 · PACS 바로 복사",
    disclaimer:
      "이 도구는 교육 및 연구 목적으로만 사용됩니다. 의료기기가 아니며 FDA, KFDA/MFDS 또는 어떤 규제 기관의 허가도 받지 않았습니다. 임상적 진단이나 치료 결정에 사용될 수 없으며, 전문적인 의학적 판단을 대체하지 않습니다. O-RADS는 위험도 분류이며, 관리는 임상 위험 인자, 증상, 전문적 판단에 따라 개별화됩니다. 항상 임상 소견 및 기관 프로토콜과 함께 판단하십시오.",
    reference:
      "참고문헌: Strachowski LM, et al. O-RADS US v2022: An Update from the ACR O-RADS US Committee. Radiology. 2023;308(3):e230685. Sadowski EA, Thomassin-Naggara I, et al. O-RADS MRI Risk Stratification System. Radiology. 2022;303(1):35-47.",
    mwpName: "O-RADS 계산기 및 리포트 생성기",
    mwpDescription:
      "O-RADS US v2022 및 MRI 2022 기반 난소-부속기 구조화 리포트 생성기.",
    criteriaUs: {
      heading: "O-RADS US v2022 — 평가 카테고리",
      caption:
        "ACR O-RADS US v2022 카테고리별 악성 위험도. 0–5 척도는 O-RADS MRI와 공유하지만 위험도 근거 체계는 다릅니다.",
      columnLabels: { category: "카테고리", risk: "악성 위험도", management: "일반적 관리" },
      categories: [
        { category: "O-RADS US 0", risk: "불완전", management: "초음파 평가를 재시행하거나 완료합니다." },
        { category: "O-RADS US 1", risk: "정상 (약 0%)", management: "폐경 전 생리적 소견; 추적 불필요." },
        { category: "O-RADS US 2", risk: "거의 확실히 양성 (<1%)", management: "대개 불필요; 유형·크기에 따라 일부는 추적." },
        { category: "O-RADS US 3", risk: "저위험 (1–<10%)", management: "초음파 전문의, 추적, 또는 MRI를 상황에 따라 고려." },
        { category: "O-RADS US 4", risk: "중간 위험 (10–<50%)", management: "MRI 및 부인과(종양) 전문의 의뢰 고려." },
        { category: "O-RADS US 5", risk: "고위험 (≥50%)", management: "부인과 종양 전문의 의뢰." },
      ],
      rulesHeading: "핵심 결정 규칙 (US v2022)",
      rules: [
        "병변 유형(생리적, 낭성[단방·이방·다방], 고형)과 ≥3 mm 돌출하는 고형 성분의 유무가 1차 분기점입니다.",
        "Color score(1–4)는 혈류를 등급화하며 다방성 낭종 및 고형 조직을 가진 병변의 카테고리를 조정합니다.",
        "고형 성분과 ≥4개의 papillary projection을 가진 단방성 낭종은 O-RADS 5이며, 그보다 적거나 비유두상 고형 성분이면 O-RADS 4입니다.",
        "Color score가 낮은 매끈한 고형 병변은 대개 O-RADS 3–4이며, 불규칙한 윤곽이나 color score 3–4는 카테고리를 높입니다.",
        "달리 설명되지 않는 복수 및/또는 복막 결절은 O-RADS 5입니다.",
      ],
    },
    criteriaMri: {
      heading: "O-RADS MRI 2022 — 위험도 점수",
      caption:
        "ACR O-RADS MRI 2022 점수별 추정 양성예측도(PPV) — 0–5 척도는 같지만 O-RADS US와 다른 위험도 체계입니다.",
      columnLabels: { category: "점수", risk: "악성에 대한 대략적 PPV", management: "일반적 관리" },
      categories: [
        { category: "O-RADS MRI 0", risk: "불완전", management: "MRI 평가를 재시행하거나 완료합니다." },
        { category: "O-RADS MRI 1", risk: "정상 난소", management: "부속기 병변 없음; 추적 불필요." },
        { category: "O-RADS MRI 2", risk: "거의 확실히 양성 (PPV ≈0.5%)", management: "대개 불필요." },
        { category: "O-RADS MRI 3", risk: "저위험 (PPV 약 5%)", management: "임상 상황에 따라 개별화." },
        { category: "O-RADS MRI 4", risk: "중간 위험 (PPV 약 50%)", management: "부인과 전문의 평가." },
        { category: "O-RADS MRI 5", risk: "고위험 (PPV 약 90%)", management: "부인과 종양 전문의 의뢰." },
      ],
      rulesHeading: "핵심 결정 규칙 (MRI 2022)",
      rules: [
        "고형 조직의 존재와 동적 조영증강이 점수를 결정합니다.",
        "조영증강되는 고형 조직이 없는 병변(단순·양성형 액체, 지방, 섬유 조직)은 O-RADS MRI 1–3에 해당합니다.",
        "T2와 고 b-value DWI에서 모두 균일하게 어두운 고형 조직(섬유성)은 O-RADS MRI 2(양성)입니다.",
        "조영증강되는 고형 조직은 동적조영증강 time-intensity curve로 점수화합니다: 저위험 곡선은 O-RADS 4, 고위험 곡선은 O-RADS 5이며, DCE가 없으면 30–40초에서 자궁근층 대비 조영증강 정도를 사용합니다.",
        "복막·장간막·대망의 결절성 또는 불규칙 비후는 O-RADS MRI 5입니다.",
      ],
    },
    faq: [
      {
        q: "O-RADS란 무엇인가요?",
        a: "O-RADS(난소-부속기 영상 보고 데이터 시스템)는 난소 및 부속기 병변의 악성 위험도를 분류하는 ACR 표준으로, 0(불완전)·1(정상)부터 5(고위험, ≥50%)까지 카테고리를 부여합니다. 초음파(US v2022)와 MRI(2022)에 대해 별도의 시스템이 있습니다.",
      },
      {
        q: "US와 MRI 시스템은 어떻게 다른가요?",
        a: "O-RADS US v2022는 초음파 lexicon 기술자(병변 유형, 크기, 내벽, 고형 성분, 유두상 돌기, color score)로 점수를 매깁니다. O-RADS MRI 2022는 조영증강되는 고형 조직의 존재와 동적조영증강 시간-신호강도 곡선(TIC)을 중심으로 하며, T2/DWI에서 균일하게 어두운(섬유성) 조직에 대한 별도 양성 카테고리를 둡니다.",
      },
      {
        q: "의료기기인가요?",
        a: "아닙니다. 교육 및 연구 목적의 도구이며, 규제 인증을 받은 의료기기가 아니고, 전문적인 의학적 판단을 대체하지 않습니다.",
      },
    ],
  },
} as const;

export default async function OradsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as "en" | "ko";
  const t = PAGE_TEXT[locale];

  const radsMeta = RADS_BY_SLUG["orads"];
  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.mwpName,
    description: t.mwpDescription,
    url: ogUrl(lang, "/rads/orads"),
    inLanguage: locale,
    about: { "@type": "MedicalTest", name: "Ovarian-Adnexal O-RADS assessment" },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: radsMeta.datePublished,
    dateModified: DATE_MODIFIED,
    citation: radsMeta.citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "orads"));

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
          <p className="text-xs font-medium uppercase tracking-widest text-accent">{t.badge}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
          <p className="mt-3 text-sm text-foreground/60">{t.subtitle}</p>
        </div>

        <AdnexalReportGenerator locale={locale} />

        <CriteriaSection content={t.criteriaUs} />
        <CriteriaSection content={t.criteriaMri} />

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
