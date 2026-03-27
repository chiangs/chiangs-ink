// constants.ts
// Shared strings and configuration used across the site.
// Import from here rather than duplicating literals across components.

// Navigation
export const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "Writing", to: "/writing" },
  { label: "Contact", to: "/contact" },
] as const;

// Timezone
export const TIMEZONE_STAVANGER = "Europe/Oslo";

// Easter egg — style guide unlock
// Used as both the localStorage key and the DOM event name
export const STYLEGUIDE_UNLOCK_KEY = "sc-styleguide-unlocked";

// Identity
export const SITE_OWNER = "Stephen Chiang";
export const SITE_LOCATION = "Stavanger, Norway";
export const LINKEDIN_URL = "https://linkedin.com/in/chiangs";

// Routes
export const HREF_CONTACT = "/contact";
export const HREF_WRITING = "/writing";

// Animation timing
export const ITEM_STAGGER_S = 0.07;
export const CURSOR_LAG = 0.15;

// Shared UI styles
export const SEARCH_INPUT_STYLE: React.CSSProperties = {
  height: "40px",
  padding: "0 16px 0 32px",
  transition: "border-color var(--transition-fast)",
};
