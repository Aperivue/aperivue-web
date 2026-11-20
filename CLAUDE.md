@AGENTS.md

# Aperivue Website

Aperivue (아페리뷰) 회사 웹사이트 + 블로그. Next.js on Vercel.

## Pages
- `/` — Home (hero + features + CTA)
- `/products` — RADS Tool, ScrubCode, MedGlow
- `/about` — Yoojin Nam profile + timeline
- `/blog` — MDX blog listing
- `/blog/[slug]` — Individual posts
- `/contact` — Contact info

## Blog
- Posts go in `src/content/blog/` as a pair: `{slug}.en.mdx` and `{slug}.ko.mdx`
- Frontmatter: title, description, date, tags
- Sorted by date descending
