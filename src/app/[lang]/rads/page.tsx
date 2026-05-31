import type { Metadata } from "next";
import Link from "next/link";
import { hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates, ogUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Aperivue RADS — Radiology Scoring & Structured Reporting",
    description:
      "Free structured radiology report generators for TI-RADS, Lung-RADS, BI-RADS, and LI-RADS. Evidence-based scoring calculators with PACS-ready output.",
    alternates: buildAlternates(lang, "/rads"),
  };
}

const modulesEn = [
  {
    name: "TI-RADS",
    description:
      "Thyroid ultrasound structured reporting with ACR TI-RADS, K-TIRADS, and EU-TIRADS scoring. Multi-nodule support and FNA criteria.",
    status: "live" as const,
  },
  {
    name: "Lung-RADS",
    description:
      "Lung cancer screening CT report generator with Lung-RADS v2022. Solid, part-solid, and ground-glass nodule classification.",
    status: "live" as const,
  },
  {
    name: "BI-RADS",
    description:
      "Breast imaging structured reporting with BI-RADS assessment categories for mammography, ultrasound, and MRI. Multi-finding support and PACS-ready report.",
    status: "live" as const,
  },
  {
    name: "LI-RADS",
    description:
      "Liver imaging reporting and data system for CT and MRI. HCC diagnostic algorithm with ancillary features.",
    status: "coming" as const,
  },
];

const modulesKo = [
  {
    name: "TI-RADS",
    description:
      "ACR TI-RADS, K-TIRADS, EU-TIRADS 기반 갑상선 초음파 구조화 리포트. 다중 결절 지원 및 FNA 기준 포함.",
    status: "live" as const,
  },
  {
    name: "Lung-RADS",
    description:
      "Lung-RADS v2022 기반 폐암 선별 CT 리포트 생성. 고형, 부분 고형, 간유리 결절 분류.",
    status: "live" as const,
  },
  {
    name: "BI-RADS",
    description:
      "유방 영상 구조화 리포트. 유방촬영, 초음파 및 MRI를 위한 BI-RADS 평가 카테고리. 다중 소견 지원 및 PACS 바로 복사.",
    status: "live" as const,
  },
  {
    name: "LI-RADS",
    description:
      "CT 및 MRI 기반 간 영상 리포팅 시스템. 보조 소견을 포함한 HCC 진단 알고리즘.",
    status: "coming" as const,
  },
];

const uiText = {
  en: {
    tagline: "Structured Radiology Reporting",
    subtitle: "Free, evidence-based scoring calculators with structured report generation. Built by a radiologist, for radiologists.",
    live: "Live",
    coming: "Coming Soon",
    open: "Open calculator",
  },
  ko: {
    tagline: "구조화된 영상의학 리포트",
    subtitle: "무료 근거 기반 스코어링 계산기와 구조화 리포트 생성. 영상의학과 의사가 직접 만들었습니다.",
    live: "운영 중",
    coming: "준비 중",
    open: "계산기 열기",
  },
};

const modulesMeta = [
  {
    href: "/rads/tirads",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3-7 4 14 3-7h4" />
      </svg>
    ),
  },
  {
    href: "/rads/lungrads",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    href: "/rads/birads",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    href: "#",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default async function RadsLandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as "en" | "ko";
  const t = uiText[locale];
  const modules = locale === "ko" ? modulesKo : modulesEn;

  const medicalWebPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Aperivue RADS — Radiology Scoring & Structured Reporting",
    description: t.subtitle,
    url: ogUrl(lang, "/rads"),
    inLanguage: locale,
    about: { "@type": "Thing", name: "Radiology reporting and data systems (RADS)" },
  };

  const faq =
    locale === "ko"
      ? [
          {
            q: "Aperivue RADS는 무료인가요?",
            a: "예. 모든 계산기는 무료이며 브라우저에서 바로 사용할 수 있습니다.",
          },
          {
            q: "어떤 RADS 시스템을 지원하나요?",
            a: "TI-RADS, Lung-RADS, BI-RADS가 현재 운영 중이며 LI-RADS는 준비 중입니다.",
          },
          {
            q: "의료기기인가요?",
            a: "아닙니다. 교육 및 연구 목적의 도구이며, 임상 진단이나 치료 결정을 대체하지 않습니다.",
          },
        ]
      : [
          {
            q: "Is Aperivue RADS free?",
            a: "Yes. Every calculator is free and runs directly in your browser.",
          },
          {
            q: "Which RADS systems are supported?",
            a: "TI-RADS, Lung-RADS, and BI-RADS are live; LI-RADS is coming soon.",
          },
          {
            q: "Is this a medical device?",
            a: "No. It is an educational and research tool and does not replace clinical diagnosis or treatment decisions.",
          },
        ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={medicalWebPageJsonLd} />
      <JsonLd data={faqJsonLd} />
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {t.tagline}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Aperivue{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RADS
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          {t.subtitle}
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {modules.map((mod, i) => {
          const meta = modulesMeta[i];
          const isLive = mod.status === "live";

          const cardClassName = `group relative flex flex-col rounded-2xl border p-8 transition-all ${
            isLive
              ? "border-border bg-surface hover:border-primary/30 hover:shadow-lg cursor-pointer"
              : "border-border/50 bg-surface/50 opacity-70"
          }`;

          const inner = (
            <>
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isLive ? "bg-primary/10 text-primary" : "bg-muted text-foreground/30"
                }`}>
                  {meta.icon}
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    isLive
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-foreground/5 text-foreground/40"
                  }`}
                >
                  {isLive ? t.live : t.coming}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-semibold">{mod.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60">
                {mod.description}
              </p>

              {isLive && (
                <p className="mt-5 text-sm font-medium text-primary group-hover:underline">
                  {t.open} &rarr;
                </p>
              )}
            </>
          );

          return isLive ? (
            <Link key={mod.name} href={`/${lang}${meta.href}`} className={cardClassName}>
              {inner}
            </Link>
          ) : (
            <div key={mod.name} className={cardClassName}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
