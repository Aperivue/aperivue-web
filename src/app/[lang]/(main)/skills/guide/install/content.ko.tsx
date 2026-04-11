import Link from "next/link";
import StepCard from "@/components/guide/StepCard";
import OsTab from "@/components/guide/OsTab";

export default function InstallContentKo({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 1. 설치</h1>
      <p className="mt-2 text-foreground/60">
        Claude Code Desktop 앱을 설치하고, MedSci Skills 22개를 복사합니다.
        <br />
        터미널(명령어 입력 창)은 사용하지 않습니다.
      </p>

      {/* Quick Start */}
      <section className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
        <h2 className="text-lg font-bold text-primary">빠른 설치 — Claude에게 시키세요</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Claude Code가 이미 설치되어 있다면, 직접 다운로드할 필요 없습니다.
          아래 문장을 Claude Code에 그대로 붙여넣기 하세요:
        </p>

        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium text-foreground/40">Claude Code에 복사 &amp; 붙여넣기</p>
          <p className="mt-2 text-sm text-foreground/80">
            &quot;https://github.com/Aperivue/medsci-skills 에서 MedSci Skills를 설치해줘. 레포를 클론해서 스킬 폴더들을 ~/.claude/skills/에 복사해줘.&quot;
          </p>
        </div>

        <p className="mt-4 text-sm text-foreground/70">
          Claude가 알아서 레포지토리를 다운로드하고, 파일을 복사하고, 설치를 확인해줍니다.
          이게 끝입니다. 바로 스킬을 사용할 수 있습니다.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-muted p-4">
          <p className="text-xs font-medium text-foreground/40">자연어로 바로 사용해보세요</p>
          <div className="mt-2 space-y-2 text-sm text-foreground/80">
            <p>&quot;폐결절 AI 진단 관련 최신 논문 10편 찾아줘&quot;</p>
            <p>&quot;내 논문 원고를 STARD 2015 가이드라인으로 검사해줘&quot;</p>
            <p>&quot;이 CSV 파일로 인구통계학적 표를 만들어줘&quot;</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-foreground/40">
          슬래시 명령어를 외울 필요 없습니다. 하고 싶은 일을 평소 말하듯 설명하면,
          Claude가 알맞은 스킬을 자동으로 선택합니다.
        </p>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-foreground/30">또는 직접 설치하기</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-6 space-y-6">
        <StepCard number={1} title="Claude Code Desktop 다운로드">
          <p>
            Claude Code Desktop은 Anthropic이 만든 공식 데스크탑 앱입니다.
            터미널 대신 일반 앱처럼 사용할 수 있습니다.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-muted p-4">
            <p className="text-xs font-medium text-foreground/50">다운로드 링크</p>
            <p className="mt-1">
              <a
                href="https://claude.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                claude.ai/download
              </a>
              에서 본인 운영체제에 맞는 버전을 다운로드하세요.
            </p>
          </div>
          <OsTab
            mac={
              <div className="space-y-2">
                <p>1. 다운로드된 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.dmg</code> 파일을 더블클릭합니다.</p>
                <p>2. Claude Code 아이콘을 Applications 폴더로 드래그합니다.</p>
                <p>3. Applications에서 Claude Code를 실행합니다.</p>
                <p>4. Anthropic 계정으로 로그인합니다.</p>
              </div>
            }
            windows={
              <div className="space-y-2">
                <p>1. 다운로드된 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.exe</code> 파일을 실행합니다.</p>
                <p>2. 설치 마법사를 따라 진행합니다.</p>
                <p>3. 시작 메뉴에서 Claude Code를 실행합니다.</p>
                <p>4. Anthropic 계정으로 로그인합니다.</p>
              </div>
            }
          />
        </StepCard>

        <StepCard number={2} title="MedSci Skills 다운로드">
          <p>
            GitHub에서 ZIP 파일로 다운로드합니다.{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">git clone</code>은
            사용하지 않습니다.
          </p>
          <div className="mt-4 space-y-3">
            <p>
              1.{" "}
              <a
                href="https://github.com/Aperivue/medsci-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                github.com/Aperivue/medsci-skills
              </a>
              에 접속합니다.
            </p>
            <p>
              2. 초록색{" "}
              <span className="inline-flex items-center rounded-md bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                &lt;&gt; Code
              </span>{" "}
              버튼을 클릭합니다.
            </p>
            <p>3. <strong>Download ZIP</strong>을 클릭합니다.</p>
            <p>4. 다운로드된 ZIP 파일의 압축을 풀어줍니다.</p>
          </div>
          <img
            src="/images/guide/guide-github-download.png"
            alt="GitHub Download ZIP 버튼"
            className="mt-4 rounded-xl border border-border"
          />
        </StepCard>

        <StepCard number={3} title="스킬 폴더 복사">
          <p>
            압축을 푼 폴더 안의 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> 폴더를
            Claude Code의 스킬 디렉토리로 복사합니다.
          </p>
          <OsTab
            mac={
              <div className="space-y-3">
                <p>1. <strong>Finder</strong>를 엽니다.</p>
                <p>
                  2. 메뉴에서 <strong>이동 &gt; 폴더로 이동</strong>을 클릭합니다 (단축키:{" "}
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Cmd + Shift + G</kbd>).
                </p>
                <p>3. 다음 경로를 입력합니다:</p>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <code className="text-sm text-foreground/80">~/.claude/</code>
                </div>
                <p>
                  4. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude</code> 폴더 안에{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> 폴더가 없으면 새로 만듭니다.
                </p>
                <p>
                  5. 다운로드한 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">medsci-skills-main/skills/</code>{" "}
                  안의 <strong>모든 폴더</strong>를{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>로 복사합니다.
                </p>
                <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <p className="font-semibold text-primary">최종 구조 확인</p>
                  <pre className="mt-2 text-foreground/60">
{`~/.claude/skills/
├── analyze-stats/
│   └── SKILL.md
├── check-reporting/
│   └── SKILL.md
├── orchestrate/
│   └── SKILL.md
├── write-paper/
│   └── SKILL.md
└── ... (22개 폴더)`}
                  </pre>
                </div>
              </div>
            }
            windows={
              <div className="space-y-3">
                <p>1. <strong>파일 탐색기</strong>를 엽니다.</p>
                <p>2. 주소창에 다음 경로를 입력합니다:</p>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <code className="text-sm text-foreground/80">%USERPROFILE%\.claude\</code>
                </div>
                <p>
                  3. <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude</code> 폴더 안에{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> 폴더가 없으면 새로 만듭니다.
                </p>
                <p>
                  4. 다운로드한 <code className="rounded bg-muted px-1.5 py-0.5 text-xs">medsci-skills-main\skills\</code>{" "}
                  안의 <strong>모든 폴더</strong>를{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude\skills\</code>로 복사합니다.
                </p>
                <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <p className="font-semibold text-primary">Note</p>
                  <p className="mt-1 text-foreground/60">
                    Windows에서 <code>.claude</code> 같은 점(.)으로 시작하는 폴더가
                    보이지 않을 수 있습니다. 파일 탐색기 상단의{" "}
                    <strong>보기 &gt; 숨김 항목</strong>을 체크하세요.
                  </p>
                </div>
              </div>
            }
          />
        </StepCard>

        <StepCard number={4} title="설치 확인">
          <p>Claude Code Desktop을 재시작하고 스킬이 로드되었는지 확인합니다.</p>
          <div className="mt-4 space-y-3">
            <p>1. Claude Code Desktop 앱을 완전히 종료했다가 다시 엽니다.</p>
            <p>2. 대화창에 다음을 입력합니다:</p>
            <div className="rounded-lg border border-border bg-surface p-3">
              <code className="text-sm text-foreground/80">
                /orchestrate 어떤 스킬이 있는지 알려줘
              </code>
            </div>
            <p>3. 22개 스킬 목록이 나오면 설치 완료입니다.</p>
          </div>
          <img
            src="/images/guide/guide-orchestrate-result.png"
            alt="/orchestrate 실행 결과"
            className="mt-4 rounded-xl border border-border"
          />
        </StepCard>

        <StepCard number={5} title="Python 설치 (선택)">
          <p>
            통계 분석(<code className="rounded bg-muted px-1.5 py-0.5 text-xs">analyze-stats</code>)과
            Figure 생성(<code className="rounded bg-muted px-1.5 py-0.5 text-xs">make-figures</code>)을
            사용하려면 Python이 필요합니다.
          </p>
          <div className="mt-3 rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-medium text-foreground/50">필요한 경우만</p>
            <p className="mt-1 text-sm text-foreground/60">
              문헌 검색, 보고 가이드라인 감사, 논문 작성 등 텍스트 기반 스킬은
              Python 없이도 사용할 수 있습니다. 처음에는 건너뛰어도 됩니다.
            </p>
          </div>
          <OsTab
            mac={
              <div className="space-y-2">
                <p>
                  1.{" "}
                  <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    python.org/downloads
                  </a>
                  에서 Python 3.11 이상을 다운로드합니다.
                </p>
                <p>2. 설치 프로그램을 실행하고 기본 설정으로 진행합니다.</p>
                <p>3. Claude Code가 필요한 라이브러리를 자동으로 설치합니다 (별도 작업 불필요).</p>
              </div>
            }
            windows={
              <div className="space-y-2">
                <p>
                  1.{" "}
                  <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    python.org/downloads
                  </a>
                  에서 Python 3.11 이상을 다운로드합니다.
                </p>
                <p>2. 설치 시 <strong>&quot;Add Python to PATH&quot;</strong> 체크박스를 반드시 선택합니다.</p>
                <p>3. Claude Code가 필요한 라이브러리를 자동으로 설치합니다.</p>
              </div>
            }
          />
        </StepCard>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">설치가 안 되나요?</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium">&quot;/orchestrate&quot;를 입력해도 아무 반응이 없어요</dt>
            <dd className="mt-1 text-foreground/60">
              스킬 폴더 경로를 다시 확인하세요. 각 스킬 폴더 안에{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs">SKILL.md</code> 파일이 있어야 합니다.{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs">~/.claude/skills/orchestrate/SKILL.md</code>가 존재하는지 확인하세요.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Claude Code Desktop이 실행되지 않아요</dt>
            <dd className="mt-1 text-foreground/60">
              Anthropic 계정에 활성 구독(Pro 또는 Max)이 있는지 확인하세요. 무료 계정으로는 Claude Code를 사용할 수 없습니다.
            </dd>
          </div>
          <div>
            <dt className="font-medium">macOS에서 .claude 폴더가 보이지 않아요</dt>
            <dd className="mt-1 text-foreground/60">
              Finder에서{" "}
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">Cmd + Shift + .</kbd>
              을 누르면 숨김 파일이 표시됩니다. 또는 <strong>이동 &gt; 폴더로 이동</strong>에서 직접 경로를 입력하세요.
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-foreground/40">
          더 많은 질문은{" "}
          <Link href={`/${lang}/skills/guide/faq`} className="text-primary underline">FAQ 페이지</Link>를 참고하세요.
        </p>
      </section>

      <div className="mt-10 flex justify-end">
        <Link
          href={`/${lang}/skills/guide/first-pipeline`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          다음: 첫 파이프라인 실행 &rarr;
        </Link>
      </div>
    </div>
  );
}
