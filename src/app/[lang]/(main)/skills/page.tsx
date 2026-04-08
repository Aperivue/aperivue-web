import type { Metadata } from "next";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import skillsEn from "@/content/data/skills.en.json";
import skillsKo from "@/content/data/skills.ko.json";

const skillsData = { en: skillsEn, ko: skillsKo };

export const metadata: Metadata = {
  title: "Medical Research Skills for Claude Code | Aperivue",
  description:
    "20 open-source Claude Code skills covering the full medical research lifecycle — from literature search to manuscript revision. End-to-end pipeline mode, anti-hallucination citations, 15 reporting guidelines, publication-ready figures.",
  keywords: [
    "claude code skills",
    "medical research",
    "STROBE",
    "PRISMA",
    "CONSORT",
    "STARD",
    "reporting guidelines",
    "literature search",
    "anti-hallucination",
    "medical AI",
    "biostatistics",
    "publication figures",
    "systematic review",
    "meta-analysis",
    "academic writing",
  ],
  openGraph: {
    title: "Medical Research Skills for Claude Code",
    description:
      "20 open-source skills for the full medical research lifecycle. Built by physicians, battle-tested on real publications.",
    url: "https://aperivue.com/skills",
  },
};

const GITHUB_URL =
  "https://github.com/Aperivue/medsci-skills";

const DEMO_URL =
  "https://github.com/Aperivue/medsci-skills/tree/main/demo/01_wisconsin_bc";

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).skills;
  const data = skillsData[lang as Locale];
  const skills = data.skills;
  const pipelineSteps = data.pipelineSteps;
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-16">
      {/* Hero */}
      <section className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {t.badge}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          {t.description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t.viewGithub}
          </a>
          <a
            href="#installation"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {t.installNow}
          </a>
          <a
            href={`/${lang}/skills/guide`}
            className="rounded-full border border-primary px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            한국어 가이드
          </a>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mt-20">
        <h2 className="text-center text-lg font-semibold text-foreground/80">
          {t.pipeline}
        </h2>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {pipelineSteps.map((step, i) => (
            <div key={step.skill} className="flex items-center gap-2">
              <div className="relative rounded-lg border border-border bg-surface px-4 py-2 text-center text-xs font-medium leading-tight whitespace-pre-line">
                {"isNew" in step && step.isNew && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-bold text-white">
                    NEW
                  </span>
                )}
                {step.label}
                <span className="mt-1 block text-[10px] text-accent">
                  {step.skill}
                </span>
              </div>
              {i < pipelineSteps.length - 1 && (
                <span className="hidden text-foreground/30 sm:inline">&rarr;</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-foreground/40">
          + orchestrate &middot; meta-analysis &middot; grant-builder &middot;
          intake-project &middot; manage-project &middot; publish-skill
        </p>
      </section>

      {/* End-to-End Demo */}
      <section className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {t.demoTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/70">
              Live demo: from{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs font-mono">
                sklearn.datasets.load_breast_cancer()
              </code>{" "}
              to a full manuscript with 4 figures, STARD compliance audit, and
              12-slide presentation — all generated by chaining skills via{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs font-mono">
                orchestrate
              </code>{" "}
              Full Pipeline Mode.
            </p>
          </div>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {t.viewDemo} &rarr;
          </a>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="mt-16">
        <h2 className="text-xl font-bold">{t.allSkills}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">{skill.title}</h3>
                <span className="rounded-full bg-accent/10 px-3 py-0.5 text-[10px] font-mono text-accent">
                  {skill.name}
                </span>
                {"isNew" in skill && skill.isNew && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-foreground/70">
                {skill.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {skill.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-foreground/60"
                  >
                    <span className="mt-0.5 text-primary">&#x2713;</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mt-16 rounded-2xl border border-border bg-muted p-8">
        <h2 className="text-lg font-bold">Why These Skills?</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-primary">
              Anti-Hallucination Citations
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              Every reference verified against PubMed, Semantic Scholar, or
              CrossRef APIs. No citation is ever generated from memory alone.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary">
              16 Reporting Guidelines
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              STROBE, STARD, TRIPOD+AI, PRISMA, ARRIVE built-in. CONSORT,
              CARE, SPIRIT, CLAIM supported via knowledge-based assessment.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary">
              Publication-Ready Output
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              300 DPI figures, colorblind-safe palettes, reproducible
              Python/R code. Ready for journal submission.
            </p>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section id="installation" className="mt-16">
        <h2 className="text-xl font-bold">{t.installation}</h2>
        <p className="mt-3 text-sm text-foreground/60">
          {t.installDesc}
        </p>

        {/* Desktop App (non-coders) */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              NEW
            </span>
            <h3 className="font-semibold">{t.desktopNew}</h3>
          </div>
          <p className="mt-2 text-sm text-foreground/60">
            {t.desktopDesc}
          </p>
          <a
            href={`/${lang}/skills/guide/install`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t.stepByStep} &rarr;
          </a>
        </div>

        {/* CLI (developers) */}
        <div className="mt-4 space-y-4">
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface p-6">
            <p className="mb-2 text-xs font-medium text-foreground/50">
              {t.cliAll}
            </p>
            <pre className="overflow-x-auto text-sm">
              <code className="text-foreground/80">
{`git clone https://github.com/aperivue/medsci-skills.git
cp -r medsci-skills/skills/* ~/.claude/skills/`}
              </code>
            </pre>
          </div>
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface p-6">
            <p className="mb-2 text-xs font-medium text-foreground/50">
              {t.cliSingle}
            </p>
            <pre className="overflow-x-auto text-sm">
              <code className="text-foreground/80">
{`git clone https://github.com/aperivue/medsci-skills.git
cp -r medsci-skills/skills/check-reporting ~/.claude/skills/`}
              </code>
            </pre>
          </div>
        </div>
        <p className="mt-4 text-xs text-foreground/40">
          Requires{" "}
          <a
            href="https://claude.ai/download"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Claude Code Desktop
          </a>{" "}
          or CLI. Python 3.9+ for statistical analysis and figure generation.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h2 className="text-lg font-semibold">{t.readyToStreamline}</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t.starGithub}
          </a>
          <a
            href={`${GITHUB_URL}#installation`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            {t.readDocs}
          </a>
        </div>
        <p className="mt-6 text-xs text-foreground/40">
          MIT License &middot; Built by{" "}
          <a href={`/${lang}/about`} className="underline hover:text-primary">
            Aperivue
          </a>
        </p>
      </section>
    </main>
  );
}
