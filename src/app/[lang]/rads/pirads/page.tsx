import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "../../dictionaries";
import ProstateReportGenerator from "./ProstateReportGenerator";
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
    title: "PI-RADS Calculator & Report Generator — Prostate mpMRI PI-RADS v2.1",
    description:
      "Free prostate multiparametric MRI structured report generator with PI-RADS v2.1 scoring. Zone-aware assessment (PZ DWI-dominant, TZ T2W-dominant), DCE resolution, PSA density, multi-lesion, PACS-ready report.",
    keywords: [
      "PI-RADS",
      "PI-RADS calculator",
      "PI-RADS v2.1",
      "prostate MRI",
      "multiparametric MRI",
      "mpMRI",
      "prostate cancer",
      "DWI",
      "PSA density",
      "radiology calculator",
      "structured reporting",
      "PACS",
    ],
    alternates: buildAlternates(lang, "/rads/pirads"),
  };
}

const PAGE_TEXT = {
  en: {
    badge: "Aperivue RADS",
    title: "Prostate mpMRI Report Generator",
    subtitle: "Structured reporting with PI-RADS v2.1 · Zone-aware · Multi-lesion · PACS-ready output",
    disclaimer:
      "This tool is for educational and research purposes only. It is not a medical device and has not been cleared or approved by the FDA, KFDA/MFDS, or any regulatory authority. It is not intended for clinical diagnosis or treatment decisions. It does not replace professional medical judgment. PI-RADS is a risk category; biopsy decisions are made clinically. Always correlate with clinical findings and institutional protocols.",
    reference:
      "Reference: Turkbey B, et al. Prostate Imaging Reporting and Data System Version 2.1: 2019 Update of PI-RADS Version 2. Eur Urol. 2019;76(3):340-351.",
    mwpName: "PI-RADS Calculator & Report Generator",
    mwpDescription:
      "Free prostate multiparametric MRI structured report generator with PI-RADS v2.1 scoring.",
    faq: [
      {
        q: "What is PI-RADS?",
        a: "PI-RADS (Prostate Imaging Reporting and Data System) is the standard for assessing prostate multiparametric MRI, assigning each lesion a category from 1 (clinically significant cancer highly unlikely) to 5 (highly likely).",
      },
      {
        q: "How does zone affect scoring?",
        a: "In the peripheral zone, DWI is the dominant sequence and DCE resolves a DWI score of 3. In the transition zone, T2W is dominant: a T2W score of 2 is upgraded to PI-RADS 3 when DWI is ≥4, and a T2W score of 3 is upgraded to PI-RADS 4 when DWI is 5.",
      },
      {
        q: "Is this a medical device?",
        a: "No. It is for educational and research purposes only, is not a regulatory-cleared medical device, and does not replace professional medical judgment.",
      },
    ],
  },
  ko: {
    badge: "Aperivue RADS",
    title: "전립선 mpMRI 리포트 생성기",
    subtitle: "PI-RADS v2.1 기반 구조화 리포트 · 구역별 평가 · 다중 병변 · PACS 바로 복사",
    disclaimer:
      "이 도구는 교육 및 연구 목적으로만 사용됩니다. 의료기기가 아니며 FDA, KFDA/MFDS 또는 어떤 규제 기관의 허가도 받지 않았습니다. 임상적 진단이나 치료 결정에 사용될 수 없으며, 전문적인 의학적 판단을 대체하지 않습니다. PI-RADS는 위험도 분류이며, 생검 결정은 임상적으로 이루어집니다. 항상 임상 소견 및 기관 프로토콜과 함께 판단하십시오.",
    reference:
      "참고문헌: Turkbey B, et al. Prostate Imaging Reporting and Data System Version 2.1: 2019 Update of PI-RADS Version 2. Eur Urol. 2019;76(3):340-351.",
    mwpName: "PI-RADS 계산기 및 리포트 생성기",
    mwpDescription:
      "PI-RADS v2.1 기반 전립선 다중매개변수 MRI 구조화 리포트 생성기.",
    faq: [
      {
        q: "PI-RADS란 무엇인가요?",
        a: "PI-RADS(전립선 영상 보고 데이터 시스템)는 전립선 다중매개변수 MRI를 평가하는 표준으로, 각 병변에 1(임상적으로 유의한 암 가능성 매우 낮음)부터 5(매우 높음)까지 카테고리를 부여합니다.",
      },
      {
        q: "구역(zone)이 점수에 어떻게 영향을 주나요?",
        a: "말초대(PZ)에서는 DWI가 주 시퀀스이며 DWI 3점은 DCE로 결정됩니다. 이행대(TZ)에서는 T2W가 주 시퀀스이며, T2W 2점은 DWI가 ≥4이면 PI-RADS 3으로, T2W 3점은 DWI가 5이면 PI-RADS 4로 상향됩니다.",
      },
      {
        q: "의료기기인가요?",
        a: "아닙니다. 교육 및 연구 목적의 도구이며, 규제 인증을 받은 의료기기가 아니고, 전문적인 의학적 판단을 대체하지 않습니다.",
      },
    ],
  },
} as const;

export default async function PiradsPage({
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
    url: ogUrl(lang, "/rads/pirads"),
    inLanguage: locale,
    about: { "@type": "MedicalTest", name: "Prostate mpMRI PI-RADS assessment" },
    author: SITE_AUTHOR,
    reviewedBy: SITE_AUTHOR,
    lastReviewed: LAST_REVIEWED,
    datePublished: RADS_BY_SLUG["pirads"].datePublished,
    dateModified: DATE_MODIFIED,
    citation: RADS_BY_SLUG["pirads"].citation,
  };

  const breadcrumbJsonLd = buildBreadcrumb(lang, radsBreadcrumbItems(lang, "pirads"));

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

        <ProstateReportGenerator locale={locale} />

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
