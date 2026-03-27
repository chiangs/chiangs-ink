// Footer.tsx
// Minimal footer matching design system
// Shows easter egg hint on every page
// Shows style guide link after it has been unlocked

import { useEffect, useState } from "react";
import { isStyleGuideUnlocked } from "./StyleGuideDrawer";
import {
  STYLEGUIDE_UNLOCK_KEY,
  SITE_OWNER,
  LINKEDIN_URL,
  GITHUB_URL,
} from "~/lib/constants";

const EASTER_EGG_TEXT = "This site has secrets. Explore to find them.";
const LABEL_STYLE_GUIDE = "Style Guide ↗";
const LABEL_GITHUB = "GitHub";
const LABEL_LINKEDIN = "LinkedIn";

interface FooterProps {
  onOpenStyleGuide?: () => void;
}

export function Footer({ onOpenStyleGuide }: FooterProps) {
  const [unlocked, setUnlocked] = useState(false);

  // Check unlock state client-side only
  useEffect(() => {
    setUnlocked(isStyleGuideUnlocked());
  }, []);

  // Listen for unlock event from StyleGuideDrawer
  useEffect(() => {
    const handleUnlock = () => setUnlocked(true);
    window.addEventListener(STYLEGUIDE_UNLOCK_KEY, handleUnlock);
    return () =>
      window.removeEventListener(STYLEGUIDE_UNLOCK_KEY, handleUnlock);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border flex flex-col md:flex-row md:items-center md:justify-between md:flex-wrap gap-4 p-6 md:px-margin md:py-6"
      style={{ background: "#0c0c0c" }}
    >
      {/* Name + year */}
      <p className="font-body text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
        {SITE_OWNER}{" "}
        <span style={{ color: "#333330" }}>{year}</span>
      </p>

      {/* Easter egg hint */}
      <p
        className="footer-easter-egg font-body text-sm tracking-[0.1em] text-left md:text-center"
        style={{ color: "#2a2a2a", cursor: "default", transition: "color 0.3s ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#5a5a58")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#2a2a2a")}
      >
        {EASTER_EGG_TEXT}
      </p>

      {/* Links */}
      <div className="flex items-center gap-6">
        {/* Style guide — desktop only */}
        {unlocked && onOpenStyleGuide && (
          <button
            onClick={onOpenStyleGuide}
            className="hidden md:block bg-transparent border-0 font-body text-sm font-medium uppercase tracking-[0.15em] cursor-pointer p-0 transition-opacity duration-200 hover:opacity-60"
            style={{ color: "#f5a020" }}
          >
            {LABEL_STYLE_GUIDE}
          </button>
        )}

        <FooterLink href={GITHUB_URL} label={LABEL_GITHUB} />
        <FooterLink href={LINKEDIN_URL} label={LABEL_LINKEDIN} />
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body text-sm font-medium uppercase tracking-[0.15em] text-text-muted no-underline transition-colors duration-200 hover:text-accent"
    >
      {label}
    </a>
  );
}
