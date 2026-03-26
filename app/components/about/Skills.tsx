// Skills — Solution types section for About page
import { useEffect, useRef } from "react";
import { IndustryRow } from "./Industries";

const SKILLS_LEFT = [
  "Enterprise Software",
  "Data & Analytics Platforms",
  "Design Systems",
  "Web Applications",
] as const;

const SKILLS_RIGHT = [
  "Dashboards & Visualisation",
  "APIs & Integrations",
  "Internal Tooling",
  "Human-Machine Interfaces",
] as const;

const STMT_PRE = "Every choice was justified by ";
const STMT_HL = "how the problem needed to be solved";
const STMT_POST = " — not by what was easiest to build.";

const STMT_HL_CHARS = STMT_HL.split("");

export function Skills() {
  const hlRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let tween: { kill(): void } | null = null;
    let isMounted = true;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted || !hlRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const chars = hlRef.current.querySelectorAll<HTMLSpanElement>("[data-char]");
      gsap.set(chars, { fontWeight: 300 });

      tween = gsap.to(chars, {
        fontWeight: 700,
        duration: 0.15,
        ease: "power1.in",
        stagger: 0.03,
        scrollTrigger: {
          trigger: hlRef.current,
          start: "top 85%",
          once: true,
        },
      });
    };

    init();

    return () => {
      isMounted = false;
      tween?.kill();
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mb-16">
        <div>
          {SKILLS_LEFT.map((name) => (
            <IndustryRow key={name} name={name} />
          ))}
        </div>
        <div>
          {SKILLS_RIGHT.map((name) => (
            <IndustryRow key={name} name={name} />
          ))}
        </div>
      </div>
      <div className="bg-border-accent p-8">
        <p
          className="font-display font-light text-invert-text"
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            maxWidth: "600px",
            lineHeight: 1.3,
          }}
        >
          "{STMT_PRE}
          <span ref={hlRef}>
            {STMT_HL_CHARS.map((char, i) => (
              <span
                key={i}
                data-char
                style={{ whiteSpace: "pre-wrap" }}
              >
                {char}
              </span>
            ))}
          </span>
          {STMT_POST}"
        </p>
      </div>
    </>
  );
}
