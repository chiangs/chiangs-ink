import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const HARD_LABEL = "WHAT WAS HARD";

const calloutStyle = { fontSize: "clamp(24px, 3.5vw, 40px)", lineHeight: 1.15 };
const bodyStyle = {
  fontSize: "clamp(280px, 40vw, 480px)",
  lineHeight: 1.8,
  opacity: 0.85,
};
const ghostLetterStyle: React.CSSProperties = {
  fontSize: "clamp(160px, 22vw, 240px)",
  color: "#0c0c0c",
  opacity: 0.08,
  letterSpacing: "-0.05em",
};

export function WhatWasHard({
  children,
  callout,
  industry,
}: {
  children: ReactNode;
  callout?: string;
  industry?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const calloutRef = useRef<HTMLParagraphElement>(null);
  const ghostLetter = industry ? industry.trim().charAt(0).toUpperCase() : null;

  useEffect(() => {
    if (!sectionRef.current || !callout) return;
    let tween: { kill(): void } | null = null;
    let isMounted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const run = async () => {
          const { default: gsap } = await import("gsap");
          if (!isMounted || !calloutRef.current) return;
          tween = gsap.fromTo(
            calloutRef.current,
            { opacity: 0, x: 48 },
            { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
          );
        };
        run();
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef.current);

    return () => {
      isMounted = false;
      observer.disconnect();
      tween?.kill();
    };
  }, [callout]);

  const ghostLetterEl = ghostLetter ? (
    <span
      aria-hidden
      className="absolute right-0 bottom-0 translate-y-1/4 font-display font-bold leading-none pointer-events-none select-none"
      style={ghostLetterStyle}
    >
      {ghostLetter}
    </span>
  ) : null;

  const calloutEl = callout ? (
    <p
      ref={calloutRef}
      className="font-display font-bold text-invert-text mb-6 opacity-0"
      style={calloutStyle}
    >
      {callout}
    </p>
  ) : null;

  return (
    <section
      ref={sectionRef}
      className="relative mb-16 md:mb-20 -mx-margin-mob md:-mx-margin bg-accent py-14 md:py-16 px-margin-mob md:px-margin"
    >
      {/* Industry initial ghost — right edge, vertically centred */}
      {ghostLetterEl}
      <span className="block font-body font-medium text-sm uppercase tracking-[0.15em] text-invert-text opacity-60 mb-5">
        {HARD_LABEL}
      </span>
      {calloutEl}
      <div className="font-body text-invert-text max-w-2xl" style={bodyStyle}>
        {children}
      </div>
    </section>
  );
}
