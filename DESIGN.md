---
name: Aperivue
version: alpha
description: >
  Clinical, calm, bilingual (Korean + English). Slate neutrals carry ~90 % of every surface; a
  navy-to-cyan brand pair is spent sparingly. Built by a radiologist, for radiologists — specificity
  over hype. Tokens lifted from design-system/colors_and_type.css; this file is self-contained and
  is the authority for anything it states.
colors:
  background: "#f8fafc"
  surface: "#ffffff"
  muted: "#f1f5f9"
  border: "#cbd5e1"
  foreground: "#0f172a"
  primary: "#1e40af"
  primary-dark: "#1e3a8a"
  primary-tint: "rgba(30, 64, 175, 0.10)"
  accent: "#0891b2"
  accent-text: "#0e7490"
  on-brand: "#ffffff"
  fg-1: "#0f172a"
  fg-2: "rgba(15, 23, 42, 0.80)"
  fg-3: "rgba(15, 23, 42, 0.60)"
  fg-4: "rgba(15, 23, 42, 0.40)"
  fg-5: "rgba(15, 23, 42, 0.10)"
  success: "#16a34a"
  success-bg: "rgba(34, 197, 94, 0.10)"
  success-text: "#166534"
  warning: "#d97706"
  warning-bg: "rgba(217, 119, 6, 0.10)"
  warning-text: "#92400e"
  danger: "#dc2626"
  danger-bg: "rgba(220, 38, 38, 0.10)"
  danger-text: "#b91c1c"
  code-surface: "#0f172a"
  code-foreground: "#e2e8f0"
typography:
  display:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  heading-lg:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  heading-md:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  eyebrow:
    fontFamily: "Geist, Inter, Pretendard Variable, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.12em"
  code:
    fontFamily: "Geist Mono, JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
components:
  body-copy:
    background: "{colors.background}"
    foreground: "{colors.fg-2}"
    typography: "{typography.body}"
  heading:
    background: "{colors.background}"
    foreground: "{colors.fg-1}"
    typography: "{typography.heading-lg}"
  meta-text:
    background: "{colors.background}"
    foreground: "{colors.fg-3}"
    typography: "{typography.meta}"
  eyebrow:
    background: "{colors.background}"
    foreground: "{colors.accent-text}"
    typography: "{typography.eyebrow}"
  link:
    background: "{colors.background}"
    foreground: "{colors.primary}"
    typography: "{typography.body}"
  card:
    background: "{colors.surface}"
    foreground: "{colors.fg-2}"
    borderColor: "{colors.border}"
    borderRadius: "{rounded.xl}"
    typography: "{typography.body}"
  icon-tile:
    background: "{colors.primary-tint}"
    foreground: "{colors.primary}"
    borderRadius: "{rounded.md}"
  cta-block:
    background: "{colors.foreground}"
    foreground: "{colors.background}"
    typography: "{typography.body}"
  button-brand-gradient-start:
    background: "{colors.primary}"
    foreground: "{colors.on-brand}"
    borderRadius: "{rounded.full}"
    typography: "{typography.body}"
  button-brand-gradient-end:
    background: "{colors.accent-text}"
    foreground: "{colors.on-brand}"
    borderRadius: "{rounded.full}"
    typography: "{typography.body}"
  code-inline:
    background: "{colors.muted}"
    foreground: "{colors.fg-2}"
    typography: "{typography.code}"
  code-block:
    background: "{colors.code-surface}"
    foreground: "{colors.code-foreground}"
    borderRadius: "{rounded.lg}"
    typography: "{typography.code}"
  status-pill-success:
    background: "{colors.success-bg}"
    foreground: "{colors.success-text}"
    borderRadius: "{rounded.full}"
    typography: "{typography.body-sm}"
  status-pill-warning:
    background: "{colors.warning-bg}"
    foreground: "{colors.warning-text}"
    borderRadius: "{rounded.full}"
    typography: "{typography.body-sm}"
  status-pill-danger:
    background: "{colors.danger-bg}"
    foreground: "{colors.danger-text}"
    borderRadius: "{rounded.full}"
    typography: "{typography.body-sm}"
---

# Aperivue

## Overview

Aperivue sits where clinical radiology, medical-AI research and Korean–English content meet.
Everything it ships is built by a practicing radiologist for radiologists, with an evidence-based,
transparent, no-overselling posture. The interface should read as a clinical instrument, not a
startup landing page: calm slate surfaces, one restrained brand pair, numbers instead of adjectives.

Surfaces sharing this identity: `aperivue.com` (marketing + MDX blog), Aperivue RADS (`/rads/*`
structured-reporting calculators), and the ScrubCode / MedGlow editorial brands.

