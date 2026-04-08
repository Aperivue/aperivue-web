import type { Metadata } from "next";

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

const skills = [
  {
    name: "orchestrate",
    title: "Orchestrator",
    description:
      "Single entry point for the full bundle. Classifies your request and routes to the right skill — or chains multiple skills end-to-end via Full Pipeline Mode.",
    features: [
      "Automatic intent classification",
      "End-to-end pipeline: skills chain automatically",
      "Project context detection",
    ],
    isNew: true,
  },
  {
    name: "search-lit",
    title: "Literature Search",
    description:
      "PubMed + Semantic Scholar + bioRxiv search with anti-hallucination citation verification. Token-efficient error handling.",
    features: [
      "Every reference verified via API",
      "BibTeX export",
      "No fabricated citations",
    ],
  },
  {
    name: "fulltext-retrieval",
    title: "Full-Text Retrieval",
    description:
      "Batch open-access PDF downloader. Unpaywall → PMC → OpenAlex → CrossRef pipeline. OA-only — no paywall bypass.",
    features: [
      "DOI list or TSV input",
      "PDF validation built-in",
      "Manual-needed list for paywalled papers",
    ],
    isNew: true,
  },
  {
    name: "check-reporting",
    title: "Reporting Guidelines",
    description:
      "Manuscript compliance audit against 15 reporting guidelines with item-by-item assessment and section boundary checks.",
    features: [
      "STROBE, STARD, PRISMA, CONSORT, TRIPOD+AI",
      "Results/Discussion boundary check",
      "Actionable fix suggestions",
    ],
  },
  {
    name: "design-study",
    title: "Study Design",
    description:
      "Identifies analysis unit, cohort logic, data leakage risks, and validation strategy.",
    features: [
      "Leakage risk detection",
      "Comparator design review",
      "Reporting guideline matching",
    ],
  },
  {
    name: "analyze-stats",
    title: "Statistical Analysis",
    description:
      "Reproducible Python/R code for diagnostic accuracy, inter-rater agreement, and more. Calibration mandatory for prediction models.",
    features: [
      "DTA, survival, demographics tables",
      "Publication-ready output",
      "Effect sizes with CIs",
    ],
  },
  {
    name: "make-figures",
    title: "Publication Figures",
    description:
      "Journal-spec figures: ROC curves, forest plots, flow diagrams, Kaplan-Meier, and more.",
    features: [
      "300 DPI, colorblind-safe",
      "PRISMA / CONSORT / STARD flows",
      "Bland-Altman, confusion matrices",
    ],
  },
  {
    name: "grant-builder",
    title: "Grant Proposals",
    description:
      "Structures significance, innovation, approach, milestones, and consortium roles.",
    features: [
      "NIH / NRF format support",
      "Specific aims page",
      "Budget justification",
    ],
  },
  {
    name: "intake-project",
    title: "Project Intake",
    description:
      "Classifies new research projects, summarizes state, and recommends next steps.",
    features: [
      "Project type classification",
      "Missing input detection",
      "Lightweight scaffolding",
    ],
  },
  {
    name: "present-paper",
    title: "Paper Presentations",
    description:
      "Academic presentation prep: paper analysis, speaker scripts, slide note injection, Q&A.",
    features: [
      "Audience-adapted scripts",
      "PPTX note injection utility",
      "Multi-perspective Q&A prep",
    ],
  },
  {
    name: "publish-skill",
    title: "Skill Publishing",
    description:
      "Convert personal Claude Code skills into distributable, open-source-ready packages.",
    features: [
      "Automated PII audit",
      "License compatibility check",
      "Generalization pipeline",
    ],
  },
  {
    name: "meta-analysis",
    title: "Meta-Analysis",
    description:
      "Full 8-phase systematic review and meta-analysis pipeline. DTA (bivariate/HSROC) and intervention MA with PRISMA-DTA compliance.",
    features: [
      "Protocol to manuscript pipeline",
      "Bivariate & HSROC models",
      "PRISMA-DTA compliant",
    ],
  },
  {
    name: "write-paper",
    title: "Manuscript Writing",
    description:
      "Full 8-phase IMRAD pipeline from outline to submission-ready manuscript with built-in critic-fixer loops and section boundary enforcement.",
    features: [
      "Anti-interpretation guardrails in Results",
      "Interactive Discussion with anchor papers",
      "AI writing pattern detection",
    ],
    isNew: true,
  },
  {
    name: "self-review",
    title: "Self-Review",
    description:
      "Pre-submission check across 10 categories with research-type branching (AI, observational, educational, meta-analysis, case report, surgical).",
    features: [
      "Major / Minor severity classification",
      "Calibration mandatory for prediction models",
      "R0 numbering for /revise pipeline",
    ],
    isNew: true,
  },
  {
    name: "revise",
    title: "Revision Response",
    description:
      "Parses reviewer decision letters, classifies comments as MAJOR/MINOR/REBUTTAL, and generates point-by-point responses.",
    features: [
      "Structured response templates",
      "Change log with page/line refs",
      "Cover letter generation",
    ],
    isNew: true,
  },
  {
    name: "manage-project",
    title: "Project Management",
    description:
      "Scaffold research projects, track writing progress, generate submission checklists and backwards timelines.",
    features: [
      "Project scaffolding (init)",
      "Phase progress tracking",
      "Pre-submission checklist",
    ],
    isNew: true,
  },
  {
    name: "calc-sample-size",
    title: "Sample Size Calculator",
    description:
      "Power analysis and sample size estimation for diagnostic accuracy, group comparison, and correlation studies.",
    features: [
      "DTA (sensitivity/specificity) power",
      "Two-group comparison (t-test, chi-square)",
      "Reproducible R/Python code output",
    ],
    isNew: true,
  },
  {
    name: "clean-data",
    title: "Data Cleaning",
    description:
      "Standardize, validate, and transform raw research datasets. Handles missing data, outlier detection, and variable recoding.",
    features: [
      "Missing data summary & imputation",
      "Outlier detection (IQR, Z-score)",
      "Codebook generation",
    ],
    isNew: true,
  },
  {
    name: "find-journal",
    title: "Journal Finder",
    description:
      "Match your manuscript to target journals by scope, impact factor, turnaround time, and open-access policy.",
    features: [
      "Scope & audience matching",
      "Impact factor / CiteScore lookup",
      "OA fee & turnaround estimates",
    ],
    isNew: true,
  },
  {
    name: "write-protocol",
    title: "Protocol Writing",
    description:
      "Generate SPIRIT-compliant study protocols and PROSPERO registration drafts for systematic reviews.",
    features: [
      "SPIRIT checklist integration",
      "PROSPERO registration draft",
      "Ethics submission boilerplate",
    ],
    isNew: true,
  },
];

