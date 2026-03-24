# chiangs-ink

Personal site for chiangs.ink — built with React Router v7, TailwindCSS v4, TypeScript, and GSAP.

## Stack

- **Framework**: React Router v7 (SSR, file-based routes via `app/routes.ts`)
- **Styling**: TailwindCSS v4 (Vite plugin, no config file)
- **Animations**: GSAP
- **Deployment**: Vercel (`@vercel/react-router`)
- **Language**: TypeScript (strict)

## Project Structure

```
app/
  routes.ts          # Route definitions
  root.tsx           # Root layout
  app.css            # Global styles
  routes/
    home.tsx
    contact.tsx
    work/
      index.tsx
      $slug.tsx
    writing/
      index.tsx
      $slug.tsx
  components/
    Nav.tsx
    Footer.tsx
  welcome/           # Welcome section components
  work/              # Work section components
  writing/           # Writing section components
content/             # Content files (markdown or similar)
```

## Coding Conventions

### TypeScript
- Named exports for all components (`export function Foo`)
- Import types explicitly: `import type { Route } from "./+types/home"`
- Use `~/` path alias for imports from `app/`

### Components
- One component per file, filename matches export name (PascalCase)
- Route-level components (`routes/`) compose section components from `components/`
- Section components live in `components/<section>/` (e.g. `components/home/Hero.tsx`)
- Shared layout components (`Nav`, `Footer`) live in `components/`
- Every component folder must have a barrel `index.ts` that re-exports all public members — import from the folder, never from individual files

```ts
// ✅ correct
import { Nav, Footer } from "~/components";
import { Hero, WorkRows } from "~/components/home";

// ❌ avoid
import { Nav } from "~/components/Nav";
import { Hero } from "~/components/home/Hero";
```

### Styling
- TailwindCSS v4 — no `tailwind.config` file; tokens defined in `app/app.css` under `@theme`
- Use design tokens from `@theme` when available — never use raw hex values
- **No border-radius** — `* { border-radius: 0 !important }` is a global rule; never add `rounded-*` classes
- Responsive breakpoint: `md` (768px) for desktop/mobile splits
- No custom utility classes — use token-based Tailwind classes directly:
  - Layout: `max-w-container mx-auto px-margin-mob md:px-margin`
  - Section spacing: `py-section-mob md:py-section`
  - Label text: `text-[11px] font-medium uppercase tracking-[0.15em]`

### Design Tokens (key values)
| Token | Tailwind class(es) | Value |
|---|---|---|
| `--color-bg` | `bg-bg` / `text-bg` | `#0c0c0c` |
| `--color-surface` | `bg-surface` | `#141414` |
| `--color-card` | `bg-card` | `#1a1a1a` |
| `--color-hover-surface` | `bg-hover-surface` | `#1e1e1e` |
| `--color-accent` | `text-accent` / `bg-accent` / `border-accent` | `#f5a020` |
| `--color-invert-bg` | `bg-invert-bg` | `#f5a020` |
| `--color-invert-text` | `text-invert-text` | `#0c0c0c` |
| `--color-text-primary` | `text-text-primary` | `#efefec` |
| `--color-text-muted` | `text-text-muted` | `#5a5a58` |
| `--color-border` | `border-border` | `#222220` |
| `--color-border-accent` | `border-border-accent` | `#f5a020` |
| `--font-display` | `font-display` | Clash Display |
| `--font-body` | `font-body` | Inter (default on `html`) |
| `--spacing-section` | `py-section` / `pt-section` | `120px` |
| `--spacing-section-mob` | `py-section-mob` | `72px` |
| `--spacing-container` | `max-w-container` | `1280px` |
| `--spacing-margin` | `px-margin` | `80px` |
| `--spacing-margin-mob` | `px-margin-mob` | `24px` |
| `--spacing-card` | `p-card` | `40px` |
| `--transition-fast` | CSS var only | `0.2s ease` |
| `--transition-base` | CSS var only | `0.3s ease` |
| `--transition-slow` | CSS var only | `0.6s ease-out` |

### JSX
- No logic inside `return()` — compute values (conditionals, derived state, class strings) as named variables before the return
- String literals used in JSX (labels, copy, aria attributes, hrefs) must be assigned as `const` variables **above the component function** and interpolated — makes copy refactoring a one-line change

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
  return <button aria-label="Open menu" className={isActive ? "text-accent" : "text-text-primary"}>...</button>;
}
```

### Animations
- Use GSAP for all animations; avoid CSS transitions for complex sequences
- Simple hover transitions (color, opacity, transform) are fine in Tailwind/CSS

## Project Docs

`CLAUDE.md` lives in the root (required for auto-loading). All other project docs go in `.claude/`:

```
CLAUDE.md        # auto-loaded by Claude Code — must stay in root
.claude/
  DESIGN.md
  ARCHITECTURE.md
  ...
```

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build
npm run typecheck  # Type check (react-router typegen + tsc)
npm start          # Serve production build
```
