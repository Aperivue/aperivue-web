@AGENTS.md

# Aperivue Website

Aperivue (아페리뷰) 회사 웹사이트 + 블로그. Next.js on Vercel.

## Tech Stack
- Next.js 16, React 19, Tailwind 4, TypeScript
- MDX blog with gray-matter + reading-time
- Vercel deployment

## Pages
- `/` — Home (hero + features + CTA)
- `/products` — RADS Tool, ScrubCode, MedGlow
- `/about` — Yoojin Nam profile + timeline
- `/blog` — MDX blog listing
- `/blog/[slug]` — Individual posts
- `/contact` — Contact info

## Blog
- Posts go in `src/content/blog/*.mdx`
- Frontmatter: title, description, date, tags
- Sorted by date descending

## Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — ESLint