Copy is bilingual and Korean is first-class, never a translation. Product and modality names stay
Latin (`TI-RADS`, `BI-RADS`, `Claude Code`) and acronyms stay hyphenated ALL-CAPS.

## Colors

Slate neutrals carry roughly 90 % of every surface. Brand is a two-colour navy-to-cyan pair spent
sparingly: `primary` for actions and links, `accent` for eyebrows and the second gradient stop.
Status colours are Tailwind defaults, never invented.

The distinctive tell — and the liability — is that body copy is built from **opacity steps of the
foreground** (`fg-2` / `fg-3` / `fg-4`) rather than a graded grey scale. A step is not the colour it
declares; it is that colour composited over whatever it sits on. Measured:

| step | light, on `background` | dark, on page | dark, on card |
|---|---|---|---|
| `fg-2` (80 %) | 9.29:1 | 10.69:1 | 8.97:1 |
| `fg-3` (60 %) | 4.62:1 | 5.87:1 | 5.28:1 |
| `fg-4` (40 %) | **2.53:1** | **3.32:1** | **3.14:1** |

The ladder therefore supports **three usable text levels, not four**, and the same boundary falls in
the same place in both themes. `fg-4` is a decoration token — dividers, disabled marks, hairlines —
and never carries text. Darkening it is not a fix: the value that clears AA is `#6e737e`, which is
`fg-3` again.

Colours that carry text have an explicit `-text` variant. Every one is a **Tailwind palette step**,
never a bespoke mix — inventing a status colour is against house rules, and the palette already
holds a step that clears AA. `accent` stays cyan-600 for decoration; `accent-text` is cyan-700
`#0e7490`, which an eyebrow uses and which is also where a gradient carrying white text must stop
(white on cyan-600 is 3.68:1, on cyan-700 5.36:1 — one value, two roles, nothing to keep in sync).

Status pills are measured against their own 10 % tint composited over the page, which is what the
eye sees. That tint is lighter than the page, so a pill needs the **-800** step where the same
colour as plain text on the page would clear at -700:

| role | on the page | on its own 10 % tint |
|---|---|---|
| success | green-700 `#15803d` 4.79:1 | green-800 `#166534` 6.29:1 |
| warning | amber-700 `#b45309` 4.80:1 | amber-800 `#92400e` 6.11:1 |
| danger | red-700 `#b91c1c` 6.18:1 | red-700 `#b91c1c` 5.31:1 |

Section rhythm comes from alternating `background` and `muted` bands separated by a 1 px `border`.
The CTA block inverts fully: near-black `foreground` as the surface, `background` as the text.

Dark mode exists via `prefers-color-scheme` and shifts to `#0f172a` surfaces with brighter
`#3b82f6` / `#22d3ee`. The alpha spec has no light/dark concept, so those overrides are **not**
represented in the tokens above — check them separately (see Notes).

## Typography

A single sans for all UI (Geist in production, Inter as the drop-in substitute, Pretendard for
Korean coverage). Tight headline tracking (`-0.02em`) is house style and every `h1` carries it.
Monospace is reserved for code blocks and inline code inside blog posts.

`eyebrow` is ALL-CAPS at 12 px with `0.12em` tracking in accent cyan, and appears above every hero
block as a genre label for the section.

## Layout

`max-w-6xl` (1152 px) is the canonical marketing column; `max-w-4xl` for About and Lectures,
`max-w-3xl` for blog articles, `max-w-5xl` for the RADS index. Horizontal padding is always 24 px
and never collapses to 0 on mobile. Vertical rhythm runs 64–128 px on hero and 80–96 px on inner
sections.

The sticky header is the only place blur is used: `background` at 80 % with a medium backdrop blur
and a 1 px bottom border.

## Elevation & Depth

The Tailwind shadow scale, unmodified. `shadow-lg` appears on card hover; `shadow-xl` is not used.
No coloured shadows, no brand-tinted glows, no inner shadows.

## Shapes

A small, deliberate radius vocabulary: `md` (8 px) for buttons, selects and active nav tabs; `lg`
(12 px) for fieldsets and inner form cards; `xl` (16 px) for top-level cards; `full` for CTA
buttons, status badges and tag chips. Borders are always 1 px solid; dashed marks an empty or
"add another" affordance.

## Components

Card anatomy is fixed: 16 px radius, 1 px border, `surface` background, 32 px padding, shadow on
hover. A status pill sits top-right and a 40×40 icon tile top-left. The flagship RADS card is the
one variant — it adds a `from-primary/5 to-accent/5` overlay and a tinted primary border.

Icons are hand-pasted Heroicons-style inline SVGs, 24×24 viewbox, `stroke="currentColor"`, stroke
width 1.5 on landing pages and 2 in buttons and nav. There is no icon font and no sprite sheet.

