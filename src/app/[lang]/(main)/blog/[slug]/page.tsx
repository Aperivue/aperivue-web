import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { hasLocale, type Locale } from "../../../dictionaries";
import { MDXContent } from "@/components/MDXContent";
import { buildAlternates, DEFAULT_OG_IMAGES } from "@/lib/seo";

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
    alternates: buildAlternates(lang, `/blog/${slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      tags: post.tags,
      siteName: "Aperivue",
      url: `https://aperivue.com/${lang}/blog/${slug}`,
      images: DEFAULT_OG_IMAGES,
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
      <div className="mb-10 text-sm">
        <Link
          href={`/${lang}/blog`}
          className="text-foreground/60 hover:text-primary"
        >
          ← {lang === "ko" ? "블로그" : "Blog"}
        </Link>
      </div>
      <article>
        <header className="border-b border-border pb-10">
          {post.tags.length > 0 && (
            <p className="mb-4 text-xs font-medium tracking-widest text-accent-text uppercase">
              {post.tags[0]}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 text-lg text-foreground/60 leading-relaxed">
              {post.description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-4 text-sm text-foreground/50">
            <time>{formatDate(post.date, lang)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            <span aria-hidden>·</span>
            <span>Yoojin Nam, M.D.</span>
          </div>
          {post.tags.length > 1 && (
            <div className="mt-5 flex flex-wrap gap-2">
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

        <div className="prose prose-zinc mt-12 max-w-none dark:prose-invert">
          <MDXContent source={post.content} />
        </div>
      </article>
    </main>
  );
}
