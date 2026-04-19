import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { hasLocale, type Locale } from "../../../dictionaries";
import { MDXContent } from "@/components/MDXContent";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.flatMap((slug) => [
    { lang: "en", slug },
    { lang: "ko", slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug, lang);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
      siteName: "Aperivue",
      url: `https://aperivue.com/${lang}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(date: string, lang: string) {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Yoojin Nam",
      url: "https://aperivue.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Aperivue",
      url: "https://aperivue.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://aperivue.com/${lang}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6 text-sm">
        <Link
          href={`/${lang}/blog`}
          className="text-foreground/60 hover:text-primary"
        >
          ← {lang === "ko" ? "블로그" : "Blog"}
        </Link>
      </div>
      <article>
        <header>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex gap-3 text-sm text-foreground/50">
            <time>{formatDate(post.date, lang)}</time>
            <span>{post.readingTime}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
          <MDXContent source={post.content} />
        </div>
      </article>
    </main>
  );
}
