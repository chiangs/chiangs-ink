import { useEffect, useRef } from "react";
import { PatternLines, PatternCircles } from "~/lib/visx";

// ─── Page copy ───────────────────────────────────────────────────────────────

const PAGE_TITLE = "Writing — Stephen Chiang";
const PAGE_DESCRIPTION =
  "Essays and notes on software, design, and building products.";
const SECTION_LABEL = "SELECTED WRITING";
const HEADLINE = "Writing.";

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function meta() {
  return [
    { title: PAGE_TITLE },
    { name: "description", content: PAGE_DESCRIPTION },
  ];
}

// ─── Route component ──────────────────────────────────────────────────────────

export default function WritingIndex() {
  const headerRef = useRef<HTMLDivElement>(null);

  // Pattern reveal animation — runs once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    let tl: { kill(): void } | null = null;
    let isMounted = true;
    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      gsap.set("#writing-dots-pattern", { y: 40, opacity: 0 });
      tl = gsap.timeline({ delay: 0.2 });
      (tl as ReturnType<typeof gsap.timeline>)
        // All three animate simultaneously
        .to(
          "#writing-diagonal-clip-rect",
          { attr: { width: 1, height: 1 }, duration: 0.65, ease: "power2.out" },
          0,
        )
        .to(
          "#writing-dots-pattern",
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
          0,
        )
        .to(
          "#writing-horizontal-clip-rect",
          { attr: { height: 1 }, duration: 0.7, ease: "power2.inOut" },
          0,
        );
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  // Load animation — runs once on mount
  useEffect(() => {
    let tl: { kill(): void } | null = null;
    let isMounted = true;
    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      tl = gsap.timeline();
      if (headerRef.current) {
        (tl as ReturnType<typeof gsap.timeline>).from(headerRef.current, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  return (
    <main>
      {/* Page header */}
      <div ref={headerRef} className="relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <PatternLines
              id="writing-diagonal-lines"
              height={20}
              width={20}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.5}
              orientation={["diagonal"]}
            />
            <PatternCircles
              id="writing-dot-grid"
              height={22}
              width={22}
              radius={1.7}
              fill="var(--color-invert-bg)"
            />
            <PatternLines
              id="writing-horizontal-lines"
              height={5}
              width={5}
              stroke="var(--color-invert-bg)"
              strokeWidth={0.2}
              orientation={["horizontal"]}
            />
            <clipPath
              id="writing-diagonal-clip"
              clipPathUnits="objectBoundingBox"
            >
              <rect
                id="writing-diagonal-clip-rect"
                x="0"
                y="0"
                width="0"
                height="0"
              />
            </clipPath>
            <clipPath
              id="writing-horizontal-clip"
              clipPathUnits="objectBoundingBox"
            >
              <rect
                id="writing-horizontal-clip-rect"
                x="0"
                y="0"
                width="1"
                height="0"
              />
            </clipPath>
          </defs>
          {/* LEFT: Diagonal lines — raw thought, ideas being captured */}
          <rect
            x="0"
            y="0"
            width="33.33%"
            height="100%"
            fill="url(#writing-diagonal-lines)"
            clipPath="url(#writing-diagonal-clip)"
          />
          {/* MIDDLE: Dots grid — discrete ideas, being organised and distilled */}
          <rect
            id="writing-dots-pattern"
            x="33.33%"
            y="0"
            width="33.33%"
            height="100%"
            fill="url(#writing-dot-grid)"
          />
          {/* RIGHT: Horizontal lines — clean linear prose, knowledge communicated */}
          <rect
            x="66.66%"
            y="0"
            width="33.34%"
            height="100%"
            fill="url(#writing-horizontal-lines)"
            clipPath="url(#writing-horizontal-clip)"
          />
        </svg>
        <div className="relative z-[1] max-w-container mx-auto px-margin-mob md:px-margin pt-section-mob md:pt-section pb-12 md:pb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-accent mb-4">
            {SECTION_LABEL}
          </p>
          <h1
            className="font-display font-bold text-text-primary leading-[0.9]"
            style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
          >
            {HEADLINE}
          </h1>
        </div>
      </div>
      {/* Writing list goes here */}
    </main>
  );
}
