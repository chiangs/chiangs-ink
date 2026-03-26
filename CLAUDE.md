# CLAUDE.md — chiangs-ink

## Project Context
Personal portfolio site for Stephen Chiang.
Built with React Router v7, Tailwind CSS v4,
GSAP, Space Grotesk + Manrope, deployed on Vercel.

---

## Design System

The single source of truth for all design decisions
is `.claude/DESIGN.md` in the project root.
Read DESIGN.md before making any visual or
component decisions.
Never deviate from the tokens, fonts, colors,
or spacing defined there.

### DESIGN.md Update Rule
After every session where visual or content
changes are made, update `.claude/DESIGN.md`
to reflect what was built. Specifically:
- If a component's visual treatment changed,
  update its entry in Component Patterns
- If copy was updated, update Content Inventory
- If a new component was added, add its spec
- If a motion/animation changed, update
  Motion System
- If a color, font, or spacing token changed,
  update the relevant token section

Output the complete updated DESIGN.md file
at the end of each session — not just the
changed sections. A complete file is required,
not a diff.

### Design Rules (non-negotiable)
- **0px border radius everywhere** —
  `* { border-radius: 0 !important }` is a
  global rule. Never add `rounded-*` classes.
- **No border lines for section separation** —
  use tonal surface shifts instead:
  `bg` → `bg-surface-low` → `bg-surface` →
  `bg-surface-high` → `bg-surface-highest`
- **No X/Twitter references anywhere** on the site
- **Email not displayed publicly** — contact
  via form or LinkedIn only
- **LinkedIn only** — no other social links
- **Space Grotesk** for display/headlines
  (weights 300 + 700)
- **Manrope** for body/UI (weights 400, 500, 600)
- Never use raw hex values — always use
  design tokens from `@theme`

---

## Stack

- **Framework**: React Router v7 (SSR, file-based routes via `app/routes.ts`)
- **Styling**: TailwindCSS v4 (Vite plugin, no config file)
- **Animations**: GSAP
- **Deployment**: Vercel (`@vercel/react-router`)
- **Language**: TypeScript (strict)

---

## Project Structure

```
app/
  routes.ts                     # Route definitions
  root.tsx                      # Root layout
  app.css                       # Global styles + @theme tokens
  routes/
    _layout.tsx                 # Shared layout — Nav, Footer, drawers
    home.tsx
    about.tsx
    contact.tsx
    work/
      index.tsx
      $slug.tsx
    writing/
      index.tsx
      $slug.tsx
  components/
    index.ts                    # Barrel — re-exports layout + common
    CursorFollower.tsx
    layout/
      index.ts
      Nav.tsx                   # SC monogram + live time + easter egg triggers
      Footer.tsx                # Easter egg hint + conditional style guide link
      CurrentlyDrawer.tsx       # Easter egg — personal snapshot drawer
      StyleGuideDrawer.tsx      # Easter egg — design system drawer
    home/
      index.ts
      Hero.tsx
      AboutStrip.tsx
      WorkRows.tsx
      WritingList.tsx
    about/
      index.ts
      Timeline.tsx
      Industries.tsx
      Skills.tsx
      LanguageList.tsx
      ImageGrid.tsx
    common/
      index.ts
      ContactStrip.tsx
    credentials/
      index.ts
      CredentialsBar.tsx
      CredentialStatColumn.tsx
    icons/
      index.ts
      TerminalIcon.tsx
  lib/
    constants.ts                # Shared timing constants (ITEM_STAGGER_S etc.)
    utils.ts                    # Pure shared utilities (formatDate etc.)
    hooks.ts                    # Shared hooks (useScrolled, useStavTime)
    motion.ts                   # GSAP animation configs
    ripple.ts                   # Touch ripple utility
    currently.ts                # Currently drawer content — edit here to update
    styleguide.ts               # Style guide drawer content
    mdx.server.ts               # MDX content loaders (server-only)
  types/
    content.ts                  # Content type definitions
content/
  work/                         # Project MDX files
  writing/                      # Article MDX files
.claude/
  DESIGN.md
  STRUCTURE.md
  README.md
```

---

## Coding Conventions

### TypeScript
- Named exports for all components (`export function Foo`)
- Import types explicitly: `import type { Route } from "./+types/home"`
- Use `~/` path alias for imports from `app/`
- Prefer `type` over `interface` — use `interface` only when
  declaration merging is explicitly needed

