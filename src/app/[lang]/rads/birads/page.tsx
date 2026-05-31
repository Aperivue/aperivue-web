import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import BreastReportGenerator from "./BreastReportGenerator";
import { buildAlternates, ogUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            {t.badge}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-sm text-foreground/60">{t.subtitle}</p>
        </div>

        <BreastReportGenerator locale={locale} />

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
