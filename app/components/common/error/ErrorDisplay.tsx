// ErrorDisplay.tsx
// Shared error UI — used by the not-found route and all ErrorBoundary exports.
// Desktop: 12-column grid. Text spans cols 1–7.
// Graph variant:   cols 5–12, intentional overlap (text z-10 above graph z-0).
// Heatmap variant: cols 7–12, no gap, top-aligned with text.
// Treemap variant: cols 7–12, no gap, top-aligned with text.

import { useEffect, useState } from "react";
import { ButtonCta } from "~/components/common/ButtonCta";
import {
  Heatmap404,
  NetworkGraph404,
  Treemap404,
} from "~/components/common/404";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ErrorCode = "404" | "500";

type ErrorDisplayProps = {
  code: ErrorCode;
};

// ── Copy ──────────────────────────────────────────────────────────────────────

const COPY: Record<
  ErrorCode,
  {
    eyebrow: string;
    headlineLight: string;
    headlineBold: string;
    body: string;
    ghost: string;
  }
> = {
  "404": {
    eyebrow: "ERROR // 404",
    headlineLight: "Page",
    headlineBold: "not found.",
    body: "This URL doesn't exist. Possibly never did. Head somewhere more useful",
    ghost: "404",
  },
  "500": {
    eyebrow: "ERROR // 500",
    headlineLight: "Something",
    headlineBold: "went wrong.",
    body: "An unexpected error occurred. This one's on us. Head somewhere more useful",
    ghost: "500",
  },
};

const BODY_REFRESH_JOIN = ", or ";
const REFRESH_LABEL = "click here";
const BODY_REFRESH_TAIL = " to see a different visualisation.";
const CTA_HOME_LABEL = "← Back to home";
const CTA_HOME_HREF = "/";
const CTA_BACK_LABEL = "← Go back";

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

const panelWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "2 / 1",
};

const mobilePanelStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "200px",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ErrorDisplay({ code }: ErrorDisplayProps) {
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

  function handleGoBack() {
    window.history.back();
  }

  const copy = COPY[code];
  const isNoGap = variant === "heatmap" || variant === "treemap";

  return (
    <section
      className={`relative min-h-screen overflow-hidden max-w-container mx-auto md:grid md:grid-cols-12 ${isNoGap ? "md:gap-0" : ""}`}
    >
      {/* Text — cols 1–7, z-10, sets row height */}
      <div
        className={`md:col-start-1 md:col-end-8 md:row-start-1 relative z-10 px-margin-mob pt-40 pb-section-mob md:pt-80 md:pb-section ${isNoGap ? "md:pl-margin" : "md:px-margin"}`}
      >
        <div className="relative">
          {variant === "graph" && (
            <span
              aria-hidden="true"
              className="font-display font-bold select-none"
              style={ghostStyle}
            >
              {copy.ghost}
            </span>
          )}

          <div className="relative z-10">
            <p className="font-body text-sm font-medium uppercase tracking-[0.15em] text-accent mb-6">
              {copy.eyebrow}
            </p>

            <h1 className="font-display mb-8" style={headlineStyle}>
              <span className="font-light text-text-primary block">
                {copy.headlineLight}
              </span>
              <span className="font-bold text-accent block">
                {copy.headlineBold}
              </span>
            </h1>

            <p className="font-body text-base text-text-muted leading-[1.75] mb-10 max-w-md">
              {copy.body}
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
              {variant === "heatmap" && <Heatmap404 statusCode={code} />}
              {variant === "treemap" && <Treemap404 />}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <ButtonCta to={CTA_HOME_HREF}>{CTA_HOME_LABEL}</ButtonCta>
              {code !== "404" && (
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="inline-block font-body text-sm font-medium uppercase tracking-[0.15em] text-text-primary border border-border px-6 py-3 transition-colors duration-200 hover:text-accent hover:border-accent"
                >
                  {CTA_BACK_LABEL}
                </button>
              )}
            </div>
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
            <Heatmap404 statusCode={code} />
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