### Components
- One component per file, filename matches export name (PascalCase)
- Route-level components (`routes/`) compose section components
  from `components/`
- Section components live in `components/<section>/`
  (e.g. `components/home/Hero.tsx`)
- Shared layout components (`Nav`, `Footer`) live in `components/`
- Every component folder must have a barrel `index.ts` that
  re-exports all public members — import from the folder,
  never from individual files

```ts
// ✅ correct
import { Nav, Footer } from "~/components";
import { Hero, WorkRows } from "~/components/home";

// ❌ avoid
import { Nav } from "~/components/Nav";
import { Hero } from "~/components/home/Hero";
```

### Styling
- TailwindCSS v4 — no `tailwind.config` file;
  tokens defined in `app/app.css` under `@theme`
- Use design tokens from `@theme` when available —
  never use raw hex values
- **Tailwind over inline styles**: always prefer Tailwind
  classes over `style` props. Use `style` only for values
  that cannot be expressed as a Tailwind class (e.g. `clamp()`,
  `calc()`, CSS variables, dynamic JS-computed values, or
  one-off values with no token equivalent).
  Responsive variants (`md:`), state variants (`hover:`),
  and arbitrary values (`text-[11px]`, `w-[76%]`) cover most cases.
- Responsive breakpoint: `md` (768px) for desktop/mobile splits
- No custom utility classes — use token-based Tailwind classes:
  - Layout: `max-w-container mx-auto px-margin-mob md:px-margin`
  - Section spacing: `py-section-mob md:py-section`
  - Label text: `text-[11px] font-medium uppercase tracking-[0.15em]`

### Design Tokens (key values)
| Token | Tailwind class(es) | Value |
|---|---|---|
| `--color-bg` | `bg-bg` / `text-bg` | `#131313` |
| `--color-surface` | `bg-surface` | `#1a1a1a` |
| `--color-surface-low` | `bg-surface-low` | `#161616` |
| `--color-surface-high` | `bg-surface-high` | `#202020` |
| `--color-surface-highest` | `bg-surface-highest` | `#2a2a2a` |
| `--color-card` | `bg-card` | `#1a1a1a` |
| `--color-hover-surface` | `bg-hover-surface` | `#1e1e1e` |
| `--color-accent` | `text-accent` / `bg-accent` / `border-accent` | `#FFB77D` |
| `--color-accent-deep` | `text-accent-deep` / `bg-accent-deep` | `#D97707` |
| `--color-invert-bg` | `bg-invert-bg` | `#D97707` |
| `--color-invert-text` | `text-invert-text` | `#0c0c0c` |
| `--color-text-primary` | `text-text-primary` | `#E5E2E1` |
| `--color-text-muted` | `text-text-muted` | `#5a5a58` |
| `--color-border` | `border-border` | `#222220` |
| `--color-border-accent` | `border-border-accent` | `#FFB77D` |
| `--color-ghost-border` | CSS var only | `rgba(85,67,54,0.15)` |
| `--gradient-accent` | CSS var only | `linear-gradient(135deg, #FFB77D, #D97707)` |
| `--font-display` | `font-display` | Space Grotesk (Google Fonts) |
| `--font-body` | `font-body` | Manrope (Google Fonts, default on `html`) |
| `--spacing-section` | `py-section` / `pt-section` | `120px` |
| `--spacing-section-mob` | `py-section-mob` | `72px` |
| `--spacing-container` | `max-w-container` | `1280px` |
| `--spacing-margin` | `px-margin` | `80px` |
| `--spacing-margin-mob` | `px-margin-mob` | `24px` |
| `--spacing-card` | `p-card` | `40px` |
| `--transition-fast` | CSS var only | `0.2s ease` |
| `--transition-base` | CSS var only | `0.3s ease` |
| `--transition-slow` | CSS var only | `0.6s ease-out` |
| `--transition-drawer` | CSS var only | `0.45s cubic-bezier(0.16,1,0.3,1)` |

### JSX
- No logic inside `return()` — compute values (conditionals,
  derived state, class strings) as named variables before the return
- String literals used in JSX (labels, copy, aria attributes, hrefs)
  must be assigned as `const` variables **above the component
  function** and interpolated — makes copy refactoring a one-line change

```tsx
// ✅ correct
const LABEL_OPEN_MENU = "Open menu";
const LINKS = [{ to: "/work", label: "Work" }];

export function Nav() {
  const navClass = isActive ? "text-accent" : "text-text-primary";
  return <button aria-label={LABEL_OPEN_MENU}>...</button>;
}

// ❌ avoid
export function Nav() {
  return (
    <button
      aria-label="Open menu"
      className={isActive ? "text-accent" : "text-text-primary"}
    >
      ...
    </button>
  );
}
```

