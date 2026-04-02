# chiangs.ink

Personal portfolio site for Stephen Chiang — Design Technologist and Product & Technology Leader based in Stavanger, Norway.

## Stack

- **Framework** — React Router v7 (SSR, file-based routes)
- **Styling** — Tailwind CSS v4 (Vite plugin, token-based design system)
- **Animations** — GSAP (timelines, ScrollTrigger, parallax)
- **Content** — MDX with gray-matter frontmatter
- **Data viz** — visx + D3
- **Search** — Fuse.js (fuzzy search)
- **Fonts** — Space Grotesk (display) + Manrope (body) via Google Fonts
- **PWA** — Service worker (Workbox via `vite-plugin-pwa`) + Web App Manifest with maskable icons
- **Deployment** — Vercel (`@vercel/react-router`)
- **Language** — TypeScript (strict)

## Getting Started

```bash
npm install
npm run dev       # Dev server at http://localhost:5173
```

## Commands

```bash
npm run dev        # Dev server with HMR
npm run build      # Production build
npm run typecheck  # React Router typegen + tsc
npm run lint       # ESLint (zero warnings enforced)
npm start          # Serve production build
```

## Project Structure

```
app/
  routes/           # File-based routes (React Router v7)
  components/       # Section components + shared layout
  hooks/            # Client-side React hooks
  lib/              # Utilities, constants, GSAP configs, content loaders
  types/            # Shared TypeScript types
  app.css           # Global styles + @theme design tokens
content/
  work/             # Project MDX files
  writing/          # Article MDX files
public/
  manifest.json     # PWA manifest (hand-authored — vite-plugin-pwa reads it as-is)
  icons/            # PWA icons (96–512px, maskable variants)
  # sw.js + workbox-*.js are generated here at build time by vite-plugin-pwa
.claude/
  DESIGN.md         # Design system — tokens, component patterns, motion
  STRUCTURE.md      # Annotated file tree
```

## Design System

All design decisions live in `.claude/DESIGN.md`. Key rules:

- 0px border radius everywhere
- No border lines for section separation — tonal surface shifts only
- Design tokens defined in `app/app.css` under `@theme` — never raw hex values
- Space Grotesk (weights 300 + 700) for display / Manrope (400, 500, 600) for body

## Content

Work and writing entries are MDX files in `/content`. Items are ordered by the `order` field in frontmatter. Featured items use `featured: true`.
