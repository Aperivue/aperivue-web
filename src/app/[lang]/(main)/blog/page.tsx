import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";

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
  return { title, description };
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

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {isKo ? "블로그" : "Blog"}
      </h1>
      <p className="mt-4 text-foreground/60">
        {isKo
          ? "의료 AI, 영상의학, 진단 도구 개발에 관한 인사이트."
          : "Insights on medical AI, radiology, and building diagnostic tools."}
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 text-center text-foreground/40">
          <p className="text-lg">
            {isKo ? "아직 포스트가 없습니다." : "No posts yet. Stay tuned!"}
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg"
            >
              <Link href={`/${lang}/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-2 flex gap-3 text-xs text-foreground/50">
                <time>{formatDate(post.date, lang)}</time>
                <span>{post.readingTime}</span>
              </div>
              <p className="mt-3 text-sm text-foreground/70">
                {post.description}
              </p>
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
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
