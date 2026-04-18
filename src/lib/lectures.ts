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

function parseLectureFile(filename: string): LectureMeta {
  const slug = filename.replace(/\.mdx$/, "");
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

export function getAllLectures(): LectureMeta[] {
  if (!fs.existsSync(LECTURES_DIR)) return [];

  const files = fs.readdirSync(LECTURES_DIR).filter((f) => f.endsWith(".mdx"));
  const lectures = files.map(parseLectureFile);

  return lectures.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getLectureBySlug(slug: string): Lecture | null {
  const filepath = path.join(LECTURES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { content } = matter(raw);
  const meta = parseLectureFile(`${slug}.mdx`);

  return {
    ...meta,
    content,
  };
}
