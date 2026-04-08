import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Products",
  description: "Aperivue products — Aperivue RADS for structured radiology reporting.",
};

const productsEn = [
  {
    name: "Aperivue RADS",
    status: "In Development",
    description:
      "Unified scoring calculator for TI-RADS, BI-RADS, Lung-RADS, LI-RADS, and more. Generate structured radiology reports with evidence-based recommendations.",
    features: [
      "Multi-system RADS scoring in one interface",
      "Structured report generation",
      "Evidence-based management recommendations",
      "Web, desktop, and mobile (planned)",
    ],
    link: "/rads",
    cta: "Try it",
  },
  {
    name: "ScrubCode",
    status: "Active",
    description:
      "YouTube channel covering Medical AI papers and deep learning foundations. AI-generated visuals with expert-curated scripts.",
    features: [
      "Medical AI paper breakdowns",
      "Deep learning fundamentals",
      "Weekly long-form + clips",
    ],
    link: "https://youtube.com/@scrubcode",
    cta: "Visit",
  },
  {
    name: "MedGlow",
    status: "Coming Soon",
    description:
      "K-beauty meets dermatology science. Evidence-based skincare content for Korean and global audiences.",
    features: [
      "Dermatology science explainers",
      "Korean + English subtitles",
      "Ingredient deep-dives",
    ],
  },
];

const productsKo = [
  {
    name: "Aperivue RADS",
    status: "개발 중",
    description:
      "TI-RADS, BI-RADS, Lung-RADS, LI-RADS 통합 스코어링 계산기. 근거 기반 권고와 함께 구조화된 영상의학 리포트를 생성합니다.",
    features: [
      "하나의 인터페이스에서 모든 RADS 스코어링",
      "구조화된 리포트 생성",
      "근거 기반 관리 권고",
      "웹, 데스크탑, 모바일 (예정)",
    ],
    link: "/rads",
    cta: "사용해보기",
  },
  {
    name: "ScrubCode",
    status: "운영 중",
    description:
      "Medical AI 논문과 딥러닝 기초를 다루는 YouTube 채널. AI 생성 시각 자료와 전문가가 큐레이션한 스크립트.",
    features: [
      "Medical AI 논문 해설",
      "딥러닝 기초 강의",
      "주간 롱폼 + 클립",
    ],
    link: "https://youtube.com/@scrubcode",
    cta: "채널 방문",
  },
  {
    name: "MedGlow",
    status: "준비 중",
    description:
      "K-뷰티와 피부과학의 만남. 한국과 글로벌 오디언스를 위한 근거 기반 스킨케어 콘텐츠.",
    features: [
      "피부과학 해설",
      "한국어 + 영어 자막",
      "성분 심층 분석",
    ],
  },
];

const productsData = { en: productsEn, ko: productsKo };

function statusBadge(status: string) {
  if (status === "Active" || status === "운영 중")
    return "bg-green-500/10 text-green-600 dark:text-green-400";
  if (status === "In Development" || status === "개발 중")
    return "bg-accent/10 text-accent";
  return "bg-foreground/5 text-foreground/50";
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).products;
  const products = productsData[lang as Locale];

  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        {t.title}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 text-foreground/60">
        {t.description}
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${statusBadge(product.status)}`}
              >
                {product.status}
              </span>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
              {product.description}
            </p>
            <ul className="mt-5 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                  <span className="mt-0.5 text-primary">&#x2713;</span>
                  {f}
                </li>
              ))}
            </ul>
            {"link" in product && product.link && (
              product.link.startsWith("/") ? (
                <Link
                  href={`/${lang}${product.link}`}
                  className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {"cta" in product ? product.cta : ""} &rarr;
                </Link>
              ) : (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {"cta" in product ? product.cta : ""} &rarr;
                </a>
              )
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