### Animations
- Use GSAP for: load sequences, scroll triggers, parallax,
  complex timelines, elastic springs with overshoot
- CSS transitions / Tailwind for: simple hover color/opacity
  changes, single element state changes, drawer open/close
- **Never use CSS transitions for complex sequences** —
  use GSAP timelines
- **GSAP cleanup**: always capture tween/timeline references
  and kill them in the `useEffect` cleanup. Use an `isMounted`
  flag to guard against async GSAP imports resolving after unmount.

```tsx
// ✅ correct
useEffect(() => {
  let tl: { kill(): void } | null = null;
  let isMounted = true;
  const init = async () => {
    const { default: gsap } = await import("gsap");
    if (!isMounted) return;
    tl = gsap.timeline({ ... });
  };
  init();
  return () => { isMounted = false; tl?.kill(); };
}, []);

// ❌ avoid — no cleanup, leaks ScrollTrigger on unmount
useEffect(() => {
  import("gsap").then(({ default: gsap }) => {
    gsap.timeline({ ... });
  });
}, []);
```

- All GSAP animations are **client-side only** —
  always guard with `typeof window !== 'undefined'`
- **Style objects as module-level constants**: objects used in
  JSX `style` props must be declared as `const` at module scope
  (above the component), not inside the render function.

```tsx
// ✅ correct — defined once at module scope
const gradientTextStyle = {
  background: "var(--gradient-accent)",
};
export function Hero() {
  return <span style={gradientTextStyle}>...</span>;
}

// ❌ avoid — recreated on every render
export function Hero() {
  const gradientTextStyle = { background: "var(--gradient-accent)" };
  return <span style={gradientTextStyle}>...</span>;
}
```

### Cursor & Touch
- Cursor follower: hybrid — native cursor visible everywhere
  EXCEPT over `[data-cursor]` elements
- `data-cursor="view"` → work rows → "VIEW →"
- `data-cursor="read"` → writing rows → "READ →"
- Touch detection: `pointer: coarse || ontouchstart ||
  navigator.maxTouchPoints > 0` — return null on touch devices
- Ripple effect on touch: `createRipple()` from `~/lib/ripple`
  applied via `onTouchStart` on work rows and writing rows

### State Management
- **Use `useReducer` when a component has more than three
  pieces of state** — `useState` for simple, isolated values;
  `useReducer` for anything more complex

### Utilities
- Pure functions shared across components → `~/lib/utils.ts`
  (e.g. `formatDate`)
- Shared timing constants → `~/lib/constants.ts`
  (e.g. `ITEM_STAGGER_S`, `CURSOR_LAG`)

---

## Content Rules

- All MDX content in `/content` directory
- Projects ordered by `order` field in frontmatter
- Articles ordered by `order` field in frontmatter
- Featured items: `featured: true` in frontmatter
- Never use placeholder copy in production
- Currently drawer content lives in `~/lib/currently.ts` —
  edit there to update, not in the component

### Nav order
ABOUT · WORK · WRITING · CONTACT

### Easter eggs
- **SC monogram** (on homepage only): triggers style guide drawer
- **Live time display**: triggers Currently drawer
- Both drawers managed in `_layout.tsx`
- Style guide unlock persisted via localStorage key
  `"sc-styleguide-unlocked"`
- Footer hint: "This site has secrets. Explore to find them."

---

## Build Order (remaining pages)

1. Work index (`work/index.tsx`)
2. Project page template (`work/$slug.tsx`)
3. Writing index (`writing/index.tsx`)
4. Article page template (`writing/$slug.tsx`)
5. Contact page (`contact.tsx`)
6. Motion layer — GSAP scroll triggers across all pages
7. PWA service worker
8. Deploy

---

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build
npm run typecheck  # Type check (react-router typegen + tsc)
npm start          # Serve production build
```

---

## Project Docs

`CLAUDE.md` lives in the root (required for auto-loading).
All other project docs go in `.claude/`:

```
CLAUDE.md        # auto-loaded by Claude Code — must stay in root
.claude/
  DESIGN.md      # Visual design decisions, tokens, component patterns
  STRUCTURE.md   # Actual file tree with annotations
  README.md      # Project overview and setup
```
