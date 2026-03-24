# Stephen Chiang — Personal Site

Personal site and portfolio for Stephen Chiang,
Design Technologist and Product & Technology Leader.

Built with React Router v7 (framework mode),
Tailwind CSS v4, GSAP, and MDX.

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
```

## Font Setup

Clash Display — download from https://www.fontshare.com/fonts/clash-display
Place font files in /public/fonts/clash-display/

Inter — loaded via Google Fonts in root.tsx

## Environment Variables

```bash
# .env
VITE_SITE_URL=https://stephenchiang.studio
VITE_CONTACT_EMAIL=stephen@chiang.studio
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
