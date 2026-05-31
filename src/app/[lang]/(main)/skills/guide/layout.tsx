import type { Metadata } from "next";
import GuideNav from "@/components/guide/GuideNav";
import { DEFAULT_OG_IMAGES, SKILL_COUNT } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MedSci Skills 시작 가이드", // bare; root template adds " | Aperivue"
  description:
    "코딩 경험 없는 의사를 위한 MedSci Skills 설치 및 사용 가이드. Claude Code Desktop에서 논문 작성, 통계 분석, 보고 가이드라인 감사까지.",
  keywords: [
    "claude code",
    "의학 연구",
    "논문 작성",
    "medsci skills",
    "가이드",
    "설치",
    "의사",
    "비개발자",
  ],
  openGraph: {
    title: "MedSci Skills 시작 가이드",
    description: `코딩 경험 없는 의사도 10분이면 시작할 수 있습니다. Claude Code Desktop + ${SKILL_COUNT}개 연구 스킬.`,
    // og:url intentionally omitted — this layout's openGraph is inherited by guide
    // subpages; a fixed url would leak to all of them. Per-page canonical handles dedup.
    images: DEFAULT_OG_IMAGES,
  },
};

export default async function GuideLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <div className="grid w-full gap-8 md:grid-cols-[12rem_minmax(0,1fr)]">
        <aside className="max-w-full overflow-x-auto md:sticky md:top-24 md:self-start">
          <GuideNav />
        </aside>
        <article className="min-w-0 max-w-full break-words" lang={lang}>
          {children}
        </article>
      </div>
    </main>
  );
}
