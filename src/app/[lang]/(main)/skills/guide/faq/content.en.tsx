import Link from "next/link";

const faqs = [
  {
    q: "Do I need a Claude subscription?",
    a: "Yes. Claude Code requires a Claude Pro ($20/month) or Max ($100/month) subscription. It cannot be used with a free account. Pro is sufficient for most research tasks, but Max provides more stability for large datasets or lengthy manuscript work.",
  },
  {
    q: "Is my data safe from leakage?",
    a: "Claude Code does not use conversation data for model training (per Anthropic's policy). However, data is transmitted to Anthropic's servers for processing. Always de-identify sensitive patient data before use. Compliance with IRB regulations remains the researcher's responsibility.",
  },
  {
    q: "Can I use prompts in languages other than English?",
    a: "Yes. Claude understands many languages well, including Korean, Chinese, and Japanese. Manuscript drafts default to English output. If you need a different language, simply add an instruction like 'Write in Korean' to your prompt.",
  },
  {
    q: "Does it work offline?",
    a: "No. Claude Code requires an internet connection to communicate with Anthropic's servers.",
  },
  {
    q: "What if results differ from my SPSS/R analysis?",
    a: "MedSci Skills generates and executes Python/R code. If results differ, compare the statistical method used, parametric vs. non-parametric choice, and missing value handling. All generated code is fully transparent and available for your review.",
  },
  {
    q: "Does it work on Windows?",
    a: "Yes. Claude Code Desktop supports both macOS and Windows. Some Python packages may require additional setup on Windows (e.g., Visual C++ Build Tools). Claude will suggest a fix if an error occurs.",
  },
  {
    q: "Can I run a meta-analysis without knowing R?",
    a: "Yes. The meta-analysis skill automatically generates and executes R code. R must be installed on your machine, but you do not need to write R syntax yourself. Simply ask Claude to 'run a meta-analysis' and it will handle the rest.",
  },
  {
    q: "Can I install just one skill?",
    a: "Yes. For example, if you only need reporting guideline audits, copy just the check-reporting folder. That said, installing the orchestrate skill alongside it enables automatic routing, which is more convenient.",
  },
  {
    q: "Can I submit a paper written with this tool?",
    a: "Yes. However, we recommend disclosing AI tool usage to the journal. Most journals now require AI use to be documented in the Methods or Acknowledgements section. MedSci Skills automatically logs tool usage, helping you maintain transparency.",
  },
  {
    q: "How do I update the skills?",
    a: "The easiest way: tell Claude 'Update MedSci Skills from https://github.com/Aperivue/medsci-skills' and it will pull the latest version and overwrite the files. Alternatively, download the latest ZIP from GitHub and overwrite the skills/ folder manually. If you have customized any skills, back them up before overwriting.",
  },
  {
    q: "Do I need to memorize slash commands?",
    a: "No. You can describe what you need in plain language — for example, 'search PubMed for lung nodule AI studies' or 'check my manuscript against STARD guidelines.' Claude will automatically pick the right skill. Slash commands like /search-lit or /check-reporting are available as shortcuts, but they are entirely optional.",
  },
  {
    q: "Do I need any programming knowledge?",
    a: "No. MedSci Skills were built by a physician with no programming background. You interact with Claude in natural language — the same way you would explain a task to a colleague. Claude handles the code, file management, and tool selection behind the scenes. The only technical skill you need is your own research expertise.",
  },
];

export default function FaqContentEn({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <p className="mt-2 text-foreground/60">
        Common questions about using MedSci Skills.
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
        <h2 className="font-semibold">Have a question not listed here?</h2>
        <p className="mt-2 text-sm text-foreground/60">
          Open a GitHub Issue or ask us directly at a workshop.
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
            href={`/${lang}/about#contact`}
            className="rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-surface"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/customize`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; Previous: Customize
        </Link>
        <Link
          href={`/${lang}/skills/guide`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          Back to Guide
        </Link>
      </div>
    </div>
  );
}
