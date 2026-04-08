import type { Metadata } from "next";
import GuideNav from "@/components/guide/GuideNav";

export const metadata: Metadata = {
  title: "MedSci Skills 시작 가이드 | Aperivue",
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
    description:
      "코딩 경험 없는 의사도 10분이면 시작할 수 있습니다. Claude Code Desktop + 20개 연구 스킬.",
    url: "https://aperivue.com/skills/guide",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-16">
      <div className="grid gap-8 md:grid-cols-[12rem_1fr]">
        <aside>
          <GuideNav />
        </aside>
        <article className="min-w-0" lang="ko">
          {children}
        </article>
      </div>
    </main>
  );
}
