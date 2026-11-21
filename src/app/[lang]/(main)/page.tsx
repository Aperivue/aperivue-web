import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates, SKILL_COUNT } from "@/lib/seo";
import { getLectureStats } from "@/lib/lectures";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  // title/description/openGraph inherit from the root layout; only canonical + hreflang here.
  return { alternates: buildAlternates(lang, "") };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).home;
  const stats = getLectureStats(lang);

  const lecturesDesc = stats
    ? `${t.lecturesDesc} ${t.lecturesCount
        .replace("{year}", stats.year)
        .replace("{count}", String(stats.sessions))}`
    : t.lecturesDesc;

  const rows = [
    { title: t.radsTitle, desc: t.radsDesc, href: `/${lang}/rads`, link: t.radsLink },
    {
      title: t.skillsTitle,
      desc: t.skillsDesc.replace("{count}", String(SKILL_COUNT)),
      href: `/${lang}/skills`,
      link: t.skillsLink,
    },
    { title: t.lecturesTitle, desc: lecturesDesc, href: `/${lang}/lectures`, link: t.lecturesLink },
  ];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{t.title}</h1>
      <p className="mt-6 break-keep text-lg leading-relaxed text-foreground/80">{t.intro}</p>

      <ul className="mt-14 border-t border-border">
        {rows.map((row) => (
          <li key={row.href} className="border-b border-border py-8">
            <h2 className="text-xl font-semibold tracking-tight">{row.title}</h2>
            <p className="mt-2 break-keep leading-relaxed text-foreground/80">{row.desc}</p>
            <Link
              href={row.href}
              className="mt-3 inline-block font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >
              {row.link} &rarr;
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
