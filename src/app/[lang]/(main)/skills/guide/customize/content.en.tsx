import Link from "next/link";

export default function ContentEn({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 4. Customize</h1>
      <p className="mt-2 text-foreground/60">
        Skills are just text files. Anyone can modify them or create new ones.
      </p>

      {/* Quick way */}
      <section className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
        <h2 className="text-lg font-bold text-primary">The easy way — Just ask Claude</h2>
        <p className="mt-2 text-sm text-foreground/70">
          You don&apos;t need to open any files yourself. Tell Claude what you want changed:
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-foreground/40">Modify an existing skill</p>
            <p className="mt-2 text-sm text-foreground/80">
              &quot;Change check-reporting so it always outputs results in Korean&quot;
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-foreground/40">Create a new skill</p>
            <p className="mt-2 text-sm text-foreground/80">
              &quot;Create a new skill called radiology-report that generates structured radiology reports following ACR guidelines&quot;
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-foreground/40">Update to the latest version</p>
            <p className="mt-2 text-sm text-foreground/80">
              &quot;Update MedSci Skills from https://github.com/Aperivue/medsci-skills to the latest version&quot;
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-foreground/40">
          Claude will edit the SKILL.md files, create folders, and handle everything for you.
          Below is a reference for what happens behind the scenes.
        </p>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-foreground/30">REFERENCE: MANUAL EDITING</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* SKILL.md anatomy */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Anatomy of a Skill</h2>
        <p className="mt-2 text-sm text-foreground/60">
          Every skill lives in a single folder as a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code> file.
          This file tells Claude &quot;here is how you should behave in this situation.&quot;
        </p>
        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-xs font-medium text-foreground/50">SKILL.md basic structure</p>
          <pre className="mt-3 overflow-x-auto text-sm leading-relaxed text-foreground/70">
{`---
name: my-custom-skill
description: Generate report forms tailored to my hospital
triggers:
  - "report"
  - "template"
tools:
  - Read
  - Write
  - Edit
---

# Rules

1. When the user requests a report, follow the template below.
2. De-identify all patient information.
3. Conclusions must always include supporting evidence.

# Template

## Title
## Findings
## Conclusion
## References`}
          </pre>
        </div>
        <div className="mt-4 space-y-2 text-sm text-foreground/60">
          <p>
            <strong>name</strong> — Skill name (should match the folder name)
          </p>
          <p>
            <strong>description</strong> — Helps Claude understand what this skill is for
          </p>
          <p>
            <strong>triggers</strong> — Keywords that automatically activate this skill
          </p>
          <p>
            <strong>tools</strong> — List of tools this skill is allowed to use
          </p>
          <p>
            <strong>Body</strong> — Specific instructions for Claude (plain language)
          </p>
        </div>
      </section>

      {/* How to modify */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Modifying an Existing Skill</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70">
          <p>
            1. Open the skill folder you want to edit inside <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>.
          </p>
          <p>
            2. Open <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code> in any plain-text editor (Notepad, TextEdit, VS Code).
          </p>
          <p>
            3. Edit the parts you need. For example:
          </p>
          <ul className="ml-6 space-y-1 list-disc text-foreground/60">
            <li>Change the default output language</li>
            <li>Adjust formatting to match a specific journal style</li>
            <li>Add rules that reflect your institution&apos;s policies</li>
          </ul>
          <p>
            4. Save the file and restart Claude Code Desktop.
          </p>
        </div>
      </section>

      {/* How to create */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Creating Your Own Skill</h2>
        <div className="mt-4 space-y-3 text-sm text-foreground/70">
          <p>
            1. Create a new folder inside <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>.
          </p>
          <div className="rounded-lg border border-border bg-surface p-3">
            <code className="text-xs text-foreground/80">
              ~/.claude/skills/my-report-template/
            </code>
          </div>
          <p>
            2. Add a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SKILL.md</code> file inside it,
            following the structure shown above.
          </p>
          <p>
            3. Restart Claude Code Desktop and your new skill will be loaded automatically.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">Tip</p>
          <p className="mt-1 text-sm text-foreground/60">
            The fastest way is to duplicate an existing skill and modify it. For instance, copy the{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 text-xs">check-reporting</code> folder,
            rename it, and adjust the checklist to match your hospital&apos;s standards.
          </p>
        </div>
      </section>

      {/* How to update */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Updating Skills</h2>
        <p className="mt-2 text-sm text-foreground/60">
          MedSci Skills are continuously improved. To update to the latest version:
        </p>
        <div className="mt-4 space-y-2 text-sm text-foreground/70">
          <p>
            1. Download the latest ZIP from GitHub.
          </p>
          <p>
            2. Overwrite the existing <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code> with
            the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills/</code> folder from the new ZIP.
          </p>
          <p className="text-xs text-foreground/40">
            If you have customized any skills, back them up before overwriting.
          </p>
        </div>
      </section>

      {/* Harness concept */}
      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">The Role of Orchestrate</h2>
        <p className="mt-2 text-sm text-foreground/60">
          The <code className="rounded bg-surface px-1.5 py-0.5 text-xs">orchestrate</code> skill
          acts as a traffic controller for all other skills. It figures out what you need
          and automatically routes your request to the right skill.
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          When you add your own skills, orchestrate picks them up automatically.
          Just make sure to write clear{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">triggers</code> and a good{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-xs">description</code>.
        </p>
      </section>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <Link
          href={`/${lang}/skills/guide/skills`}
          className="text-sm text-foreground/50 hover:text-primary"
        >
          &larr; Previous: Skills by Situation
        </Link>
        <Link
          href={`/${lang}/skills/guide/faq`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          FAQ &rarr;
        </Link>
      </div>
    </div>
  );
}
