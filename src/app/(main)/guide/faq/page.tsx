import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — MedSci Skills 가이드",
  description: "MedSci Skills 사용 시 자주 묻는 질문과 답변. 구독, 보안, 언어, 호환성.",
};

const faqs = [
  {
    q: "Claude 구독이 반드시 필요한가요?",
    a: "네. Claude Code는 Claude Pro ($20/월) 또는 Max ($100/월) 구독이 필요합니다. 무료 계정으로는 사용할 수 없습니다. 대부분의 연구 작업은 Pro로 충분하지만, 큰 데이터셋이나 긴 논문 작업은 Max가 안정적입니다.",
  },
  {
    q: "내 데이터가 외부로 유출되지는 않나요?",
    a: "Claude Code는 대화 내용을 모델 학습에 사용하지 않습니다 (Anthropic 정책). 다만 데이터는 Anthropic 서버로 전송되어 처리됩니다. 민감한 환자 데이터는 반드시 익명화(de-identification)한 후 사용하세요. IRB 규정을 따르는 것은 연구자의 책임입니다.",
  },
  {
    q: "한국어로 프롬프트를 입력해도 되나요?",
    a: "네. Claude는 한국어를 잘 이해합니다. 다만 논문 초고는 영어로 생성하는 것이 기본 설정입니다. 한국어 논문이 필요하면 '한국어로 작성해줘'라고 추가하면 됩니다.",
  },
  {
    q: "인터넷이 없으면 사용할 수 없나요?",
    a: "맞습니다. Claude Code는 Anthropic 서버와 통신해야 하므로 인터넷 연결이 필수입니다.",
  },
  {
    q: "기존 SPSS/R 분석 결과와 다르면 어떻게 하나요?",
    a: "MedSci Skills는 Python/R 코드를 생성하고 실행합니다. 결과가 다르다면 사용된 통계 방법, 모수/비모수 선택, 결측치 처리 방식을 비교해보세요. 생성된 코드는 투명하게 공개되므로 직접 검증할 수 있습니다.",
  },
  {
    q: "Windows에서도 동일하게 작동하나요?",
    a: "네. Claude Code Desktop은 macOS와 Windows 모두 지원합니다. 다만 일부 Python 패키지 설치 시 Windows에서 추가 설정이 필요할 수 있습니다 (예: Visual C++ Build Tools). Claude가 에러가 나면 해결 방법을 알려줍니다.",
  },
  {
    q: "R을 몰라도 메타분석을 할 수 있나요?",
    a: "네. meta-analysis 스킬이 R 코드를 자동으로 생성하고 실행합니다. R이 설치되어 있어야 하지만, R 문법을 직접 작성할 필요는 없습니다. Claude에게 '메타분석 해줘'라고 말하면 됩니다.",
  },
  {
    q: "하나의 스킬만 설치해도 되나요?",
    a: "네. 예를 들어 보고 가이드라인 감사만 필요하다면 check-reporting 폴더만 복사하면 됩니다. 다만 orchestrate 스킬을 함께 설치하면 자동 라우팅이 가능해져서 편리합니다.",
  },
  {
    q: "이 도구로 쓴 논문을 투고해도 되나요?",
    a: "네. 다만 AI 도구 사용을 저널에 공개하는 것을 권장합니다. 대부분의 저널이 Methods 또는 Acknowledgements에 AI 사용을 기재하도록 요구합니다. MedSci Skills는 도구를 자동으로 기록하므로 투명성을 유지할 수 있습니다.",
  },
  {
    q: "스킬 업데이트는 어떻게 하나요?",
    a: "GitHub에서 최신 ZIP을 다시 다운로드하고 skills/ 폴더를 덮어쓰면 됩니다. 직접 수정한 스킬이 있다면 백업 후 덮어쓰기하세요.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">자주 묻는 질문</h1>
      <p className="mt-2 text-foreground/60">
        MedSci Skills 사용 중 궁금한 점을 모았습니다.
      </p>

      <div className="mt-8 space-y-6">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="font-semibold">{faq.q}</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Support */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6 text-center">
        <h2 className="font-semibold">여기에 없는 질문이 있나요?</h2>
        <p className="mt-2 text-sm text-foreground/60">
          GitHub Issues에 질문을 남기거나, 워크숍에서 직접 물어보세요.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href="https://github.com/Aperivue/medsci-skills/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            GitHub Issues
          </a>
          <Link
            href="/contact"
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            문의하기
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href="/guide/customize"
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; 이전: 커스터마이즈
        </Link>
        <Link
          href="/guide"
          className="text-sm text-foreground/50 hover:text-primary"
        >
          가이드 처음으로
        </Link>
      </div>
    </div>
  );
}
