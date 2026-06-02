import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import LiverReportGenerator from "./LiverReportGenerator";
import { buildAlternates, ogUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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

        <LiverReportGenerator locale={locale} />

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
