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

### Styling
- TailwindCSS v4 — no `tailwind.config` file; tokens defined in `app/app.css` under `@theme`
- Use design tokens from `@theme` when available (e.g. `text-accent`, `bg-bg`, `border-border`)
- Prefer token-based classes; fall back to raw hex only when a token doesn't exist
- **No border-radius** — `* { border-radius: 0 !important }` is a global rule; never add rounded-* classes
- Use utility classes from `app.css`: `container-site`, `section-padding`, `text-label`, `font-display`
- Responsive breakpoint: `md` (768px) for desktop/mobile splits

### Design Tokens (key values)
| Token | Value |
|---|---|
| `--color-bg` | `#0c0c0c` |
| `--color-surface` | `#141414` |
| `--color-card` | `#1a1a1a` |
| `--color-accent` | `#f5a020` |
| `--color-text-primary` | `#efefec` |
| `--color-text-muted` | `#5a5a58` |
| `--color-border` | `#222220` |
| `--font-display` | Clash Display |
| `--font-sans` | Inter |

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

## Commands

```bash
npm run dev        # Dev server at http://localhost:5173
npm run build      # Production build
npm run typecheck  # Type check (react-router typegen + tsc)
npm start          # Serve production build
```
