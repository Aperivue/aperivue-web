import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = (await getDictionary(lang as Locale)).privacy;
  return {
    title: t.title,
    description: t.intro,
    alternates: buildAlternates(lang, "/privacy"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).privacy;

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {t.title}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">{t.effective}</p>
      <p className="mt-6 leading-relaxed text-foreground/80">{t.intro}</p>

      {t.sections.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="text-2xl font-semibold">{section.heading}</h2>
          {section.paragraphs.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-foreground/80">
              {p}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
