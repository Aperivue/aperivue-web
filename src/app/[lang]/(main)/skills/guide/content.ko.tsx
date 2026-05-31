import Link from "next/link";
import { SKILL_COUNT } from "@/lib/seo";

function getSteps(lang: string) {
  return [
    {
      number: 1,
      title: "설치",
      description: "Claude Code Desktop과 MedSci Skills를 설치합니다.",
      href: `/${lang}/skills/guide/install`,
      time: "10분",
    },
    {
      number: 2,
      title: "첫 파이프라인",
      description:
        "공개 데이터로 논문 초고, Figure, 보고 가이드라인 감사까지 한 번에 실행합니다.",
      href: `/${lang}/skills/guide/first-pipeline`,
      time: "5분",
    },
    {
      number: 3,
      title: "상황별 스킬 안내",
      description:
        "내 연구 상황에 맞는 스킬을 찾아 바로 사용합니다.",
      href: `/${lang}/skills/guide/skills`,
      time: "참고용",
    },
    {
      number: 4,
      title: "커스터마이즈",
      description:
        "스킬을 수정하거나 나만의 스킬을 만들어 자율적으로 발전시킵니다.",
      href: `/${lang}/skills/guide/customize`,
      time: "선택",
    },
  ];
}

export default function GuideContentKo({ lang }: { lang: string }) {
  return (
    <div>
      {/* Hero */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          가이드
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          코딩 경험 없는 의사를 위한
          <br />
          MedSci Skills 시작 가이드
        </h1>
        <p className="mt-4 text-foreground/60">
          터미널을 몰라도 괜찮습니다. Claude Code Desktop 앱을 설치하고, {SKILL_COUNT}개
          연구 스킬을 복사하면 끝입니다.
          <br />
          총 15분이면 첫 논문 초고가 나옵니다.
        </p>
      </section>

      {/* Prerequisites */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">시작 전 준비물</h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/70">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>Anthropic 계정</strong> — claude.ai에서 무료 가입
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>Claude 구독</strong> — Pro ($20/월) 또는 Max ($100/월).
              통계 분석과 Figure 생성에 필요합니다
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>노트북</strong> — macOS 또는 Windows
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-foreground/30">&#x25CB;</span>
            <span>
              (선택) 연구 데이터 (CSV/Excel) 또는 논문 초고 — 없으면 공개
              데이터로 연습합니다
            </span>
          </li>
        </ul>
      </section>

      {/* Steps */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">진행 순서</h2>
        <div className="mt-6 space-y-4">
          {getSteps(lang).map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {step.number}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold group-hover:text-primary">
                    {step.title}
                  </h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/40">
                    {step.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/60">
                  {step.description}
                </p>
              </div>
              <span className="mt-1 text-foreground/30 transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ link */}
      <section className="mt-10 text-center">
        <p className="text-sm text-foreground/50">
          문제가 생겼나요?{" "}
          <Link href={`/${lang}/skills/guide/faq`} className="text-primary underline">
            자주 묻는 질문
          </Link>
          을 확인하세요.
        </p>
      </section>
    </div>
  );
}
