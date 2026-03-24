# Project Structure

## Current

```
chiangs-ink/
├── CLAUDE.md
├── Dockerfile
├── react-router.config.ts
├── vite.config.ts
├── tsconfig.json
├── commitlint.config.js
├── package.json
├── .gitignore
├── .husky/
│   ├── commit-msg
│   └── pre-commit
└── .claude/
    └── STRUCTURE.md         ← this file
│
├── public/
│   └── fonts/
│       └── clash-display/
│           └── ClashDisplay-Variable.woff2
│
├── content/                 ← MDX content (planned)
│   ├── writing/
│   └── work/
│
└── app/
    ├── app.css              ← Design tokens + base styles
    ├── root.tsx             ← HTML shell, fonts
    ├── routes.ts            ← Route definitions
    │
    ├── routes/
    │   ├── home.tsx
    │   ├── contact.tsx
    │   ├── work/
    │   │   ├── index.tsx
    │   │   └── $slug.tsx
    │   └── writing/
    │       ├── index.tsx
    │       └── $slug.tsx
    │
    └── components/
        ├── index.ts         ← Barrel export
        ├── Nav.tsx
        ├── Footer.tsx
        └── home/
            ├── index.ts     ← Barrel export
            ├── Hero.tsx
            ├── WorkRows.tsx
            ├── AboutStrip.tsx
            ├── WritingList.tsx
            └── ContactStrip.tsx
```

## Planned additions

```
app/
  components/
    ui/                      ← Reusable primitives
    │   ├── index.ts
    │   ├── PullQuote.tsx
    │   ├── Challenge.tsx
    │   ├── MetricsStrip.tsx
    │   ├── WorkRow.tsx
    │   └── Label.tsx
    └── CursorFollower.tsx
  lib/
    ├── mdx.server.ts        ← MDX loader utilities
    └── motion.ts            ← GSAP animation configs
  types/
    └── content.ts           ← Frontmatter type definitions

public/
  images/
    ├── portrait/
    │   └── stephen-chiang.jpg
    └── work/
        └── *.jpg

content/
  writing/
    ├── _template.mdx
    └── *.mdx
  work/
    ├── _template.mdx
    └── *.mdx
```
