import type { Metadata } from "next";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import skillsEn from "@/content/data/skills.en.json";
import skillsKo from "@/content/data/skills.ko.json";
import {
  buildAlternates,
  ogUrl,
  DEFAULT_OG_IMAGES,
  SKILL_COUNT,
  DETECTOR_COUNT,
  GUIDELINE_COUNT,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { SkillsExplorer } from "./SkillsExplorer";
import { IntroVideo } from "./IntroVideo";

const skillsData = { en: skillsEn, ko: skillsKo };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Medical Research Skills for Claude Code, Codex, Cursor & Copilot", // bare; root template adds " | Aperivue"
    description: `${SKILL_COUNT} open-source skills for the medical research lifecycle, with ${DETECTOR_COUNT} deterministic integrity detectors. Runs in Claude Code, Codex, Cursor, and GitHub Copilot.`,
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
    alternates: buildAlternates(lang, "/skills"),
    openGraph: {
      title: "Medical Research Skills for Claude Code, Codex, Cursor & Copilot",
      description: `${SKILL_COUNT} open-source skills for the full medical research lifecycle. Built by physicians, tested on real publications.`,
      url: ogUrl(lang, "/skills"),
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const GITHUB_URL =
  "https://github.com/Aperivue/medsci-skills";

const DEMO_URL =
  "https://github.com/Aperivue/medsci-skills/tree/main/demo";

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

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MedSci Skills",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Claude Code (macOS, Windows, Linux)",
    description: `${SKILL_COUNT} open-source Claude Code skills for the full medical research lifecycle — literature search, statistics, figures, reporting guidelines, and manuscript writing.`,
    url: ogUrl(lang, "/skills"),
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Organization",
      name: "Aperivue",
      url: "https://aperivue.com",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are MedSci Skills?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${SKILL_COUNT} open-source Claude Code skills covering the full medical research lifecycle, from literature search and statistics to figures, reporting-guideline audits, and manuscript writing.`,
        },
      },
      {
        "@type": "Question",
        name: "Do I need to know how to code?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. With the Claude Code Desktop app you copy the skills folder once and run pipelines in plain language. A step-by-step guide is provided for clinician researchers.",
        },
      },
      {
        "@type": "Question",
        name: "How many skills are included, and what does it cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${SKILL_COUNT} skills are included. They are open source under the MIT license and free to use.`,
        },
      },
    ],
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col overflow-hidden px-6 py-16">
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={faqJsonLd} />
      {/* Hero */}
      <section className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          {t.badge}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          {t.description.replace("{count}", String(SKILL_COUNT))}
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
            {t.koGuide}
          </a>
        </div>
      </section>

      {/* Intro video */}
      <section className="mt-16">
        <h2 className="text-center text-lg font-semibold text-foreground/80">
          {t.introVideoTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-foreground/50">
          {t.introVideoSubtitle}
        </p>
        <IntroVideo location="skills" />
      </section>

      {/* Pipeline */}
      <section className="mt-20">
        <h2 className="text-center text-lg font-semibold text-foreground/80">
          {t.pipeline}
        </h2>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {pipelineSteps.map((step, i) => (
            <div key={step.skill} className="flex items-center gap-2">
              <div className="rounded-lg border border-border bg-surface px-4 py-2 text-center text-xs font-medium leading-tight whitespace-pre-line">
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
          + {SKILL_COUNT - pipelineSteps.length} more skills across the full
          lifecycle &mdash; browse them all below.
        </p>
      </section>

      {/* MedSci-Audit — the deterministic verification layer (the differentiator) */}
      <section className="mt-12 rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-8">
        <h2 className="text-lg font-bold">{t.auditTitle}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/70">
          {t.auditDesc
            .replace("{detectors}", String(DETECTOR_COUNT))
            .replace("{guidelines}", String(GUIDELINE_COUNT))}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {(t.auditExamples as string[]).map((line) => (
            <li
              key={line}
              className="flex gap-2 text-sm leading-relaxed text-foreground/75"
            >
              <span aria-hidden className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/60">
          {t.auditFooter}
        </p>
        <a
          href="https://github.com/Aperivue/medsci-skills/blob/main/MEDSCI_AUDIT.md"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-foreground/25 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background"
        >
          {t.auditLink} &rarr;
        </a>
      </section>

      {/* End-to-End Demo */}
      <section className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {t.demoTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/70">
              4 end-to-end demos — three clinical study types (diagnostic
              accuracy (Wisconsin BC), meta-analysis (BCG vaccine, 13 RCTs), and
              epidemiology (NHANES 2017-18)), each producing a complete
              manuscript, 300 dpi figures, reporting-compliance audit (STARD /
              PRISMA / STROBE), and a presentation; plus a medical-AI model demo
              (PneumoniaMNIST CNN — training, evaluation, calibration, and
              Grad-CAM). All from public data only.
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

      {/* Skills Grid (searchable + filterable) */}
      <section className="mt-16">
        <h2 className="text-xl font-bold">{t.allSkills}</h2>
        <SkillsExplorer
          lang={lang}
          skills={skills}
          labels={{
            searchPlaceholder: t.searchPlaceholder,
            filterAll: t.filterAll,
            resultsNone: t.resultsNone,
            categoryLabels: t.categoryLabels,
          }}
        />
      </section>

      {/* Impact / adoption (open-source evidence) */}
      <section className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-lg font-bold">{t.impactTitle}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-foreground/60">
          {t.impactSubtitle}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/stars/Aperivue/medsci-skills?style=flat&logo=github&label=Stars&color=2563eb"
            alt="GitHub stars"
            height={24}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/forks/Aperivue/medsci-skills?style=flat&logo=github&label=Forks&color=2563eb"
            alt="GitHub forks"
            height={24}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://img.shields.io/github/v/release/Aperivue/medsci-skills?style=flat&label=Release&color=16a34a"
            alt="Latest release"
            height={24}
          />
          <a
            href="https://doi.org/10.5281/zenodo.20155321"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.shields.io/badge/DOI-10.5281%2Fzenodo.20155321-1f7a8c?style=flat"
              alt="Zenodo DOI"
              height={24}
            />
          </a>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm">
          <a
            href={`${GITHUB_URL}/blob/main/IMPACT.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            {t.impactCitations} &rarr;
          </a>
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
              46 Reporting Guidelines
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
        {/* Read from the dictionary — this line was hardcoded, so it went on saying
            "Requires Claude Code Desktop or CLI" long after the installer gained
            three more hosts, and no gate could see it. */}
        <p className="mt-4 text-xs text-foreground/40">{t.requires}</p>
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
