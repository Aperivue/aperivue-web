import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import AdnexalReportGenerator from "./AdnexalReportGenerator";
import { buildAlternates, ogUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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

  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.mwpName,
    description: t.mwpDescription,
    url: ogUrl(lang, "/rads/orads"),
    inLanguage: locale,
    about: { "@type": "MedicalTest", name: "Ovarian-Adnexal O-RADS assessment" },
  };

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
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">{t.badge}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
          <p className="mt-3 text-sm text-foreground/60">{t.subtitle}</p>
        </div>

        <AdnexalReportGenerator locale={locale} />

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
