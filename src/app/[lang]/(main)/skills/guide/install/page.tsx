import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import InstallContentKo from "./content.ko";
import InstallContentEn from "./content.en";
import { buildAlternates, SKILL_COUNT } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Installation Guide — Claude Code Desktop + MedSci Skills",
    description: `Step-by-step guide: install Claude Code Desktop and ${SKILL_COUNT} MedSci Skills. No terminal needed.`,
    alternates: buildAlternates(lang, "/skills/guide/install"),
  };
}

export default async function InstallPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <InstallContentKo lang={lang} />
  ) : (
    <InstallContentEn lang={lang} />
  );
}
