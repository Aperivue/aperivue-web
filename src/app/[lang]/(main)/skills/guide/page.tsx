import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import GuideContentKo from "./content.ko";
import GuideContentEn from "./content.en";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Getting Started Guide — MedSci Skills",
    description:
      "Step-by-step guide for clinician researchers: install MedSci Skills and run your first research pipeline in 15 minutes.",
    alternates: buildAlternates(lang, "/skills/guide"),
  };
}

export default async function GuideLanding({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <GuideContentKo lang={lang} />
  ) : (
    <GuideContentEn lang={lang} />
  );
}
