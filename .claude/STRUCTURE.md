chiangs-ink/
│
├── CLAUDE.md                         ← Auto-loaded by Claude Code (must stay in root)
├── .claude/
│   ├── DESIGN.md
│   ├── STRUCTURE.md                  ← This file
│   └── README.md
│
├── react-router.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
│
├── public/
│   ├── manifest.json                         ← PWA manifest (hand-authored; vite-plugin-pwa reads as-is)
│   ├── sw.js                                 ← [generated at build] Workbox service worker
│   ├── workbox-*.js                          ← [generated at build] Workbox runtime chunk
│   ├── icons/                                ← PWA icons (96–512px, maskable variants)
│   └── images/
│       ├── portrait/
│       │   ├── stephen-chiang.jpg            ← LCP image; preloaded via home.tsx links export
│       │   └── stephen-chiang-color.jpg
│       ├── work/
│       │   └── *.jpg
│       └── content/
│           └── vessel-priority-dashboard.png  ← mobile fallback for VesselPriorityDashboard
│
├── content/
│   ├── writing/
│   │   └── *.mdx
│   └── work/
│       └── *.mdx
│
└── app/
    ├── app.css                       ← Design tokens (@theme) + base styles + component CSS
    ├── root.tsx                      ← HTML shell, fonts, CursorFollower mount
    ├── routes.ts                     ← File-based route definitions
    │
    ├── routes/
    │   ├── _layout.tsx               ← Nav + Footer + drawer state + ToastContext provider
    │   ├── home.tsx                  ← Homepage (composes home section components)
    │   ├── contact.tsx               ← Contact page
    │   ├── not-found.tsx             ← 404 catch-all route; random 3-way canvas variant
    │   ├── work/
    │   │   ├── index.tsx             ← Work index
    │   │   └── $slug.tsx             ← Project page template
    │   └── writing/
    │       ├── index.tsx             ← Writing index
    │       └── $slug.tsx             ← Article page template; mobile reading progress
    │                                   bar (fixed top-16, h-0.5, z-49) + floating
    │                                   scroll-to-top / back buttons (fixed bottom-6
    │                                   right-6, z-48, visible after 400px scroll)
    │
    ├── hooks/                        ← Client-side React hooks (never imported server-side)
    │   ├── index.ts                  ← Barrel re-export
    │   ├── useScrolled.ts            ← Returns true when page scrolled past threshold
    │   ├── useStavTime.ts            ← Live Stavanger time "HH:MM TZ", updates every second
    │   ├── useCountDown.ts           ← GSAP number countdown animation; re-runs on animationKey
    │   └── useToast.ts               ← Reads ToastContext; dispatches show/dismiss toast actions
    │
    ├── components/
    │   ├── index.ts                  ← Barrel: re-exports CursorFollower + layout/*
    │   ├── CursorFollower.tsx        ← RAF-driven cursor dot + ripple (desktop only)
    │   │
    │   ├── layout/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── Nav.tsx               ← Sticky nav: monogram + links + Stavanger time
    │   │   ├── Footer.tsx            ← Footer: easter egg + conditional style guide link
    │   │   ├── CurrentlyDrawer.tsx   ← Right-side drawer: personal snapshot
    │   │   └── StyleGuideDrawer.tsx  ← Right-side drawer: design system (easter egg)
    │   │
    │   ├── home/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── Hero.tsx              ← Split desktop / stacked mobile hero
    │   │   ├── WorkRows.tsx          ← Selected work list with hover effects
    │   │   ├── WritingList.tsx       ← Latest writing rows
    │   │   ├── AboutStrip.tsx        ← Bio strip with scroll animation
    │   │   └── ContactStrip.tsx      ← Contact CTA strip
    │   │
    │   ├── about/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── Timeline.tsx          ← Career timeline section
    │   │   ├── Industries.tsx        ← D3 world map — highlighted countries
    │   │   ├── Skills.tsx            ← Skills grid
    │   │   ├── LanguageList.tsx      ← Languages + tools list
    │   │   └── ImageGrid.tsx         ← Photo grid (placeholder images)
    │   │
    │   ├── work/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   └── WorkInsightsPanel.tsx ← Collapsible panel: WaffleChart, HeatmapRect,
    │   │                               NetworkGraph, TechTreemap, AvgMVPStat
    │   │                               Shell delegated to common/InsightsPanel
    │   │
    │   ├── writing/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── WritingInsightsPanel.tsx ← Collapsible panel: topic bars, read time,
    │   │   │                           WritingStreamgraph, avg read time countdown
    │   │   │                           Shell delegated to common/InsightsPanel
    │   │   ├── HeroPattern.tsx       ← Article hero background pattern (dots/lines/grid)
    │   │   │                           Variant driven by read time via getReadTimeVariant()
    │   │   └── VesselPriorityDashboard.tsx ← Interactive MDX embed — fictional fleet
    │   │                               priority table, expandable per-vessel urgency
    │   │                               breakdown. Desktop interactive / mobile PNG fallback.
    │   │
    │   ├── common/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── Viz/
    │   │   │   ├── index.ts          ← Barrel re-export
    │   │   │   ├── WeeklyProportionBar.tsx ← Currently drawer — segmented proportion
    │   │   │   │                       bar (parenting/deep work/sleep/training/reading/
    │   │   │   │                       building). Animates 0→width on mount via RAF.
    │   │   │   └── CareerIntensityChart.tsx ← About page — career capability intensity
    │   │   │                           2002–2026. viewMode: vertical (columns) or
    │   │   │                           horizontal (bars). compact prop for mobile:
    │   │   │                           hides row labels, shows legend above chart.
    │   │   ├── MDX/
    │   │   │   ├── index.ts          ← Barrel re-export
    │   │   │   ├── ArticleImage.tsx  ← Full-width article image with caption
    │   │   │   ├── DefinitionBlock.tsx ← Full-bleed accent block (bg-accent, inverted
    │   │   │   │                         text): label + large display definition + body
    │   │   │   ├── FloatImage.tsx    ← Float-right article image with caption
    │   │   │   └── Highlight.tsx     ← Inline text highlight (emphasis/subtle/flashy)
    │   │   ├── InsightsPanel.tsx     ← Collapsible panel shell — toggle button, GSAP
    │   │   │                           height tween, onMount/onExpand/storageKey props
    │   │   │                           Shared by WorkInsightsPanel + WritingInsightsPanel
    │   │   ├── ButtonCta.tsx         ← Primary CTA button — copper gradient, 0px radius
    │   │   │                           Used on 404 page (and future pages)
    │   │   ├── Toast.tsx             ← Fixed-position toast notification (bottom-center)
    │   │   │                           Reads from ToastContext; used for navigation hints
    │   │   ├── ContactStrip.tsx      ← Shared contact CTA strip
    │   │   ├── FilterDropdown.tsx    ← Multi-select dropdown (Work + Writing indexes)
    │   │   ├── SearchIcon.tsx        ← 14×14px SVG magnifier (shared)
    │   │   ├── WorkRow.tsx           ← Single work project row
    │   │   ├── WritingRow.tsx        ← Single writing article row
    │   │   ├── EmptyState.tsx        ← No-results state (Work + Writing indexes)
    │   │   └── 404/
    │   │       ├── index.ts          ← Barrel re-export
    │   │       ├── NetworkGraph404.tsx ← Force-directed network graph (RAF physics,
    │   │       │                         ~60 nodes, ~90 links, 30% dead nodes pulse,
    │   │       │                         50% dead links flicker)
    │   │       ├── Heatmap404.tsx    ← 48×24 cell heatmap (4 cell states: dead/pulse/
    │   │       │                         semi-glitch/glitch; ghost "404" behind cells)
    │   │       └── Treemap404.tsx    ← Squarified treemap (7 data items, scaleY stagger
    │   │                               animation, pure TypeScript — no libraries)
    │   │
    │   ├── credentials/
    │   │   ├── index.ts              ← Barrel re-export
    │   │   ├── CredentialsBar.tsx    ← Identity + stats + status strip
    │   │   └── CredentialStatColumn.tsx ← Individual stat cell
    │   │
    │   └── icons/
    │       ├── index.ts              ← Barrel re-export
    │       └── TerminalIcon.tsx
    │
    ├── lib/
    │   ├── constants.ts              ← Shared literals: nav links, keys, timing constants,
    │   │                               storage keys (STORAGE_WORK_INSIGHTS etc.)
    │   ├── utils.ts                  ← Pure utilities: formatDate, etc.
    │   ├── storage.ts                ← SSR-safe localStorage utility (storage.get/set/getJSON/setJSON)
    │   ├── motion.ts                 ← GSAP animation functions (typed, return tweens)
    │   ├── ripple.ts                 ← Touch ripple effect for interactive rows
    │   ├── currently.ts              ← Currently drawer content data
    │   ├── styleguide.ts             ← Style guide drawer content data
    │   ├── mdx.server.ts             ← MDX loader utilities (server-only)
    │   ├── mdx-components.tsx        ← createMdxComponents() factory — h2/h3/p/blockquote/
    │   │                               pre/code/ul/li/hr/a/strong/em overrides + named
    │   │                               components (PullQuote, Highlight, ArticleImage,
    │   │                               FloatImage, DefinitionBlock). TocItem exported here.
    │   ├── visx.ts                   ← @visx/* static re-exports
    │   ├── fuse.ts                   ← fuse.js static re-export
    │   ├── d3.ts                     ← async loadD3() + loadD3Force() loaders
    │   └── toast.tsx                 ← ToastContext + ToastProvider; manages show/dismiss state
    │
    └── types/
        └── content.ts                ← Frontmatter type definitions
