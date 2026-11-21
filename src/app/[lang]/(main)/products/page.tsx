import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates, SKILL_COUNT } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "ko" ? "도구" : "Tools",
    description:
      "Aperivue tools — RADS calculators for structured radiology reporting and medsci-skills, open-source research skills for Claude Code.",
    alternates: buildAlternates(lang, "/products"),
  };
}

interface ToolLink {
  label: string;
  href: string;
  external?: boolean;
}

interface Tool {
  name: string;
  description: string;
  links: ToolLink[];
}

const RADS_CALCULATORS: ToolLink[] = [
  { label: "TI-RADS", href: "/rads/tirads" },
  { label: "Lung-RADS", href: "/rads/lungrads" },
  { label: "BI-RADS", href: "/rads/birads" },
  { label: "LI-RADS", href: "/rads/lirads" },
  { label: "PI-RADS", href: "/rads/pirads" },
  { label: "O-RADS", href: "/rads/orads" },
];

const GITHUB_SKILLS = "https://github.com/Aperivue/medsci-skills";
const SCRUBCODE = "https://youtube.com/@scrubcode";

function toolsFor(lang: Locale): Tool[] {
  const ko = lang === "ko";
  return [
    {
      name: ko ? "RADS 계산기" : "RADS calculators",
      description: ko
        ? "여섯 가지 RADS 점수를 계산하고, 가이드라인 권고와 함께 구조화 판독문을 만듭니다. 교육·연구용이며 의료기기가 아닙니다."
        : "Calculators for six RADS systems that return the category, the guideline recommendation and a structured report. For education and research; not a medical device.",
      links: [{ label: ko ? "전체 계산기" : "All calculators", href: "/rads" }, ...RADS_CALCULATORS],
    },
    {
      name: "medsci-skills",
      description: ko
        ? `Claude Code용 오픈소스 의학 연구 스킬 ${SKILL_COUNT}개. 문헌 검색, 통계, 그림, 원고 작성, 보고 지침 점검, 투고 준비를 다룹니다. Codex, Cursor, GitHub Copilot에서도 동작합니다. MIT 라이선스.`
        : `${SKILL_COUNT} open-source medical research skills for Claude Code, covering literature search, statistics, figures, manuscript writing, reporting-guideline checks and submission. Also runs in Codex, Cursor and GitHub Copilot. MIT licence.`,
      links: [
        { label: ko ? "스킬 목록" : "Skill catalog", href: "/skills" },
        { label: ko ? "설치·사용 가이드" : "Install and usage guide", href: "/skills/guide" },
        { label: "GitHub", href: GITHUB_SKILLS, external: true },
      ],
    },
  ];
}

const linkClass =
  "font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).products;
  const tools = toolsFor(lang as Locale);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
      <p className="mt-4 break-keep text-lg text-foreground/80">{t.description}</p>

      <ul className="mt-12 border-t border-border">
        {tools.map((tool) => (
          <li key={tool.name} className="border-b border-border py-8">
            <h2 className="text-xl font-semibold tracking-tight">{tool.name}</h2>
            <p className="mt-2 break-keep leading-relaxed text-foreground/80">
              {tool.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {tool.links.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {l.label} &#8599;
                    </a>
                  ) : (
                    <Link href={`/${lang}${l.href}`} className={linkClass}>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-foreground/60">
        {t.paused}{" "}
        <a
          href={SCRUBCODE}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-primary"
        >
          ScrubCode
        </a>
      </p>
    </main>
  );
}
