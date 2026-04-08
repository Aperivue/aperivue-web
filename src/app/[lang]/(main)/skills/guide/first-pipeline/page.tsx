import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import FirstPipelineContentKo from "./content.ko";
import FirstPipelineContentEn from "./content.en";

export const metadata: Metadata = {
  title: "Run Your First Pipeline — MedSci Skills Guide",
  description:
    "End-to-end demo: generate a manuscript draft, 4 figures, STARD audit, and presentation slides from public data.",
};

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