const pipelineSteps = [
  { label: "Literature\nReview", skill: "search-lit" },
  { label: "Full-Text\nRetrieval", skill: "fulltext-retrieval", isNew: true },
  { label: "Study\nDesign", skill: "design-study" },
  { label: "Analysis", skill: "analyze-stats" },
  { label: "Figures", skill: "make-figures" },
  { label: "Writing", skill: "write-paper", isNew: true },
  { label: "Reporting", skill: "check-reporting" },
  { label: "Self-Review", skill: "self-review", isNew: true },
  { label: "Revision", skill: "revise", isNew: true },
  { label: "Presenting", skill: "present-paper" },
];

export default function SkillsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-16">
      {/* Hero */}
      <section className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Open Source
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Medical Research Skills for Claude Code
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          20 skills covering the full research lifecycle — from literature search
          to manuscript revision. Built by physicians, battle-tested on real
          publications. MIT licensed.
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
            View on GitHub
          </a>
          <a
            href="#installation"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Install Now
          </a>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mt-20">
        <h2 className="text-center text-lg font-semibold text-foreground/80">
          Research Pipeline
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
                <span className="text-foreground/30">&rarr;</span>
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
              End-to-End Pipeline Demo
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
            View Demo on GitHub &rarr;
          </a>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="mt-16">
        <h2 className="text-xl font-bold">All Skills</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex flex-col rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">
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
        <h2 className="text-xl font-bold">Installation</h2>
        <p className="mt-3 text-sm text-foreground/60">
          Copy skills to your Claude Code skills directory. That&apos;s it.
        </p>
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="mb-2 text-xs font-medium text-foreground/50">
              Install all skills
            </p>
            <pre className="overflow-x-auto text-sm">
              <code className="text-foreground/80">
{`git clone https://github.com/aperivue/medsci-skills.git
cp -r medsci-skills/skills/* ~/.claude/skills/`}
              </code>
            </pre>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <p className="mb-2 text-xs font-medium text-foreground/50">
              Install a single skill
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
            href="https://claude.ai/code"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Claude Code
          </a>{" "}
          CLI or IDE extension. Python 3.9+ for statistical analysis and
          figure generation.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h2 className="text-lg font-semibold">Ready to streamline your research?</h2>
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
            Star on GitHub
          </a>
          <a
            href={`${GITHUB_URL}#installation`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Read the Docs
          </a>
        </div>
        <p className="mt-6 text-xs text-foreground/40">
          MIT License &middot; Built by{" "}
          <a href="/about" className="underline hover:text-primary">
            Aperivue
          </a>
        </p>
      </section>
    </main>
  );
}
