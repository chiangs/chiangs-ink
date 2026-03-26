// styleguide.ts
// Content config for the Style Guide drawer.
// Edit this file to update the drawer — no component changes needed.

// --- Types ---

export type ColorEntry = {
  token: string;
  hex: string;
  name: string;
};

export type TypeEntry = {
  name: string;
  size: string;
  weight: number;
  font: string;
  sample: string;
  uppercase?: boolean;
  letterSpacing?: string;
};

export type SpacingEntry = {
  name: string;
  value: string;
};

export type MotionEntry = {
  name: string;
  value: string;
};

// --- Header ---

export const STYLEGUIDE_LABEL = "Design System";
export const STYLEGUIDE_OWNER = "Stephen Chiang";
export const STYLEGUIDE_SUBTITLE = "Personal site — design tokens and principles";

// --- Unlock message (first open only) ---

export const UNLOCK_HEADING = "You found it.";
export const UNLOCK_BODY =
  "The design system behind this site. A link has been added to the footer so you can return whenever you like.";

// --- Color Palette ---

export const STYLEGUIDE_COLORS: ColorEntry[] = [
  { token: "--color-bg", hex: "#0c0c0c", name: "Background" },
  { token: "--color-surface", hex: "#141414", name: "Surface" },
  { token: "--color-card", hex: "#1a1a1a", name: "Card" },
  { token: "--color-accent", hex: "#f5a020", name: "Accent" },
  { token: "--color-text-primary", hex: "#efefec", name: "Text Primary" },
  { token: "--color-text-muted", hex: "#737371", name: "Text Muted" },
  { token: "--color-border", hex: "#222220", name: "Border" },
  { token: "--color-invert-bg", hex: "#f5a020", name: "Invert Background" },
];

// --- Typography Scale ---

export const STYLEGUIDE_TYPE: TypeEntry[] = [
  { name: "Display", size: "64px", weight: 900, font: "Space Grotesk", sample: "Engineering" },
  { name: "Display Light", size: "48px", weight: 300, font: "Space Grotesk", sample: "Engineering" },
  { name: "H1", size: "40px", weight: 700, font: "Space Grotesk", sample: "Section Title" },
  { name: "H2", size: "32px", weight: 700, font: "Space Grotesk", sample: "Article Heading" },
  { name: "Body Large", size: "18px", weight: 400, font: "Manrope", sample: "Body copy at reading size, comfortable for long-form" },
  { name: "Body", size: "16px", weight: 400, font: "Manrope", sample: "Standard body text and UI copy" },
  { name: "Label", size: "14px", weight: 500, font: "Manrope", sample: "UPPERCASE LABEL · LETTER SPACED", uppercase: true, letterSpacing: "0.15em" },
  { name: "Tag", size: "12px", weight: 500, font: "Manrope", sample: "ENTERPRISE · DATA STRATEGY", uppercase: true, letterSpacing: "0.1em" },
];

// --- Spacing System ---

export const STYLEGUIDE_SPACING: SpacingEntry[] = [
  { name: "Base unit", value: "8px" },
  { name: "Card padding", value: "40px" },
  { name: "Row padding", value: "32px" },
  { name: "Side margins", value: "80px desktop / 24px mobile" },
  { name: "Section padding", value: "120px desktop / 72px mobile" },
  { name: "Container max", value: "1280px" },
];

// --- Motion Principles ---

export const STYLEGUIDE_MOTION: MotionEntry[] = [
  { name: "Load sequence", value: "Staggered fade + slide up, 0.6s ease-out" },
  { name: "Scroll reveals", value: "translateY(30px) → 0, opacity 0 → 1" },
  { name: "Hover transitions", value: "0.2s ease — color, background" },
  { name: "Drawer open", value: "0.45s cubic-bezier(0.16,1,0.3,1)" },
  { name: "Cursor follower", value: "8px dot, 60ms lag, expands on hover" },
  { name: "Portrait parallax", value: "0.6x scroll rate via GSAP ScrollTrigger" },
  { name: "About strip reveal", value: "Color wipe left → right, 0.6s" },
];

// --- Footer ---

export const STYLEGUIDE_FOOTER =
  "React Router v7 · Tailwind v4 · GSAP · Space Grotesk · Manrope · Vercel";
