import Link from "next/link";
import StepCard from "@/components/guide/StepCard";
import OsTab from "@/components/guide/OsTab";
import { SKILL_COUNT } from "@/lib/seo";

export default function InstallContentEn({ lang }: { lang: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Step 1. Installation</h1>
      <p className="mt-2 text-foreground/60">
        Install the Claude Code Desktop app and copy all {SKILL_COUNT} MedSci Skills.
        <br />
        No terminal or command line required.
      </p>

      {/* Quick Start */}
      <section className="mt-8 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
        <h2 className="text-lg font-bold text-primary">Quick Start — Just ask Claude</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Already have Claude Code installed? You don&apos;t need to download anything manually.
          Just paste this into Claude Code:
        </p>

        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium text-foreground/40">Copy &amp; paste into Claude Code</p>
          <p className="mt-2 text-sm text-foreground/80">
            &quot;Install MedSci Skills from https://github.com/Aperivue/medsci-skills — clone the repo and copy all skill folders into ~/.claude/skills/&quot;
          </p>
        </div>

        <p className="mt-4 text-sm text-foreground/70">
          Claude will handle the rest — cloning the repository, copying the files, and confirming the installation.
          That&apos;s it. You can start using the skills right away.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-muted p-4">
          <p className="text-xs font-medium text-foreground/40">Try a skill in natural language</p>
          <div className="mt-2 space-y-2 text-sm text-foreground/80">
            <p>&quot;Search PubMed for recent studies on AI-assisted lung nodule detection and give me the top 10 results&quot;</p>
            <p>&quot;Check my manuscript against STARD 2015 guidelines&quot;</p>
            <p>&quot;Analyze this CSV and generate a demographics table with appropriate statistics&quot;</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-foreground/40">
          No slash commands required. Just describe what you need in plain English.
          Claude will pick the right skill automatically.
        </p>

        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-medium text-foreground/40">Prefer a terminal? One command (Node 18+) — with update reminders</p>
          <pre className="mt-2 overflow-x-auto rounded bg-muted px-3 py-2 text-sm"><code>npx medsci-skills install --enable-update-notify</code></pre>
          <p className="mt-2 text-xs text-foreground/60">
            Installs every skill from{" "}
            <a
              href="https://www.npmjs.com/package/medsci-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              npm
            </a>
            {" "}— nothing to clone. Also{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">npx medsci-skills list</code>
            {" "}and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">doctor</code>.
          </p>
        </div>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-foreground/30">OR INSTALL MANUALLY</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-6 space-y-6">
        <StepCard number={1} title="Download Claude Code Desktop">
          <p>
            Claude Code Desktop is the official desktop app by Anthropic.
            It works just like any regular application — no terminal needed.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-muted p-4">
            <p className="text-xs font-medium text-foreground/50">Download link</p>
            <p className="mt-1">
              Go to{" "}
              <a
                href="https://claude.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                claude.ai/download
              </a>
              {" "}and download the version for your operating system.
            </p>
          </div>
          <OsTab
            mac={
              <div className="space-y-2">
                <p>1. Double-click the downloaded <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.dmg</code> file.</p>
                <p>2. Drag the Claude Code icon into the Applications folder.</p>
                <p>3. Launch Claude Code from Applications.</p>
                <p>4. Sign in with your Anthropic account.</p>
              </div>
            }
            windows={
              <div className="space-y-2">
                <p>1. Run the downloaded <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.exe</code> installer.</p>
                <p>2. Follow the setup wizard.</p>
                <p>3. Launch Claude Code from the Start menu.</p>
                <p>4. Sign in with your Anthropic account.</p>
              </div>
            }
          />
        </StepCard>

        <StepCard number={2} title="Download MedSci Skills">
          <p>
            Download the skills as a ZIP file from GitHub.
            You do not need to use{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">git clone</code>.
          </p>
          <div className="mt-4 space-y-3">
            <p>
              1. Visit{" "}
              <a
                href="https://github.com/Aperivue/medsci-skills"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline"
              >
                github.com/Aperivue/medsci-skills
              </a>
            </p>
            <p>
              2. Click the green{" "}
              <span className="inline-flex items-center rounded-md bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                &lt;&gt; Code
              </span>{" "}
              button.
            </p>
            <p>3. Click <strong>Download ZIP</strong>.</p>
            <p>4. Extract the downloaded ZIP file.</p>
          </div>
          <img
            src="/images/guide/guide-github-download.png"
            alt="GitHub Download ZIP button"
            className="mt-4 rounded-xl border border-border"
          />
        </StepCard>

        <StepCard number={3} title="Copy the skills folder">
          <p>
            Copy the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> folder
            from the extracted archive into Claude Code&apos;s skills directory.
          </p>
          <OsTab
            mac={
              <div className="space-y-3">
                <p>1. Open <strong>Finder</strong>.</p>
                <p>
                  2. From the menu bar, select <strong>Go &gt; Go to Folder</strong> (shortcut:{" "}
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">Cmd + Shift + G</kbd>).
                </p>
                <p>3. Enter the following path:</p>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <code className="text-sm text-foreground/80">~/.claude/</code>
                </div>
                <p>
                  4. If there is no <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> folder
                  inside <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude</code>, create one.
                </p>
                <p>
                  5. Copy <strong>all folders</strong> from{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">medsci-skills-main/skills/</code>{" "}
                  into{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">~/.claude/skills/</code>.
                </p>
                <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <p className="font-semibold text-primary">Expected structure</p>
                  <pre className="mt-2 text-foreground/60">
{`~/.claude/skills/
├── analyze-stats/
│   └── SKILL.md
├── check-reporting/
│   └── SKILL.md
├── orchestrate/
│   └── SKILL.md
├── write-paper/
│   └── SKILL.md
└── ... (${SKILL_COUNT} folders total)`}
                  </pre>
                </div>
              </div>
            }
            windows={
              <div className="space-y-3">
                <p>1. Open <strong>File Explorer</strong>.</p>
                <p>2. Type the following path in the address bar:</p>
                <div className="rounded-lg border border-border bg-surface p-3">
                  <code className="text-sm text-foreground/80">%USERPROFILE%\.claude\</code>
                </div>
                <p>
                  3. If there is no <code className="rounded bg-muted px-1.5 py-0.5 text-xs">skills</code> folder
                  inside <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude</code>, create one.
                </p>
                <p>
                  4. Copy <strong>all folders</strong> from{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">medsci-skills-main\skills\</code>{" "}
                  into{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.claude\skills\</code>.
                </p>
                <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
                  <p className="font-semibold text-primary">Note</p>
                  <p className="mt-1 text-foreground/60">
                    Folders starting with a dot (like <code>.claude</code>) may be hidden on Windows.
                    In File Explorer, go to <strong>View &gt; Show &gt; Hidden items</strong> to reveal them.
                  </p>
                </div>
              </div>
            }
          />
        </StepCard>

        <StepCard number={4} title="Verify the installation">
          <p>Restart Claude Code Desktop and check that the skills are loaded.</p>
          <div className="mt-4 space-y-3">
            <p>1. Quit Claude Code Desktop completely, then reopen it.</p>
            <p>2. Type the following in the chat:</p>
            <div className="rounded-lg border border-border bg-surface p-3">
              <code className="text-sm text-foreground/80">
                /orchestrate List all available skills
              </code>
            </div>
            <p>3. If you see a list of {SKILL_COUNT} skills, the installation is complete.</p>
          </div>
          <img
            src="/images/guide/guide-orchestrate-result.png"
            alt="/orchestrate output in Claude Code Desktop"
            className="mt-4 rounded-xl border border-border"
          />
        </StepCard>

        <StepCard number={5} title="Install Python (optional)">
          <p>
            Python is required for statistical analysis
            (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">analyze-stats</code>) and
            figure generation
            (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">make-figures</code>).
          </p>
          <div className="mt-3 rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-medium text-foreground/50">Only if needed</p>
            <p className="mt-1 text-sm text-foreground/60">
              Text-based skills like literature search, reporting guideline checks, and manuscript
              drafting work without Python. You can skip this step for now and install later.
            </p>
          </div>
          <OsTab
            mac={
              <div className="space-y-2">
                <p>
                  1. Download Python 3.11 or later from{" "}
                  <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    python.org/downloads
                  </a>
                </p>
                <p>2. Run the installer with the default settings.</p>
                <p>3. Claude Code will install the required libraries automatically — nothing else to do.</p>
              </div>
            }
            windows={
              <div className="space-y-2">
                <p>
                  1. Download Python 3.11 or later from{" "}
                  <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    python.org/downloads
                  </a>
                </p>
                <p>2. During installation, make sure to check <strong>&quot;Add Python to PATH&quot;</strong>.</p>
                <p>3. Claude Code will install the required libraries automatically.</p>
              </div>
            }
          />
        </StepCard>
      </div>

      <section className="mt-10 rounded-2xl border border-border bg-muted p-6">
        <h2 className="font-semibold">Trouble installing?</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium">Nothing happens when I type &quot;/orchestrate&quot;</dt>
            <dd className="mt-1 text-foreground/60">
              Double-check the skills folder path. Each skill folder must contain a{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs">SKILL.md</code> file.
              Verify that{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs">~/.claude/skills/orchestrate/SKILL.md</code>{" "}
              exists.
            </dd>
          </div>
          <div>
            <dt className="font-medium">Claude Code Desktop won&apos;t launch</dt>
            <dd className="mt-1 text-foreground/60">
              Make sure your Anthropic account has an active subscription (Pro or Max).
              Claude Code is not available on free accounts.
            </dd>
          </div>
          <div>
            <dt className="font-medium">I can&apos;t see the .claude folder on macOS</dt>
            <dd className="mt-1 text-foreground/60">
              Press{" "}
              <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs">Cmd + Shift + .</kbd>
              {" "}in Finder to show hidden files. Alternatively, use <strong>Go &gt; Go to Folder</strong> and type the path directly.
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-foreground/40">
          More questions? Check the{" "}
          <Link href={`/${lang}/skills/guide/faq`} className="text-primary underline">FAQ page</Link>.
        </p>
      </section>

      <div className="mt-10 flex justify-end">
        <Link
          href={`/${lang}/skills/guide/first-pipeline`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Next: Run your first pipeline &rarr;
        </Link>
      </div>
    </div>
  );
}
