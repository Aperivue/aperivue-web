import Link from "next/link";

function getSteps(lang: string) {
  return [
    {
      number: 1,
      title: "Installation",
      description: "Install Claude Code Desktop and the MedSci Skills bundle.",
      href: `/${lang}/skills/guide/install`,
      time: "10 min",
    },
    {
      number: 2,
      title: "First Pipeline",
      description:
        "Run an end-to-end pipeline on public data — manuscript draft, figures, and reporting guideline audit in one go.",
      href: `/${lang}/skills/guide/first-pipeline`,
      time: "5 min",
    },
    {
      number: 3,
      title: "Skills by Scenario",
      description:
        "Find the right skill for your current research stage and start using it immediately.",
      href: `/${lang}/skills/guide/skills`,
      time: "Reference",
    },
    {
      number: 4,
      title: "Customize",
      description:
        "Edit existing skills or create your own to fit your unique workflow.",
      href: `/${lang}/skills/guide/customize`,
      time: "Optional",
    },
  ];
}

export default function GuideContentEn({ lang }: { lang: string }) {
  return (
    <div>
      {/* Hero */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Getting Started Guide
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
          MedSci Skills Quick-Start
          <br />
          for Clinician Researchers
        </h1>
        <p className="mt-4 text-foreground/60">
          No coding experience needed. Just install the Claude Code Desktop app,
          copy 20 research skills, and you are ready to go.
          Your first manuscript draft in 15 minutes.
        </p>
      </section>

      {/* Prerequisites */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">Before You Start</h2>
        <ul className="mt-3 space-y-2 text-sm text-foreground/70">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>Anthropic account</strong> — sign up free at claude.ai
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>Claude subscription</strong> — Pro ($20/mo) or Max ($100/mo).
              Required for statistical analysis and figure generation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">&#x2713;</span>
            <span>
              <strong>Laptop</strong> — macOS or Windows
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-foreground/30">&#x25CB;</span>
            <span>
              (Optional) Your own research data (CSV/Excel) or a manuscript draft
              — we will use a public dataset if you do not have one yet
            </span>
          </li>
        </ul>
      </section>

      {/* Steps */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Step-by-Step</h2>
        <div className="mt-6 space-y-4">
          {getSteps(lang).map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-lg"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {step.number}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold group-hover:text-primary">
                    {step.title}
                  </h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground/40">
                    {step.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground/60">
                  {step.description}
                </p>
              </div>
              <span className="mt-1 text-foreground/30 transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ link */}
      <section className="mt-10 text-center">
        <p className="text-sm text-foreground/50">
          Running into issues?{" "}
          <Link href={`/${lang}/skills/guide/faq`} className="text-primary underline">
            Check the FAQ
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
