import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export interface Post extends PostMeta {
  content: string;
}

function resolveFilename(slug: string, lang: string): string | null {
  const langFile = `${slug}.${lang}.mdx`;
  const enFile = `${slug}.en.mdx`;
  if (fs.existsSync(path.join(POSTS_DIR, langFile))) return langFile;
  if (fs.existsSync(path.join(POSTS_DIR, enFile))) return enFile;
  return null;
}

function parsePostFile(filename: string, slug: string): PostMeta {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "1970-01-01",
    tags: data.tags ?? [],
    readingTime: stats.text,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const slugs = new Set<string>();
  for (const f of files) {
    const slug = f.replace(/\.(ko|en)\.mdx$/, "").replace(/\.mdx$/, "");
    slugs.add(slug);
  }
  return [...slugs];
}

export function getAllPosts(lang: string = "en"): PostMeta[] {
  const posts: PostMeta[] = [];
  for (const slug of getAllPostSlugs()) {
    const filename = resolveFilename(slug, lang);
    if (filename) posts.push(parsePostFile(filename, slug));
  }
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string, lang: string = "en"): Post | null {
  const filename = resolveFilename(slug, lang);
  if (!filename) return null;
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "1970-01-01",
    tags: data.tags ?? [],
    readingTime: stats.text,
    content,
  };
}
