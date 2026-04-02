# Stephen Chiang — Personal Site

Personal site and portfolio for Stephen Chiang,
Design Technologist and Product & Technology Leader.

Built with React Router v7 (framework mode),
Tailwind CSS v4, GSAP, MDX, and Workbox (via vite-plugin-pwa).

---

## Quick Start

```bash
npx create-react-router@latest stephen-chiang-site
cd stephen-chiang-site
npm install
npm run dev
```

## Install dependencies

```bash
# Animation
npm install gsap

# MDX support
npm install @mdx-js/rollup @mdx-js/react
npm install remark-frontmatter remark-mdx-frontmatter
npm install gray-matter

# Types
npm install -D @types/mdx

# PWA / Service Worker
npm install -D vite-plugin-pwa
```

## PWA Setup

`vite-plugin-pwa` is configured in `vite.config.ts`. It:
- Generates `sw.js` + `workbox-*.js` at build time with a precache manifest
- Auto-injects the SW registration script — no manual code in root.tsx needed
- Uses `manifest: false` so `public/manifest.json` is used as-is

Cache strategies:
- Built JS/CSS/HTML: precached at install (content-hash busting)
- `/images/**`: runtime `CacheFirst`, 30-day TTL, 60-entry cap
- Everything else: `NetworkFirst` with cache fallback

The hero portrait (`/images/portrait/stephen-chiang.jpg`) is also served via
`<link rel="preload" as="image">` in `home.tsx` to improve LCP.

## Font Setup

Space Grotesk and Manrope — both via Google Fonts.
Add to root.tsx links:

```tsx
{ rel: "preconnect", href: "https://fonts.googleapis.com" },
{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
{
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Manrope:wght@400;500;600&display=swap"
}
```

No local font files needed — both fonts load from Google Fonts CDN.

## Environment Variables

```bash
# .env
VITE_SITE_URL=https://chiang.ink
VITE_CONTACT_EMAIL=public@chiang.ink
```

## Deploy to Vercel

```bash
npm install -D @vercel/react-router
```

Update react-router.config.ts:
```ts
import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
```

Then push to GitHub and connect to Vercel.
Auto-deploys on every push to main.

---

## Content

All content lives in /content as MDX files.
No CMS. No login. Just write and commit.

New article:    /content/writing/your-slug.mdx
New project:    /content/work/your-slug.mdx

See /content/writing/_template.mdx and
/content/work/_template.mdx for frontmatter spec.

---

## Design Reference

See DESIGN.md for the full design system:
colors, typography, spacing, motion, components.
Feed DESIGN.md into every Claude conversation
when building new sections or components.
