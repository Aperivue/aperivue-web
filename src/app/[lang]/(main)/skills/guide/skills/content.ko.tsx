import Link from "next/link";

const categories = [
  {
    emoji: "1",
    title: "아직 주제만 있어요",
    description: "연구 주제는 있지만 구체적인 계획이 없는 단계",
    skills: [
      {
        name: "search-lit",
        label: "문헌 검색",
        prompt: '/search-lit "주제 키워드" 관련 최근 5년 문헌을 검색해줘',
        note: "PubMed + Semantic Scholar. 모든 인용은 API로 검증 — 날조 제로",
      },
      {
        name: "design-study",
        label: "연구 설계 검토",
        prompt: "/design-study 이 연구 계획의 설계를 검토해줘",
        note: "분석 단위, 데이터 누출 위험, 비교군 설계 점검",
      },
      {
        name: "calc-sample-size",
        label: "표본 크기 계산",
        prompt: "/calc-sample-size 민감도 90% 이상을 검정하려면 몇 명이 필요해?",
        note: "검정력 분석 + IRB 제출용 근거 문장 자동 생성",
      },
      {
        name: "write-protocol",
        label: "프로토콜 작성",
        prompt: "/write-protocol 이 연구의 IRB 프로토콜을 작성해줘",
        note: "SPIRIT 기반 4개 핵심 섹션 + TODO 마커",
      },
    ],
  },
  {
    emoji: "2",
    title: "데이터가 있어요",
    description: "CSV/Excel 데이터가 있고 분석을 시작하려는 단계",
    skills: [
      {
        name: "clean-data",
        label: "데이터 정리",
        prompt: "/clean-data data.csv 파일을 프로파일링하고 정리해줘",
        note: "결측치, 이상치, 중복 탐지. 3단계(프로파일→플래그→코드) 승인 게이트",
      },
      {
        name: "analyze-stats",
        label: "통계 분석",
        prompt: "/analyze-stats 이 데이터로 진단 정확도를 분석해줘",
        note: "DeLong CI, Wilson 구간, survey weight 등 올바른 통계 기법 자동 선택",
      },
      {
        name: "make-figures",
        label: "Figure 생성",
        prompt: "/make-figures ROC 곡선과 Confusion Matrix를 그려줘",
        note: "300 DPI, 색각이상 안전 팔레트, 저널 투고 규격",
      },
    ],
  },
  {
    emoji: "3",
    title: "논문 초고를 쓰고 싶어요",
    description: "분석은 끝났고 원고를 작성/검토하려는 단계",
    skills: [
      {
        name: "write-paper",
        label: "논문 작성",
        prompt: "/write-paper 분석 결과로 IMRAD 논문을 작성해줘",
        note: "8단계 파이프라인. Results에 해석 혼입 자동 차단",
      },
      {
        name: "check-reporting",
        label: "보고 가이드라인 감사",
        prompt: "/check-reporting manuscript.docx를 STROBE로 감사해줘",
        note: "15개 가이드라인 지원 (STROBE, STARD, PRISMA, CONSORT, TRIPOD+AI 등)",
      },
      {
        name: "self-review",
        label: "셀프 리뷰",
        prompt: "/self-review 이 원고를 투고 전에 검토해줘",
        note: "리뷰어 관점 10개 카테고리 점검. Major/Minor 분류",
      },
      {
        name: "find-journal",
        label: "저널 추천",
        prompt: "/find-journal 이 원고에 적합한 저널을 추천해줘",
        note: "40개 저널 프로필과 의미론적 매칭",
      },
    ],
  },
  {
    emoji: "4",
    title: "리비전이 왔어요",
    description: "리뷰어 코멘트에 대응해야 하는 단계",
    skills: [
      {
        name: "revise",
        label: "리비전 대응",
        prompt: "/revise 리뷰어 코멘트를 파싱하고 point-by-point 응답을 작성해줘",
        note: "MAJOR/MINOR 자동 분류, 변경 로그 생성, 커버레터 포함",
      },
    ],
  },
  {
    emoji: "5",
    title: "메타분석을 하고 싶어요",
    description: "체계적 문헌고찰 + 메타분석 전 과정",
    skills: [
      {
        name: "meta-analysis",
        label: "메타분석",
        prompt: "/meta-analysis BCG 백신 메타분석을 진행해줘",
        note: "8단계: 프로토콜 → 검색 → 스크리닝 → 추출 → RoB → 합성 → 해석 → 보고",
      },
    ],
  },
  {
    emoji: "6",
    title: "학회 발표를 준비해요",
    description: "논문을 슬라이드로 만들어야 하는 단계",
    skills: [
      {
        name: "present-paper",
        label: "발표 준비",
        prompt: "/present-paper 이 논문으로 15분 발표 자료를 만들어줘",
        note: "청자 맞춤 스크립트, PPTX 노트 주입, Q&A 예상 질문",
      },
    ],
  },
];

export default function ContentKo({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 3. 상황별 스킬 안내</h1>
      <p className="mt-2 text-foreground/60">
        &quot;내 상황에서 어떤 스킬을 써야 하지?&quot; 아래에서 현재 단계에 맞는
        스킬을 찾으세요.
        <br />
        각 스킬의 예시 프롬프트를 그대로 복사해서 사용하면 됩니다.
      </p>

      <div className="mt-8 space-y-8">
        {categories.map((cat) => (
          <section
            key={cat.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {cat.emoji}
              </span>
              <div>
                <h2 className="text-lg font-semibold">{cat.title}</h2>
                <p className="text-sm text-foreground/50">{cat.description}</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{skill.label}</h3>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                      {skill.name}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/50">
                    {skill.note}
                  </p>
                  <div className="mt-3 rounded-lg border border-border bg-muted p-3">
                    <p className="text-xs text-foreground/40">예시 프롬프트</p>
                    <code className="mt-1 block text-sm text-foreground/70">
                      {skill.prompt}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Orchestrate tip */}
      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-semibold text-primary">
          어떤 스킬을 써야 할지 모르겠다면?
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">/orchestrate</code>에
          하고 싶은 일을 자연어로 설명하면 됩니다. Orchestrator가 자동으로 적절한
          스킬을 선택하고 실행합니다.
        </p>
        <div className="mt-3 rounded-lg border border-border bg-surface p-3">
          <code className="text-sm text-foreground/70">
            /orchestrate 이 CSV 데이터로 연구를 처음부터 끝까지 진행하고 싶어
          </code>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/first-pipeline`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; 이전: 첫 파이프라인
        </Link>
        <Link
          href={`/${lang}/skills/guide/customize`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          다음: 커스터마이즈 &rarr;
        </Link>
      </div>
    </div>
  );
}
