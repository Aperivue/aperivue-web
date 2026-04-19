import fs from "fs";
import path from "path";
import matter from "gray-matter";

const LECTURES_DIR = path.join(process.cwd(), "src/content/lectures");

export type LectureStatus = "completed" | "upcoming";

export interface Testimonial {
  quote: string;
  attribution?: string;
}

export interface LectureMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  status: LectureStatus;
  institution: string;
  department?: string;
  locationCity?: string;
  audience?: string;
  participantsCount?: number;
  cover?: string;
  photos?: string[];
  testimonials?: Testimonial[];
  recapUrl?: string;
  tags: string[];
}

export interface Lecture extends LectureMeta {
  content: string;
}

function resolveFilename(slug: string, lang: string): string | null {
  const langFile = `${slug}.${lang}.mdx`;
  const fallback = `${slug}.mdx`;
  if (fs.existsSync(path.join(LECTURES_DIR, langFile))) return langFile;
  if (fs.existsSync(path.join(LECTURES_DIR, fallback))) return fallback;
  // fall back to "ko" if the requested lang file doesn't exist
  const koFile = `${slug}.ko.mdx`;
  if (fs.existsSync(path.join(LECTURES_DIR, koFile))) return koFile;
  return null;
}

function parseLectureFile(filename: string, slug: string): LectureMeta {
  const raw = fs.readFileSync(path.join(LECTURES_DIR, filename), "utf-8");
  const { data } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "1970-01-01",
    status: (data.status as LectureStatus) ?? "completed",
    institution: data.institution ?? "",
    department: data.department,
    locationCity: data.locationCity,
    audience: data.audience,
    participantsCount: data.participantsCount,
    cover: data.cover,
    photos: data.photos ?? [],
    testimonials: data.testimonials ?? [],
    recapUrl: data.recapUrl,
    tags: data.tags ?? [],
  };
}

function uniqueSlugs(): string[] {
  if (!fs.existsSync(LECTURES_DIR)) return [];
  const files = fs.readdirSync(LECTURES_DIR).filter((f) => f.endsWith(".mdx"));
  const slugs = new Set<string>();
  for (const f of files) {
    const slug = f.replace(/\.(ko|en)\.mdx$/, "").replace(/\.mdx$/, "");
    slugs.add(slug);
  }
  return [...slugs];
}

export function getAllLectures(lang: string = "ko"): LectureMeta[] {
  const lectures: LectureMeta[] = [];
  for (const slug of uniqueSlugs()) {
    const filename = resolveFilename(slug, lang);
    if (filename) lectures.push(parseLectureFile(filename, slug));
  }
  return lectures.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getLectureBySlug(
  slug: string,
  lang: string = "ko"
): Lecture | null {
  const filename = resolveFilename(slug, lang);
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(LECTURES_DIR, filename), "utf-8");
  const { content } = matter(raw);
  const meta = parseLectureFile(filename, slug);

  return { ...meta, content };
}

export function getAllLectureSlugs(): string[] {
  return uniqueSlugs();
}
