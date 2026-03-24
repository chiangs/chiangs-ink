// Hero.tsx
// Homepage hero — split layout, portrait duotone, GSAP load sequence + parallax.
// Portrait CSS treatment lives in app.css (.portrait, .portrait-fade, .portrait-border).

import { useEffect } from "react";
import { heroLoadSequence } from "~/lib/motion";

// Copy constants
const EYEBROW = "STEPHEN CHIANG // PORTFOLIO 2026";
const HEADLINE_1 = "Engineering";
const HEADLINE_2 = "design.";
const SUBHEAD = "Leading delivery.";
const DESCRIPTOR = "DESIGN TECHNOLOGIST · UX ENGINEER · PRODUCT LEAD";
const SCROLL_CTA = "SCROLL TO EXPLORE";
const SCROLL_ARROW = "↓";
const PORTRAIT_SRC = "/images/portrait/stephen-chiang.jpg";
const PORTRAIT_ALT = "Stephen Chiang";
const CAPTION_REF = "REF_016 // PORTRAIT";
const CAPTION_ISO = "ISO 400 // 85MM";
const VERTICAL_TEXT = "STEPHEN CHIANG © 2026";

export function Hero() {
  useEffect(() => {
    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      heroLoadSequence(gsap);

      // Fade the entire hero out as user scrolls away
      gsap.to("[data-anim='hero-section']", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-anim='hero-section']",
          start: "top top",
          end: "bottom 15%",
          scrub: true,
        },
      });
    };
    init();
  }, []);

  const gradientTextStyle = {
    fontSize: "clamp(72px, 11vw, 120px)",
    background: "linear-gradient(135deg, #FFB77D 0%, #D97707 50%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    backgroundClip: "text" as const,
    paddingBottom: "0.1em",
  };

  return (
    <section
      data-anim="hero-section"
      className="relative h-screen overflow-hidden border-b border-border"
    >
      {/* ── Portrait — positioning wrapper (inline style beats .portrait {position:relative}) ── */}
      <div
        data-anim="portrait"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: "40%",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <div
          className="portrait"
          style={{ height: "100%", position: "relative" }}
        >
          <img
            src={PORTRAIT_SRC}
            alt={PORTRAIT_ALT}
            style={{ objectPosition: "70% 15%" }}
          />
          <div className="portrait-fade" />
        </div>
      </div>

      {/* ── Dark gradient — left readability ── */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #131313 40%, rgba(19,19,19,0.7) 55%, rgba(19,19,19,0.15) 72%, transparent 88%)",
        }}
      />

      {/* ── Text content ── */}
      <div className="relative z-2 flex flex-col justify-between h-full w-full md:w-[55%] py-section-mob md:py-section px-margin-mob md:px-margin">
        {/* Eyebrow */}
        <p
          data-anim="eyebrow"
          className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-accent"
        >
          {EYEBROW}
        </p>

        {/* Headline block */}
        <div>
          <h1 className="font-display leading-[0.88]">
            <span
              data-anim="headline-1"
              className="block font-light text-text-primary tracking-[0.02em]"
              style={{ fontSize: "clamp(72px, 11vw, 120px)" }}
            >
              {HEADLINE_1}
            </span>
            <span
              data-anim="headline-2"
              className="block font-bold tracking-[0.02em]"
              style={gradientTextStyle}
            >
              {HEADLINE_2}
            </span>
          </h1>
          <p
            data-anim="hero-sub"
            className="font-body text-[20px] font-normal text-text-muted"
            style={{ marginTop: "24px" }}
          >
            {SUBHEAD}
          </p>
        </div>

        {/* Bottom row — descriptor + scroll CTA */}
        <div className="flex items-end justify-between gap-8">
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted w-full">
            {DESCRIPTOR}
          </p>
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-accent whitespace-nowrap flex items-center gap-1">
            {SCROLL_CTA} <span className="arrow-pulse">{SCROLL_ARROW}</span>
          </p>
        </div>
      </div>

      {/* ── Technical caption — desktop only, overlaid on portrait ── */}
      <div
        className="absolute hidden md:block z-[3]"
        style={{ bottom: "80px", right: "24px" }}
      >
        <p
          className="font-body text-[10px] font-medium uppercase tracking-[0.15em]"
          style={{ color: "#E5E2E1", opacity: 0.5 }}
        >
          {CAPTION_REF}
        </p>
        <p
          className="font-body text-[10px] font-medium uppercase tracking-[0.15em] mt-1"
          style={{ color: "#E5E2E1", opacity: 0.5 }}
        >
          {CAPTION_ISO}
        </p>
      </div>

      {/* ── Vertical text — desktop only, right edge ── */}
      <div
        className="absolute hidden md:block z-[3] font-body text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted"
        style={{
          right: "16px",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          whiteSpace: "nowrap",
        }}
      >
        {VERTICAL_TEXT}
      </div>
    </section>
  );
}
