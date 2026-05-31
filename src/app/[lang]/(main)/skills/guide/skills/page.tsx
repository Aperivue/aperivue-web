import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import ContentKo from "./content.ko";
import ContentEn from "./content.en";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Skills by Situation — MedSci Skills Guide",
    description:
      "Find the right MedSci Skill for your research stage. From topic exploration and data analysis to paper writing and revision response.",
    alternates: buildAlternates(lang, "/skills/guide/skills"),
  };
}

export default async function SkillsGuidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? <ContentKo lang={lang} /> : <ContentEn lang={lang} />;
}