## Do's and Don'ts

- **Do** use `fg-3` for meta and caption copy. `fg-4` is decoration only, in both themes.
- **Do** reach for the `-text` variant whenever a brand or status colour carries words:
  `accent-text`, `success-text`, `warning-text`, `danger-text`. The plain token is for decoration.
- **Do** measure every opacity step against the surface it lands on. `fg-3` clears at 4.62:1 with
  almost nothing to spare, so it must never be pushed lighter.
- **Do** keep the eyebrow present above hero blocks — it functions as a section genre label.
- **Do** write numbers instead of adjectives. "10+ peer-reviewed publications", not "extensive".
- **Do** treat Korean as first-class; never pad it to match the English length.
- **Don't** use emoji. The entire glyph vocabulary is `✓` `→` `▶` `×` `·`.
- **Don't** add a gradient full-page background, a texture, a pattern, or a hand-drawn
  illustration. The only gradients permitted are the logo, `bg-clip-text` headline spans, the
  feature-card tint, and the RADS footer banner.
- **Don't** put white text on the cyan end of the brand gradient at body size — white on `accent`
  measures **3.68:1**. Behind text the gradient stops at `accent-text` cyan-700 (5.36:1); the
  full-saturation stop is for text-free surfaces only. Gradient *headlines* (`bg-clip-text`) are
  exempt: every one runs 36 px or larger, so the 3:1 large-text bar applies and accent clears it.
- **Don't** touch the wordmark. WCAG exempts logotypes from contrast requirements, so the accent
  `vue` in the logo stays cyan-600.
- **Don't** substitute another icon family (Lucide, Font Awesome, Material).
- **Don't** invent a status colour. Greens and reds come from the Tailwind defaults above.
- **Don't** say "Revolutionary", or "AI-powered" as a standalone claim. When something is not
  ready it is labelled *In Development* / *개발 중*.

## Notes — not represented in the spec's token groups

### This file is prescriptive; the deployed site has not caught up

A clean validator run means **the system as specified is accessible**. It does not mean
`aperivue.com` is. The tokens above were changed after measurement; the production components were
not. As of 2026-08-10 the following still ship the pre-fix values, because they live in Tailwind
utility classes inside JSX rather than in a token file:

| Where | Current | Measured | Should use |
|---|---|---|---|
| `.ap-meta` / `text-foreground/40` captions | `fg-4` | 2.53:1 | `fg-3` |
| `.ap-eyebrow` — above *every* hero | `accent` | 3.52:1 | `accent-text` |
| White label on the brand gradient's cyan end | `accent` | 3.68:1 | `gradient-text-safe-end` |
| Status pills — success / warning / danger | plain tokens | 2.91 / 2.75 / 3.97:1 | `-text` variants |
| Dark meta on page / on card | 40 % step | 3.32 / 3.14:1 | 60 % step |
| Dark link on a card | `#3b82f6` | 3.98:1 | `#4c8df7` |

`design-system/colors_and_type.css` has been updated, so anything built on the design system picks
the corrected values up already. `src/app/globals.css` and the component JSX have not. Treat the
table above as the remediation backlog, and do not read a green gate as a cleared site.

### Other

**Motion.** Three primitives only: the hero `pulse-ring` keyframe (opacity 0.15→0.4, scale 1→1.03,
3–5 s staggered loops), `transition-opacity`/`transition-colors` at ~150 ms on buttons and links,
and `transition-shadow` on cards. No springs, no parallax, no scroll-triggered reveals.

**Gradients.** `linear-gradient(135deg, #1e40af 0%, #0891b2 100%)` and a 5 %-opacity soft variant.
The spec's `colors` group holds primitives, so these live here.

**Dark mode.** Eight custom properties are redefined under `prefers-color-scheme: dark` and are not
merged into the tokens above, because the DESIGN.md alpha spec has no light/dark concept. They are
carried in `DESIGN.contrast.dark.json` and must be checked as a **separate pass** against a
`#0f172a` page colour — a dark surface cannot be evaluated against the light tokens.

Whatever tool performs the check, two things decide whether its numbers mean anything:

1. **Composite translucency before measuring.** Both the foreground opacity steps and the 10 %
   status tints are transparent. Their declared value is not what reaches the eye; the value
   composited over the surface beneath is. Red on a 10 % red tint reads 1.00:1 uncomposited and
   3.97:1 composited, and only the second number exists on a screen.
2. **Judge each pair at the size it is actually rendered.** WCAG AA is 4.5:1 for normal text but
   3:1 for large text (≥24 px, or ≥18.66 px bold), so one colour can be a failure in a caption and
   fine in a display heading. Sizes for every role are declared in the `typography` tokens above.
