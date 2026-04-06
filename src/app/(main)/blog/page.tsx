import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Aperivue blog — Medical AI, radiology, and technology insights.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Blog</h1>
      <p className="mt-4 text-foreground/60">
        Insights on medical AI, radiology, and building diagnostic tools.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 text-center text-foreground/40">
          <p className="text-lg">No posts yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-2 flex gap-3 text-xs text-foreground/50">
                <time>{post.date}</time>
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
