import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "커스터마이즈 — MedSci Skills 가이드",
  description: "스킬을 수정하거나 나만의 스킬을 만들어 자율적으로 발전시키는 방법.",
};

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Step 4. 커스터마이즈</h1>
      <p className="mt-2 text-foreground/60">
        스킬은 그냥 텍스트 파일입니다. 누구나 수정하고 새로 만들 수 있습니다.
      </p>

      {/* SKILL.md anatomy */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">스킬의 구조</h2>
        <p className="mt-2 text-sm text-foreground/60">
          모든 스킬은 하나의 폴더 안에 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code> 파일로
          구성됩니다. 이 파일이 Claude에게 &quot;이 상황에서 이렇게 행동해라&quot;는 지침서입니다.
        </p>
        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium text-foreground/50">SKILL.md 기본 구조</p>
          <pre className="mt-3 overflow-x-auto text-sm leading-relaxed text-foreground/70">
{`---
name: my-custom-skill
description: 내 병원에 맞는 보고서 양식 생성
triggers:
  - "보고서"
  - "report"
tools:
  - Read
  - Write
  - Edit
---

# 규칙

1. 사용자가 보고서를 요청하면 다음 양식을 따릅니다.
2. 환자 정보는 익명화합니다.
3. 결론은 반드시 근거를 포함합니다.

# 양식

## 제목
## 소견
## 결론
## 참고문헌`}
          </pre>
        </div>
        <div className="mt-4 space-y-2 text-sm text-foreground/60">
          <p>
            <strong>name</strong> — 스킬 이름 (폴더 이름과 같게)
          </p>
          <p>
            <strong>description</strong> — Claude가 이 스킬의 용도를 이해하는 데 사용
          </p>
          <p>
            <strong>triggers</strong> — 이 단어가 포함되면 자동으로 이 스킬이 활성화
          </p>
          <p>
            <strong>tools</strong> — 이 스킬이 사용할 수 있는 도구 목록
          </p>
          <p>
            <strong>본문</strong> — Claude에게 주는 구체적인 지침 (자연어)
          </p>
        </div>
      </section>

      {/* How to modify */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">기존 스킬 수정하기</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70">
          <p>
            1. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code> 안의 원하는 스킬 폴더를 엽니다.
          </p>
          <p>
            2. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code>를 일반 텍스트 편집기(메모장, TextEdit)로 엽니다.
          </p>
          <p>
            3. 원하는 부분을 수정합니다. 예를 들어:
          </p>
          <ul className="ml-6 space-y-1 list-disc text-foreground/60">
            <li>기본 언어를 한국어로 변경</li>
            <li>특정 저널 양식에 맞게 포맷 수정</li>
            <li>병원 내부 규정에 맞는 규칙 추가</li>
          </ul>
          <p>
            4. 저장 후 Claude Code Desktop을 재시작합니다.
          </p>
        </div>
      </section>

      {/* How to create */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">나만의 스킬 만들기</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70">
          <p>
            1. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>에 새 폴더를 만듭니다.
          </p>
          <div className="rounded-lg border border-border bg-surface p-3">
            <code className="text-xs text-foreground/80">
              ~/.claude/skills/my-report-template/
            </code>
          </div>
          <p>
            2. 그 안에 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code> 파일을 만들고
            위 양식대로 작성합니다.
          </p>
          <p>
            3. Claude Code Desktop을 재시작하면 새 스킬이 자동으로 로드됩니다.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">팁</p>
          <p className="mt-1 text-sm text-foreground/60">
            기존 스킬을 복사한 뒤 수정하면 더 빠릅니다. 예를 들어{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">check-reporting</code> 폴더를
            복사해서 이름을 바꾸고, 체크리스트만 자기 병원 기준으로 수정할 수 있습니다.
          </p>
        </div>
      </section>

      {/* How to update */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">스킬 업데이트</h2>
        <p className="mt-2 text-sm text-foreground/60">
          MedSci Skills는 지속적으로 개선됩니다. 최신 버전으로 업데이트하려면:
        </p>
        <div className="mt-4 space-y-2 text-sm text-foreground/70">
          <p>
            1. GitHub에서 최신 ZIP을 다시 다운로드합니다.
          </p>
          <p>
            2. 새 ZIP의 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills/</code> 폴더를
            기존 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>에 덮어쓰기합니다.
          </p>
          <p className="text-xs text-foreground/40">
            직접 수정한 스킬이 있다면 덮어쓰기 전에 백업하세요.
          </p>
        </div>
      </section>

      {/* Harness concept */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">Orchestrate의 역할</h2>
        <p className="mt-2 text-sm text-foreground/60">
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">orchestrate</code> 스킬은
          다른 모든 스킬의 교통정리 역할을 합니다. 사용자가 무엇을 원하는지
          파악하고 적절한 스킬로 자동 라우팅합니다.
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          나만의 스킬을 추가해도 orchestrate가 자동으로 인식합니다.
          새 스킬의 <code className="rounded bg-surface px-1.5 py-0.5 text-xs">triggers</code>와{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">description</code>만
          잘 작성하면 됩니다.
        </p>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/skills`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; 이전: 상황별 스킬 안내
        </Link>
        <Link
          href={`/${lang}/skills/guide/faq`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          FAQ &rarr;
        </Link>
      </div>
    </div>
  );
}
