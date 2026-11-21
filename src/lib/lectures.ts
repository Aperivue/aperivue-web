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

// Tags that mark an entry as a society invited talk, or as a write-up that looks back on
// sessions already listed separately (so it is not a session of its own).
const INVITED_TAGS = new Set(["학회 초청강연", "Invited talk"]);
const RETROSPECTIVE_TAGS = new Set(["시리즈 회고", "Series retrospective"]);

export const isInvitedTalk = (l: LectureMeta) =>
  l.tags.some((t) => INVITED_TAGS.has(t));

export interface LectureStats {
  year: string;
  sessions: number;
  invited: number;
}

/**
 * Count completed sessions in the year of the most recent completed lecture, read from
 * the content files so the numbers follow whatever lectures exist.
 */
export function getLectureStats(lang: string = "ko"): LectureStats | null {
  const completed = getAllLectures(lang).filter(
    (l) =>
      l.status === "completed" && !l.tags.some((t) => RETROSPECTIVE_TAGS.has(t))
  );
  if (completed.length === 0) return null;
  const year = completed[0].date.slice(0, 4);
  const inYear = completed.filter((l) => l.date.startsWith(year));
  return {
    year,
    sessions: inYear.length,
    invited: inYear.filter(isInvitedTalk).length,
  };
}
