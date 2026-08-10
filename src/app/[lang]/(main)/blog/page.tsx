import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === "ko";
  const title = isKo ? "블로그" : "Blog";
  const description = isKo
    ? "의료 AI, 영상의학, 진단 도구 개발에 관한 인사이트."
    : "Aperivue blog — Medical AI, radiology, and technology insights.";
  return { title, description, alternates: buildAlternates(lang, "/blog") };
}

function formatDate(date: string, lang: string) {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const posts = getAllPosts(lang);
  const isKo = lang === "ko";

  const [featured, ...rest] = posts;

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <div className="border-b border-border pb-10">
        <p className="mb-3 text-xs font-medium tracking-widest text-accent-text uppercase">
          {isKo ? "아페리뷰 블로그" : "Aperivue Blog"}
        </p>
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
          {isKo ? "인사이트" : "Perspectives"}
        </h1>
        <p className="mt-3 text-foreground/60">
          {isKo
            ? "의료 AI, 영상의학, 진단 도구 개발에 관한 인사이트."
            : "Insights on medical AI, radiology, and building diagnostic tools."}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-16 text-center text-foreground/60">
          <p className="text-lg">
            {isKo ? "아직 포스트가 없습니다." : "No posts yet. Stay tuned!"}
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-0">
          {featured && (
            <article className="border-b border-border py-10">
              {featured.tags.length > 0 && (
                <p className="mb-3 text-xs font-medium tracking-widest text-accent-text uppercase">
                  {featured.tags[0]}
                </p>
              )}
              <Link href={`/${lang}/blog/${featured.slug}`}>
                <h2 className="text-2xl font-bold tracking-tighter hover:text-primary md:text-3xl">
                  {featured.title}
                </h2>
              </Link>
              <p className="mt-3 text-foreground/60 leading-relaxed">
                {featured.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs text-foreground/50">
                <time>{formatDate(featured.date, lang)}</time>
                <span aria-hidden>·</span>
                <span>{featured.readingTime}</span>
              </div>
              <div className="mt-5">
                <Link
                  href={`/${lang}/blog/${featured.slug}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {isKo ? "읽기 →" : "Read →"}
                </Link>
              </div>
            </article>
          )}

          {rest.map((post) => (
            <article
              key={post.slug}
              className="border-b border-border py-8 last:border-b-0"
            >
              {post.tags.length > 0 && (
                <p className="mb-2 text-xs font-medium tracking-widest text-accent-text uppercase">
                  {post.tags[0]}
                </p>
              )}
              <Link href={`/${lang}/blog/${post.slug}`}>
                <h2 className="text-lg font-semibold tracking-tight hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-1 flex items-center gap-3 text-xs text-foreground/50">
                <time>{formatDate(post.date, lang)}</time>
                <span aria-hidden>·</span>
                <span>{post.readingTime}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/60">
                {post.description}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
