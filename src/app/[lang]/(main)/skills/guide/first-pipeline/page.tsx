import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import FirstPipelineContentKo from "./content.ko";
import FirstPipelineContentEn from "./content.en";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Run Your First Pipeline — MedSci Skills Guide",
    description:
      "End-to-end demo: generate a manuscript draft, 4 figures, STARD audit, and presentation slides from public data.",
    alternates: buildAlternates(lang, "/skills/guide/first-pipeline"),
  };
}

export default async function FirstPipelinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <FirstPipelineContentKo lang={lang} />
  ) : (
    <FirstPipelineContentEn lang={lang} />
  );
}
