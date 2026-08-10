import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, locales, type Locale } from "../../../dictionaries";
import skillsEn from "@/content/data/skills.en.json";
import skillsKo from "@/content/data/skills.ko.json";
import { buildAlternates, ogUrl, DEFAULT_OG_IMAGES } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

const skillsData = { en: skillsEn, ko: skillsKo };
const GITHUB_URL = "https://github.com/Aperivue/medsci-skills";

type Skill = {
  name: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  isNew?: boolean;
};

function findSkill(lang: Locale, slug: string): Skill | undefined {
  return skillsData[lang].skills.find((s) => s.name === slug) as Skill | undefined;
}

export function generateStaticParams() {
  // Every locale × every skill slug — fully static, no runtime fetch.
  return locales.flatMap((lang) =>
    skillsEn.skills.map((s) => ({ lang, slug: s.name })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const skill = findSkill(lang as Locale, slug);
  if (!skill) return {};
  const title = `${skill.title} (/${skill.name}) — Claude Code skill`;
  return {
    title,
    description: skill.description,
    alternates: buildAlternates(lang, `/skills/${slug}`),
    openGraph: {
      title,
      description: skill.description,
      url: ogUrl(lang, `/skills/${slug}`),
      images: DEFAULT_OG_IMAGES,
    },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const skill = findSkill(lang as Locale, slug);
  if (!skill) notFound();
  const t = (await getDictionary(lang as Locale)).skills;

  const related = skillsData[lang as Locale].skills
    .filter((s) => s.category === skill.category && s.name !== skill.name)
    .slice(0, 4) as Skill[];

  const catLabel =
    (t.categoryLabels as Record<string, string>)[skill.category] ?? skill.category;
  const installCmd = `git clone https://github.com/aperivue/medsci-skills.git
cp -r medsci-skills/skills/${skill.name} ~/.claude/skills/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: skill.title,
    description: skill.description,
    codeRepository: `${GITHUB_URL}/tree/main/skills/${skill.name}`,
    programmingLanguage: "Claude Code Skill",
    license: "https://opensource.org/licenses/MIT",
    url: ogUrl(lang, `/skills/${skill.name}`),
    isAccessibleForFree: true,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <JsonLd data={jsonLd} />

      <Link
        href={`/${lang}/skills`}
        className="text-sm font-medium text-foreground/50 transition-colors hover:text-primary"
      >
        &larr; {t.detailBack}
      </Link>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{skill.title}</h1>
          <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-mono text-accent-text">
            /{skill.name}
          </span>
          {skill.isNew && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              NEW
            </span>
          )}
        </div>
        <Link
          href={`/${lang}/skills`}
          className="mt-3 inline-block text-xs font-medium uppercase tracking-widest text-accent-text hover:underline"
        >
          {catLabel}
        </Link>
      </header>

      {/* What it does */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          {t.detailWhatItDoes}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/80">
          {skill.description}
        </p>
      </section>

      {/* Highlights */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          {t.detailHighlights}
        </h2>
        <ul className="mt-3 space-y-2">
          {skill.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
              <span className="mt-0.5 text-primary">&#x2713;</span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* Install */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          {t.detailInstall}
        </h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface p-5">
          <pre className="overflow-x-auto text-sm">
            <code className="text-foreground/80">{installCmd}</code>
          </pre>
        </div>
      </section>

      {/* Links */}
      <section className="mt-8 flex flex-wrap gap-4">
        <a
          href={`${GITHUB_URL}/blob/main/docs/skills/${skill.name}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t.detailDocs} &rarr;
        </a>
        <a
          href={`${GITHUB_URL}/tree/main/skills/${skill.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
        >
          {t.detailViewSource}
        </a>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
            {t.detailRelated}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.name}
                href={`/${lang}/skills/${r.name}`}
                className="rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
              >
                <span className="font-semibold">{r.title}</span>
                <span className="ml-2 font-mono text-xs text-accent-text">
                  /{r.name}
                </span>
                <p className="mt-1 line-clamp-2 text-xs text-foreground/60">
                  {r.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
