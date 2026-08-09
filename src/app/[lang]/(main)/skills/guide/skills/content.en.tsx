import Link from "next/link";

const categories = [
  {
    emoji: "1",
    title: "I only have a topic so far",
    description: "You have a research topic but no concrete plan yet",
    skills: [
      {
        name: "search-lit",
        label: "Literature Search",
        prompt: '/search-lit Search the last 5 years of literature on "topic keywords"',
        note: "PubMed + Semantic Scholar. Every citation is API-verified — zero hallucinations",
      },
      {
        name: "design-study",
        label: "Study Design Review",
        prompt: "/design-study Review the design of this research plan",
        note: "Checks analysis unit, data leakage risk, and comparator design",
      },
      {
        name: "calc-sample-size",
        label: "Sample Size Calculation",
        prompt: "/calc-sample-size How many subjects do I need to test for sensitivity above 90%?",
        note: "Power analysis + auto-generated justification text for IRB submissions",
      },
      {
        name: "write-protocol",
        label: "Protocol Writing",
        prompt: "/write-protocol Draft the IRB protocol for this study",
        note: "SPIRIT-based 4 core sections + TODO markers",
      },
    ],
  },
  {
    emoji: "2",
    title: "I have data ready",
    description: "You have CSV/Excel data and want to start analysis",
    skills: [
      {
        name: "clean-data",
        label: "Data Cleaning",
        prompt: "/clean-data Profile and clean data.csv",
        note: "Detects missing values, outliers, and duplicates. 3-stage approval gate (profile, flag, code)",
      },
      {
        name: "analyze-stats",
        label: "Statistical Analysis",
        prompt: "/analyze-stats Analyze diagnostic accuracy from this data",
        note: "Auto-selects the right method: DeLong CI, Wilson interval, survey weights, and more",
      },
      {
        name: "make-figures",
        label: "Figure Generation",
        prompt: "/make-figures Plot an ROC curve and Confusion Matrix",
        note: "300 DPI, colorblind-safe palette, journal-submission ready",
      },
    ],
  },
  {
    emoji: "3",
    title: "I want to write a first draft",
    description: "Analysis is done and you need to draft or review the manuscript",
    skills: [
      {
        name: "write-paper",
        label: "Paper Writing",
        prompt: "/write-paper Write an IMRAD paper from these analysis results",
        note: "8-phase pipeline. Automatically blocks interpretation from leaking into Results",
      },
      {
        name: "check-reporting",
        label: "Reporting Guideline Audit",
        prompt: "/check-reporting Audit manuscript.docx against STROBE",
        note: "Supports 48 guidelines (STROBE, STARD, PRISMA, CONSORT, TRIPOD+AI, etc.)",
      },
      {
        name: "self-review",
        label: "Self Review",
        prompt: "/self-review Review this manuscript before submission",
        note: "Reviewer-perspective check across 10 categories. Major/Minor classification",
      },
      {
        name: "find-journal",
        label: "Journal Recommendation",
        prompt: "/find-journal Recommend suitable journals for this manuscript",
        note: "Semantic matching against 40 journal scope profiles",
      },
    ],
  },
  {
    emoji: "4",
    title: "I got reviewer comments",
    description: "You need to respond to peer-review comments",
    skills: [
      {
        name: "revise",
        label: "Revision Response",
        prompt: "/revise Parse reviewer comments and draft a point-by-point response",
        note: "Auto-classifies MAJOR/MINOR, generates change log, includes cover letter",
      },
    ],
  },
  {
    emoji: "5",
    title: "I want to run a meta-analysis",
    description: "Full systematic review + meta-analysis pipeline",
    skills: [
      {
        name: "meta-analysis",
        label: "Meta-Analysis",
        prompt: "/meta-analysis Run a meta-analysis on BCG vaccination",
        note: "8 stages: protocol, search, screening, extraction, RoB, synthesis, interpretation, reporting",
      },
    ],
  },
  {
    emoji: "6",
    title: "I need to prepare a presentation",
    description: "You need to turn a paper into slides",
    skills: [
      {
        name: "present-paper",
        label: "Presentation Prep",
        prompt: "/present-paper Create a 15-minute presentation from this paper",
        note: "Audience-adapted script, PPTX speaker notes, anticipated Q&A",
      },
    ],
  },
  {
    emoji: "7",
    title: "I want to do cross-national or batch research",
    description: "Replicate studies across databases or run exposure × outcome matrices",
    skills: [
      {
        name: "replicate-study",
        label: "Study Replication",
        prompt: "/replicate-study Replicate Joo 2026 (depression→diabetes) on KNHANES 2018",
        note: "Extracts methodology from source paper, maps variables, generates analysis code + difference report",
      },
      {
        name: "cross-national",
        label: "Cross-National Comparison",
        prompt: "/cross-national Compare depression→diabetes between Korea (KNHANES) and US (NHANES)",
        note: "Parallel survey analysis with no data pooling. Built-in variable coding references",
      },
      {
        name: "batch-cohort",
        label: "Batch Cohort Analysis",
        prompt: "/batch-cohort Run 6 exposures × 3 outcomes on KNHANES 2018",
        note: "One validated template, N combinations. Self-adjustment prevention, EPV checks, Bonferroni correction",
      },
    ],
  },
];

export default function ContentEn({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 3. Skills by Situation</h1>
      <p className="mt-2 text-foreground/60">
        &quot;Which skill should I use right now?&quot; Find the right skill for
        your current research stage below.
        <br />
        Copy any example prompt as-is and run it directly.
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
                    <p className="text-xs text-foreground/40">Example prompt</p>
                    <code className="mt-1 block break-all text-sm text-foreground/70">
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
          Not sure which skill to use?
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Just describe what you want in plain language to{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">/orchestrate</code>.
          The Orchestrator will automatically pick the right skill and run it for you.
        </p>
        <div className="mt-3 rounded-lg border border-border bg-surface p-3">
          <code className="break-all text-sm text-foreground/70">
            /orchestrate I want to take this CSV data through an entire research pipeline
          </code>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/first-pipeline`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; Previous: First Pipeline
        </Link>
        <Link
          href={`/${lang}/skills/guide/customize`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Next: Customize &rarr;
        </Link>
      </div>
    </div>
  );
}
