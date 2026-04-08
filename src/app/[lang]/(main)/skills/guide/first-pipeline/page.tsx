import type { Metadata } from "next";
import Link from "next/link";
import StepCard from "@/components/guide/StepCard";

export const metadata: Metadata = {
  title: "첫 파이프라인 실행 — MedSci Skills 가이드",
  description:
    "공개 데이터로 논문 초고, Figure 4개, STARD 감사, PPT 슬라이드까지 자동 생성하는 end-to-end 데모.",
};

export default async function FirstPipelinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Step 2. 첫 파이프라인 실행</h1>
      <p className="mt-2 text-foreground/60">
        sklearn의 유방암 공개 데이터셋으로 end-to-end 파이프라인을 실행합니다.
        <br />
        데이터 다운로드 없이 바로 시작할 수 있습니다.
      </p>

      {/* What you'll get */}
      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-semibold text-primary">이 데모에서 나오는 결과물</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">논문 초고</p>
            <p className="mt-1 text-foreground/50">
              IMRAD 구조, ~2,200 단어, DOCX/PDF
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">Figure 4개</p>
            <p className="mt-1 text-foreground/50">
              ROC 곡선, Confusion Matrix, 300 DPI
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">STARD 감사 보고서</p>
            <p className="mt-1 text-foreground/50">
              30개 항목 점검, 수정 제안 포함
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">발표 슬라이드</p>
            <p className="mt-1 text-foreground/50">
              12장 PPTX, 발표자 노트 포함
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="mt-8 space-y-6">
        <StepCard number={1} title="Claude Code Desktop에 프롬프트 입력">
          <p>Claude Code Desktop을 열고 다음을 입력합니다:</p>
          <div className="mt-3 rounded-lg border border-border bg-surface p-4">
            <code className="block whitespace-pre-wrap text-sm text-foreground/80">
              {`/orchestrate sklearn의 load_breast_cancer 데이터로 진단 정확도 연구를 end-to-end로 실행해줘. 분석, Figure, 논문 초고, STARD 감사, 발표 슬라이드까지 전부.`}
            </code>
          </div>
          <p className="mt-3 text-xs text-foreground/40">
            한국어로 입력해도 됩니다. Claude가 자동으로 이해합니다.
          </p>
        </StepCard>

        <StepCard number={2} title="파이프라인 자동 실행 관찰">
          <p>
            Claude가 다음 순서로 스킬을 자동 체이닝합니다. 중간에 권한 요청이
            나오면 &quot;Allow&quot;를 눌러주세요.
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">1.</span>
              <span>
                <strong>analyze-stats</strong> — 데이터 로드, Table 1 생성, 3개 모델(LR, RF, SVM)
                학습 및 비교
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">2.</span>
              <span>
                <strong>make-figures</strong> — ROC 곡선, Confusion Matrix,
                Calibration Plot 등 Figure 4개 생성
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">3.</span>
              <span>
                <strong>write-paper</strong> — IMRAD 구조 논문 초고 작성 (Title,
                Abstract, Introduction, Methods, Results, Discussion)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">4.</span>
              <span>
                <strong>check-reporting</strong> — STARD 2015 체크리스트 30개
                항목 감사
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">5.</span>
              <span>
                <strong>present-paper</strong> — 12장 PPTX 슬라이드 + 발표자 노트
              </span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-foreground/40">
            전체 소요 시간: 약 5분 (네트워크 속도에 따라 다름)
          </p>
        </StepCard>

        <StepCard number={3} title="결과물 확인">
          <p>
            파이프라인이 완료되면 Claude가 결과물 위치를 알려줍니다. 일반적으로
            현재 작업 폴더에 저장됩니다.
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <p>주요 파일:</p>
            <ul className="space-y-1 text-foreground/60">
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">manuscript_draft.docx</code>{" "}
                — 논문 초고
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">figures/</code>{" "}
                — ROC, Confusion Matrix 등 300 DPI 이미지
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">stard_compliance_report.md</code>{" "}
                — STARD 감사 결과
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">presentation.pptx</code>{" "}
                — 발표 슬라이드
              </li>
            </ul>
          </div>
        </StepCard>

        <StepCard number={4} title="직접 해보기: 내 데이터 사용">
          <p>
            데모가 잘 작동했다면 이제 본인 데이터로 시도해보세요:
          </p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">CSV/Excel 데이터가 있다면</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /orchestrate data.csv 파일로 진단 정확도 연구를 진행해줘
                </code>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">논문 초고가 있다면</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /check-reporting manuscript.docx를 STROBE 가이드라인으로 감사해줘
                </code>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">아직 주제만 있다면</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /search-lit &quot;AI 폐결절 진단 정확도&quot; 관련 문헌을 PubMed에서 검색해줘
                </code>
              </div>
            </div>
          </div>
        </StepCard>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/install`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; 이전: 설치
        </Link>
        <Link
          href={`/${lang}/skills/guide/skills`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          다음: 상황별 스킬 안내 &rarr;
        </Link>
      </div>
    </div>
  );
}
