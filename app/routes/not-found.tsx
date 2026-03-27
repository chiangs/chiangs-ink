// not-found.tsx
// 404 — catch-all route rendered inside the shared layout.
// Desktop: 12-column grid. Text spans cols 1–7.
// Graph variant:   cols 5–12, intentional overlap (text z-10 above graph z-0).
// Heatmap variant: cols 7–12, no gap, top-aligned with text.
// Treemap variant: cols 7–12, no gap, top-aligned with text.

import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import { ButtonCta } from "~/components/common";
import {
  Heatmap404,
  NetworkGraph404,
  Treemap404,
} from "~/components/common/404";

// ── Meta ──────────────────────────────────────────────────────────────────────

const META_TITLE = "404 — Page Not Found · Stephen Chiang";
const META_DESC = "The page you're looking for doesn't exist.";

export const meta: MetaFunction = () => [
  { title: META_TITLE },
  { name: "description", content: META_DESC },
  { name: "robots", content: "noindex, nofollow" },
];

// ── Copy ──────────────────────────────────────────────────────────────────────

const EYEBROW = "ERROR // 404";
const HEADLINE_LIGHT = "Page";
const HEADLINE_BOLD = "not found.";
const BODY =
  "This URL doesn't exist. Possibly never did. Head somewhere more useful";
const BODY_REFRESH_JOIN = ", or ";
const REFRESH_LABEL = "click here";
const BODY_REFRESH_TAIL = " to see a different visualisation.";
const CTA_LABEL = "← Back to home";
const CTA_HREF = "/";
const GHOST_NUMBER = "404";

// ── Styles ────────────────────────────────────────────────────────────────────

const ghostStyle: React.CSSProperties = {
  fontSize: "clamp(120px, 22vw, 240px)",
  lineHeight: 1,
  color: "var(--color-accent)",
  opacity: 0.06,
  userSelect: "none",
  pointerEvents: "none",
  position: "absolute",
  top: "-0.15em",
  left: "-0.04em",
  zIndex: 0,
};

const headlineStyle: React.CSSProperties = {
  fontSize: "clamp(48px, 7vw, 80px)",
  lineHeight: 1.05,
};

// 2:1 aspect ratio — square heatmap cells (48×24 grid) and proportional treemap canvas
const panelWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "2 / 1",
};

// Mobile panel: fixed height, sits between body text and CTA
const mobilePanelStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "200px",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NotFound() {
  const [variant, setVariant] = useState<
    "graph" | "heatmap" | "treemap" | null
  >(null);

  useEffect(() => {
    const variants = ["graph", "heatmap", "treemap"] as const;
    setVariant(variants[Math.floor(Math.random() * variants.length)]);
  }, []);

  function handleRefresh() {
    setVariant((current) => {
      const others = (["graph", "heatmap", "treemap"] as const).filter(
        (v) => v !== current,
      );
      return others[Math.floor(Math.random() * others.length)];
    });
  }

  return (
    <section
      className={`relative min-h-screen overflow-hidden max-w-container mx-auto md:grid md:grid-cols-12 ${variant === "heatmap" || variant === "treemap" ? "md:gap-0" : ""}`}
    >
      {/* Text — cols 1–7, z-10, sets row height */}
      <div
        className={`md:col-start-1 md:col-end-8 md:row-start-1 relative z-10 px-margin-mob pt-40 pb-section-mob md:pt-80 md:pb-section ${variant === "heatmap" || variant === "treemap" ? "md:pl-margin" : "md:px-margin"}`}
      >
        <div className="relative">
          {variant === "graph" && (
            <span
              aria-hidden="true"
              className="font-display font-bold select-none"
              style={ghostStyle}
            >
              {GHOST_NUMBER}
            </span>
          )}

          <div className="relative z-10">
            <p className="font-body text-sm font-medium uppercase tracking-[0.15em] text-accent mb-6">
              {EYEBROW}
            </p>

            <h1 className="font-display mb-8" style={headlineStyle}>
              <span className="font-light text-text-primary block">
                {HEADLINE_LIGHT}
              </span>
              <span className="font-bold text-accent block">
                {HEADLINE_BOLD}
              </span>
            </h1>

            <p className="font-body text-base text-text-muted leading-[1.75] mb-10 max-w-md">
              {BODY}
              {BODY_REFRESH_JOIN}
              <button
                type="button"
                onClick={handleRefresh}
                className="font-body text-base text-text-primary underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0 hover:text-accent transition-colors duration-200"
              >
                {REFRESH_LABEL}
              </button>
              {BODY_REFRESH_TAIL}
            </p>

            {/* Mobile visualisation — compact panel between body and CTA */}
            <div
              aria-hidden="true"
              className="md:hidden mb-10"
              style={mobilePanelStyle}
            >
              {variant === "graph" && <NetworkGraph404 />}
              {variant === "heatmap" && <Heatmap404 />}
              {variant === "treemap" && <Treemap404 />}
            </div>

            <ButtonCta to={CTA_HREF}>{CTA_LABEL}</ButtonCta>
          </div>
        </div>
      </div>

      {/* Graph — cols 5–12, z-0, overlaps text in cols 5–7 */}
      {/* Heatmap / Treemap — cols 7–12, no overlap, top-aligned with text */}
      <div
        aria-hidden="true"
        className={
          variant === "graph"
            ? "hidden md:block md:col-start-5 md:col-end-13 md:row-start-1 relative py-[25%]"
            : "hidden md:block md:col-start-7 md:col-end-13 md:row-start-1 md:self-start relative md:pt-80 md:pr-margin"
        }
        style={{ zIndex: 0 }}
      >
        {variant === "graph" && <NetworkGraph404 />}
        {variant === "heatmap" && (
          <div style={panelWrapStyle}>
            <Heatmap404 />
          </div>
        )}
        {variant === "treemap" && (
          <div style={panelWrapStyle}>
            <Treemap404 />
          </div>
        )}
      </div>
    </section>
  );
}
