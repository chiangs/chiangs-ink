// StyleGuideDrawer.tsx
// Triggered by clicking SC monogram when already on homepage.
// Slides in from right, reveals the full design system.
// On first open: persists a footer link via localStorage.
// Content is sourced from app/lib/styleguide.ts — edit there, not here.

import { useEffect, useRef, useState } from "react";
import { STYLEGUIDE_UNLOCK_KEY } from "~/lib/constants";
import {
  STYLEGUIDE_LABEL,
  STYLEGUIDE_OWNER,
  STYLEGUIDE_SUBTITLE,
  UNLOCK_HEADING,
  UNLOCK_BODY,
  STYLEGUIDE_COLORS,
  STYLEGUIDE_TYPE,
  STYLEGUIDE_SPACING,
  STYLEGUIDE_MOTION,
  STYLEGUIDE_FOOTER,
} from "~/lib/styleguide";

interface StyleGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onFirstUnlock: () => void;
}

export function StyleGuideDrawer({
  isOpen,
  onClose,
  onFirstUnlock,
}: StyleGuideDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Check if first time and trigger unlock
  useEffect(() => {
    if (isOpen) {
      const alreadyUnlocked = localStorage.getItem(STYLEGUIDE_UNLOCK_KEY);
      if (!alreadyUnlocked) {
        setIsFirstTime(true);
        localStorage.setItem(STYLEGUIDE_UNLOCK_KEY, "true");
        onFirstUnlock();
      }
    }
  }, [isOpen, onFirstUnlock]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Close on outside click — deferred so the opening click doesn't immediately close
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const timerId = setTimeout(
      () => document.addEventListener("mousedown", handleClick),
      100,
    );
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(12,12,12,0.8)",
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="style-guide-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(600px, 92vw)",
          background: "#0f0f0f",
          borderLeft: "1px solid #f5a020",
          zIndex: 999,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          overflowY: "auto",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "none",
            border: "none",
            color: "#737371",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: "4px 8px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5a020")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#737371")}
        >
          ESC ✕
        </button>

        {/* Unlock message — first time only */}
        {isFirstTime && (
          <div
            style={{
              background: "#1a1a1a",
              borderLeft: "4px solid #f5a020",
              padding: "24px",
              marginBottom: "-16px",
            }}
          >
            <p
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "24px",
                fontWeight: 900,
                color: "#f5a020",
                margin: "0 0 8px",
              }}
            >
              {UNLOCK_HEADING}
            </p>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "14px",
                color: "#737371",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {UNLOCK_BODY}
            </p>
          </div>
        )}

        {/* Header */}
        <div>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f5a020",
              marginBottom: "8px",
            }}
          >
            {STYLEGUIDE_LABEL}
          </p>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "40px",
              fontWeight: 900,
              color: "#efefec",
              margin: "0 0 4px",
              lineHeight: 1.1,
            }}
          >
            {STYLEGUIDE_OWNER}
          </h2>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "14px",
              color: "#737371",
              margin: 0,
            }}
          >
            {STYLEGUIDE_SUBTITLE}
          </p>
        </div>

        {/* Color Palette */}
        <Section label="Color Palette">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {STYLEGUIDE_COLORS.map((color) => (
              <div
                key={color.token}
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: color.hex,
                    border: "1px solid #222220",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                      color: "#efefec",
                      margin: "0 0 2px",
                      fontWeight: 500,
                    }}
                  >
                    {color.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      color: "#737371",
                      margin: 0,
                    }}
                  >
                    {color.hex} · {color.token}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography Scale */}
        <Section label="Typography Scale">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {STYLEGUIDE_TYPE.map((type) => (
              <div
                key={type.name}
                style={{ borderBottom: "1px solid #1e1e1e", paddingBottom: "16px" }}
              >
                <p
                  style={{
                    fontFamily: `${type.font}, sans-serif`,
                    fontSize: type.size,
                    fontWeight: type.weight,
                    color: "#efefec",
                    margin: "0 0 4px",
                    lineHeight: 1.1,
                    textTransform: type.uppercase ? "uppercase" : "none",
                    letterSpacing: type.letterSpacing ?? "normal",
                  }}
                >
                  {type.sample}
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    color: "#737371",
                    margin: 0,
                  }}
                >
                  {type.name} · {type.font} · {type.size} / {type.weight}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Spacing System */}
        <Section label="Spacing System">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {STYLEGUIDE_SPACING.map((s) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: "1px solid #1e1e1e",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "14px", color: "#737371" }}>
                  {s.name}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "14px", color: "#f5a020" }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Motion Principles */}
        <Section label="Motion Principles">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {STYLEGUIDE_MOTION.map((m) => (
              <div
                key={m.name}
                style={{ borderLeft: "2px solid #222220", paddingLeft: "16px" }}
              >
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#efefec",
                    margin: "0 0 4px",
                  }}
                >
                  {m.name}
                </p>
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "14px",
                    color: "#737371",
                    margin: 0,
                  }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <p
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
            color: "#737371",
            letterSpacing: "0.05em",
            lineHeight: 1.6,
            borderTop: "1px solid #222220",
            paddingTop: "24px",
            marginTop: "auto",
          }}
        >
          {STYLEGUIDE_FOOTER}
        </p>
      </div>
    </>
  );
}

// Helper: section wrapper
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#f5a020",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </p>
        <div style={{ flex: 1, height: "1px", background: "#222220" }} />
      </div>
      {children}
    </div>
  );
}

// Utility: check if style guide has been unlocked
export function isStyleGuideUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(STYLEGUIDE_UNLOCK_KEY);
}
