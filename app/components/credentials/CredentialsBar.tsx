// CredentialsBar.tsx
// Identity + credentials strip — sits directly below Hero.
// Five panels: identity title | 6 stat columns | current status.

import { useEffect } from "react";
import { TerminalIcon } from "~/components/icons";
import { scrollReveal } from "~/lib/motion";
import { CredentialStatColumn } from "./CredentialStatColumn";

// Copy
const IDENTITY_LINE_1 = "Leader";
const IDENTITY_LINE_2 = "Mentor";
const IDENTITY_LINE_3 = "Builder";
const STAT_1_NUM = "10";
const STAT_1_LABEL = "YEARS IN TECH";
const STAT_2_NUM = "10";
const STAT_2_LABEL = "YEARS IN US DEPT. OF DEFENSE";
const STAT_3_NUM = "9";
const STAT_3_LABEL = "INDUSTRIES";
const STAT_4_NUM = "8";
const STAT_4_LABEL = "COUNTRIES";
const STAT_5_NUM = "5+";
const STAT_5_LABEL = "ORGANISATION TYPES";
const STAT_6_NUM = "20+";
const STAT_6_LABEL = "PRODUCTS";
const STATUS_LABEL = "CURRENT_STATUS";
const STATUS_BODY_1_A =
  "Leading a national practice integrating design, data, technology & AI to build exceptional ";
const STATUS_BODY_1_HL1 = "human experiences";
const STATUS_BODY_1_B = " and drive ";
const STATUS_BODY_1_HL2 = "business value";
const STATUS_BODY_1_C = ".";
const STATUS_BODY_2 =
  "Available for senior technology and product leadership roles.";

// Stat column classNames — mobile: plain cells; desktop: bg steps + borders + padding
const STAT_CLASS_COMMON =
  "flex flex-col gap-3 md:flex-1 md:px-5 md:pb-8 md:pt-20";
const STAT_CLASS_STEP_COMMON = "md:border-r md:border-border";
const STAT_CLASS_STEP_1_BORDER = `md:bg-hover-surface ${STAT_CLASS_COMMON} ${STAT_CLASS_STEP_COMMON}`;
const STAT_CLASS_STEP_2_BORDER = `md:bg-surface-high ${STAT_CLASS_COMMON} ${STAT_CLASS_STEP_COMMON}`;
const STAT_CLASS_STEP_3_BORDER = `md:bg-surface-highest ${STAT_CLASS_COMMON} ${STAT_CLASS_STEP_COMMON}`;
const STAT_CLASS_STEP_3_LAST = `md:bg-surface-highest ${STAT_CLASS_COMMON}`;

export function CredentialsBar() {
  useEffect(() => {
    const tweens: { kill(): void }[] = [];
    let isMounted = true;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      gsap.registerPlugin(ScrollTrigger);

      tweens.push(
        scrollReveal(gsap, ScrollTrigger, "[data-anim='cred-col']", {
          stagger: 0.1,
        }),
      );

      tweens.push(
        gsap.fromTo(
          "[data-anim='identity-line']",
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: "back.out(1.8)",
            stagger: 0.13,
            scrollTrigger: {
              trigger: "[data-anim='identity-line']",
              start: "top 85%",
              once: true,
            },
          },
        ),
      );
    };

    init();

    return () => {
      isMounted = false;
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section>
      <div className="flex flex-col md:flex-row">
        {/* ── Col 1 — Identity ── */}
        <div
          data-anim="cred-col"
          className="bg-bg flex flex-col justify-between p-card md:w-[15%] flex-none min-h-65"
        >
          <TerminalIcon />
          <h2
            className="font-display font-bold text-text-primary leading-[1.15] mt-10"
            style={{ fontSize: "clamp(24px, 2.2vw, 34px)" }}
          >
            <span data-anim="identity-line" className="block">
              {IDENTITY_LINE_1}
            </span>
            <span data-anim="identity-line" className="block">
              {IDENTITY_LINE_2}
            </span>
            <span data-anim="identity-line" className="block">
              {IDENTITY_LINE_3}
            </span>
          </h2>
        </div>

        {/* ── Cols 2–7 — Stats band ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 p-card md:flex md:flex-row md:flex-1 md:p-0 md:gap-0">
          <CredentialStatColumn
            num={STAT_1_NUM}
            label={STAT_1_LABEL}
            className={STAT_CLASS_STEP_1_BORDER}
          />
          <CredentialStatColumn
            num={STAT_2_NUM}
            label={STAT_2_LABEL}
            className={STAT_CLASS_STEP_1_BORDER}
          />
          <CredentialStatColumn
            num={STAT_3_NUM}
            label={STAT_3_LABEL}
            className={STAT_CLASS_STEP_2_BORDER}
          />
          <CredentialStatColumn
            num={STAT_4_NUM}
            label={STAT_4_LABEL}
            className={STAT_CLASS_STEP_2_BORDER}
          />
          <CredentialStatColumn
            num={STAT_5_NUM}
            label={STAT_5_LABEL}
            className={STAT_CLASS_STEP_3_BORDER}
          />
          <CredentialStatColumn
            num={STAT_6_NUM}
            label={STAT_6_LABEL}
            className={STAT_CLASS_STEP_3_LAST}
          />
        </div>

        {/* ── Col 8 — Current status ── */}
        <div
          data-anim="cred-col"
          className="bg-invert-text flex flex-col justify-between p-card md:w-[20%] flex-none"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
              {STATUS_LABEL}
            </span>
            {/* Accent status indicator */}
            <span className="block w-2.5 h-2.5 bg-accent" aria-hidden="true" />
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <p className="font-body text-[15px] text-text-primary leading-[1.7]">
              {STATUS_BODY_1_A}
              <span className="text-accent-deep">{STATUS_BODY_1_HL1}</span>
              {STATUS_BODY_1_B}
              <span className="text-accent-deep">{STATUS_BODY_1_HL2}</span>
              {STATUS_BODY_1_C}
            </p>
            <p className="font-body text-[13px] text-text-muted leading-[1.6]">
              {STATUS_BODY_2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
