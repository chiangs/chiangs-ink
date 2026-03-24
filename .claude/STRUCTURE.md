stephen-chiang-site/
│
├── DESIGN.md                     ← Feed into every Claude session
├── README.md
├── react-router.config.ts
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env
├── .gitignore
│
├── public/
│   ├── favicon.svg                   ← Primary favicon (SVG, all sizes)
│   ├── favicon-32.png                ← PNG fallback (generate from SVG)
│   ├── apple-touch-icon.png          ← 180×180 iOS home screen icon
│   ├── icon-192.png                  ← PWA Android icon
│   ├── icon-512.png                  ← PWA Android icon (large)
│   ├── manifest.json                 ← PWA web manifest (create in IDE)
│   └── images/
│       ├── portrait/
│       │   └── stephen-chiang.jpg    ← B&W cropped portrait (chest-up)
│       └── work/
│           ├── maritime-intelligence.jpg
│           ├── data-governance.jpg
│           └── maritime-dashboard.jpg
│
├── content/                          ← All MDX content lives here
│   ├── writing/
│   │   ├── _template.mdx
│   │   ├── dashboards-are-not-for-overview.mdx
│   │   └── design-is-creation-with-researched-intent.mdx
│   └── work/
│       ├── _template.mdx
│       ├── maritime-intelligence-platform.mdx
│       ├── enterprise-data-governance-ai-readiness.mdx
│       └── maritime-operations-financial-intelligence.mdx
│
└── app/
    ├── app.css                       ← Design tokens + base styles
    ├── root.tsx                      ← HTML shell, fonts, cursor
    │
    ├── routes/
    │   ├── _layout.tsx               ← Nav + Footer wrapper
    │   ├── _index.tsx                ← Homepage
    │   ├── work._index.tsx           ← Work index
    │   ├── work.$slug.tsx            ← Project page template
    │   ├── writing._index.tsx        ← Writing index
    │   ├── writing.$slug.tsx         ← Article page template
    │   └── contact.tsx               ← Contact page
    │
    ├── components/
    │   ├── Nav.tsx                   ← SC monogram + live time + easter egg triggers
    │   ├── Footer.tsx                ← Easter egg hint + conditional style guide link
    │   ├── CursorFollower.tsx
    │   ├── CurrentlyDrawer.tsx       ← Easter egg — personal snapshot drawer
    │   ├── StyleGuideDrawer.tsx      ← Easter egg — design system drawer
    │   │
    │   ├── ui/                       ← Reusable UI primitives
    │   │   ├── PullQuote.tsx
    │   │   ├── Challenge.tsx
    │   │   ├── MetricsStrip.tsx
    │   │   ├── WorkRow.tsx
    │   │   └── Label.tsx
    │   │
    │   └── sections/                 ← Full page sections
    │       ├── Hero.tsx
    │       ├── AboutStrip.tsx
    │       ├── WritingList.tsx
    │       └── ContactStrip.tsx
    │
    ├── lib/
    │   ├── mdx.server.ts             ← MDX loader utilities
    │   └── motion.ts                 ← GSAP animation configs
    │
    └── types/
        └── content.ts                ← Frontmatter type definitions
