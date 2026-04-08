import Link from "next/link";
import StepCard from "@/components/guide/StepCard";

export default function FirstPipelineContentEn({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 2. Run Your First Pipeline</h1>
      <p className="mt-2 text-foreground/60">
        Run a full end-to-end research pipeline using sklearn&apos;s built-in
        breast cancer dataset.
        <br />
        No data download required — you can start right away.
      </p>

      {/* What you'll get */}
      <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="font-semibold text-primary">What this demo produces</h2>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">Manuscript draft</p>
            <p className="mt-1 text-foreground/50">
              IMRAD structure, ~2,200 words, DOCX/PDF
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">4 Figures</p>
            <p className="mt-1 text-foreground/50">
              ROC curve, Confusion Matrix, 300 DPI
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">STARD audit report</p>
            <p className="mt-1 text-foreground/50">
              30-item checklist with revision suggestions
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="font-medium">Presentation slides</p>
            <p className="mt-1 text-foreground/50">
              12-slide PPTX with speaker notes
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <div className="mt-8 space-y-6">
        <StepCard number={1} title="Enter the prompt in Claude Code Desktop">
          <p>Open Claude Code Desktop and type the following:</p>
          <div className="mt-3 rounded-lg border border-border bg-surface p-4">
            <code className="block whitespace-pre-wrap text-sm text-foreground/80">
              {`/orchestrate Run an end-to-end diagnostic accuracy study using sklearn's load_breast_cancer data. Include analysis, figures, manuscript draft, STARD audit, and presentation slides.`}
            </code>
          </div>
          <p className="mt-3 text-xs text-foreground/40">
            You can also type in Korean — Claude understands both languages.
          </p>
        </StepCard>

        <StepCard number={2} title="Watch the pipeline run automatically">
          <p>
            Claude chains the following skills in sequence. When a permission
            prompt appears, click &quot;Allow&quot; to continue.
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">1.</span>
              <span>
                <strong>analyze-stats</strong> — loads the data, generates Table 1,
                trains and compares 3 models (LR, RF, SVM)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">2.</span>
              <span>
                <strong>make-figures</strong> — produces 4 figures: ROC curve,
                Confusion Matrix, Calibration Plot, and more
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">3.</span>
              <span>
                <strong>write-paper</strong> — drafts a full IMRAD manuscript
                (Title, Abstract, Introduction, Methods, Results, Discussion)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">4.</span>
              <span>
                <strong>check-reporting</strong> — audits the draft against the
                STARD 2015 checklist (30 items)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 font-mono text-primary">5.</span>
              <span>
                <strong>present-paper</strong> — generates a 12-slide PPTX deck
                with speaker notes
              </span>
            </li>
          </ol>
          <p className="mt-3 text-xs text-foreground/40">
            Total time: approximately 5 minutes (varies with network speed)
          </p>
        </StepCard>

        <StepCard number={3} title="Review the output">
          <p>
            Once the pipeline finishes, Claude will show you where the files are
            saved — typically in your current working folder.
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <p>Key files:</p>
            <ul className="space-y-1 text-foreground/60">
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">manuscript_draft.docx</code>{" "}
                — manuscript draft
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">figures/</code>{" "}
                — ROC, Confusion Matrix, and other 300 DPI images
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">stard_compliance_report.md</code>{" "}
                — STARD audit results
              </li>
              <li>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">presentation.pptx</code>{" "}
                — presentation slides
              </li>
            </ul>
          </div>
        </StepCard>

        <StepCard number={4} title="Try it with your own data">
          <p>
            If the demo worked well, try running a pipeline on your own data:
          </p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">Have a CSV or Excel file?</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /orchestrate Run a diagnostic accuracy study using data.csv
                </code>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">Have a manuscript draft?</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /check-reporting Audit manuscript.docx against the STROBE guideline
                </code>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="font-medium">Only have a topic so far?</p>
              <div className="mt-2 rounded-lg border border-border bg-surface p-3">
                <code className="text-xs text-foreground/80">
                  /search-lit Search PubMed for literature on &quot;AI lung nodule diagnostic accuracy&quot;
                </code>
              </div>
            </div>
          </div>
        </StepCard>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/install`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; Previous: Installation
        </Link>
        <Link
          href={`/${lang}/skills/guide/skills`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Next: Skills by Scenario &rarr;
        </Link>
      </div>
    </div>
  );
}
