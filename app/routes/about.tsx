// about.tsx
// About Me page — personal and professional deep-dive
// Layout: sticky sidebar nav (24%) + scrollable content (76%) on desktop
// Mobile: horizontal pill nav sticky below main nav

import { useEffect, useState } from "react";
import { SITE_OWNER, SITE_LOCATION } from "~/lib/constants";
import { ContactStrip } from "~/components/common";
import {
  Timeline,
  Industries,
  Skills,
  LanguageList,
  ImageGrid,
} from "~/components/about";

// ── Meta ─────────────────────────────────────────────────────────

const META_TITLE = "About — Stephen Chiang";
const META_DESC =
  "Senior technology and product leader at the intersection of design, engineering, and data. 20+ years. 9 industries. 6 countries. Based in Stavanger, Norway.";

export function meta() {
  return [{ title: META_TITLE }, { name: "description", content: META_DESC }];
}

// ── Sidebar / nav ─────────────────────────────────────────────────

const OWNER_NAME = SITE_OWNER;
const OWNER_LOCATION = SITE_LOCATION;

const SECTIONS = [
  { id: "bio", label: "BIO" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "industries", label: "INDUSTRIES" },
  { id: "skills", label: "SKILLS" },
  { id: "languages", label: "LANGUAGES" },
  { id: "images", label: "IMAGES" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// ── BIO ──────────────────────────────────────────────────────────

const PAGE_LABEL = "ABOUT";
const HEADLINE_1 = "Stephen";
const HEADLINE_2 = "Chiang.";

const BIO_STATS = [
  { num: "20+", label: "Projects delivered" },
  { num: "9", label: "Industries" },
  { num: "8", label: "Countries" },
  { num: "20+", label: "Years experience" },
] as const;

const BIO_P1_PRE =
  "I'm a senior technology and product leader operating at the intersection of design, engineering, and business strategy. Currently, I lead a national practice at a global design agency — building the capability that brings design, data, and technology together as a ";
const BIO_P1_HL = "single integrated discipline";
const BIO_P1_POST = ", not three separate teams talking past each other.";

const BIO_P2 =
  "My background spans the full product development stack: frontend engineering, design systems, human-machine interfaces, AI and ML integration, enterprise software, and data platforms. I've held the titles of Tech Lead, Product Owner, Scrum Master, and Design Technologist — not because I couldn't specialise, but because the problems I'm hired to solve don't respect those boundaries.";

const BIO_P3_PRE =
  "What differentiates my practice is the layer that sits around the craft. I bring 14 years of US Army Special Operations leadership into every engagement — the systems thinking, the deliberate process, the ability to lead multifunctional teams through ambiguity and deliver under pressure. That discipline ";
const BIO_P3_HL = "doesn't show up on a Figma file";
const BIO_P3_POST =
  ". It shows up in how I structure a programme, how I align stakeholders, and how I make consequential technology decisions when the stakes are high.";

const BIO_P4 =
  "I've worked across the USA, Denmark, Norway, Laos, Sri Lanka, the Maldives, Iraq, and Korea — for enterprises, agencies, and governments. I don't fill roles. I raise the ceiling of what those roles can deliver.";

const BIO_P5 = "Based in Stavanger, Norway. Operating globally.";

// ── EXPERIENCE ───────────────────────────────────────────────────

const EXP_LABEL = "EXPERIENCE";
const EXP_TITLE = "Career Timeline";

// ── INDUSTRIES ───────────────────────────────────────────────────

const IND_LABEL = "INDUSTRIES & SECTORS";
const IND_TITLE = "Where I've Delivered";

// ── SKILLS ───────────────────────────────────────────────────────

const SKILLS_LABEL = "SOLUTION TYPES";
const SKILLS_TITLE = "What I Build";

// ── LANGUAGES ────────────────────────────────────────────────────

const LANG_LABEL = "LANGUAGES";
const LANG_TITLE = "How I Communicate";

// ── IMAGES ───────────────────────────────────────────────────────

const IMG_LABEL = "BEYOND THE BRIEF";
const IMG_TITLE = "The Full Picture";

const PORTRAIT_SRC = "/images/portrait/stephen-chiang-color.jpg";
const PORTRAIT_ALT = SITE_OWNER;

// ── Module-level style objects ────────────────────────────────────

const portraitCircleImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center 30%",
  display: "block",
};

const portraitGrainStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  opacity: 0.03,
  pointerEvents: "none",
};

// ── Main component ────────────────────────────────────────────────

export default function About() {
  const [activeSection, setActiveSection] = useState<SectionId>("bio");

  // Scroll active pill into view in the bottom nav when activeSection changes
  useEffect(() => {
    const btn = document.querySelector<HTMLElement>(
      `[data-pill="${activeSection}"]`,
    );
    btn?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeSection]);

  // Scroll spy — finds the bottommost section whose top is in the upper 40% of the viewport
  useEffect(() => {
    let rafId: number;

    const update = () => {
      const threshold = window.innerHeight * 0.4;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
          setActiveSection(SECTIONS[i].id);
          return;
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // set correct state on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    let isMounted = true;
    const tweens: { kill(): void }[] = [];

    const init = async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!isMounted) return;
      gsap.registerPlugin(ScrollTrigger);

      // Page headline stagger (runs on load)
      const headlineTl = gsap.timeline();
      headlineTl
        .fromTo(
          "[data-anim='about-label']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0,
        )
        .fromTo(
          "[data-anim='about-h1']",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          0.15,
        )
        .fromTo(
          "[data-anim='about-h2']",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          0.35,
        )
        .fromTo(
          "[data-anim='bio-stat']",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
          0.65,
        );
      tweens.push(headlineTl);

      // Bio text
      tweens.push(
        gsap.fromTo(
          "[data-anim='bio-text']",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-anim='bio-text']",
              start: "top 85%",
              once: true,
            },
          },
        ),
      );

      // Each content section — individual trigger
      (
        ["experience", "industries", "skills", "languages", "images"] as const
      ).forEach((id) => {
        tweens.push(
          gsap.fromTo(
            `#${id} [data-anim='section-content']`,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: `#${id}`,
                start: "top 80%",
                once: true,
              },
            },
          ),
        );
      });

      // Timeline entries stagger
      tweens.push(
        gsap.fromTo(
          "[data-anim='timeline-entry']",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.18,
            scrollTrigger: {
              trigger: "#experience",
              start: "top 75%",
              once: true,
            },
          },
        ),
      );

      // Language rows stagger
      tweens.push(
        gsap.fromTo(
          "[data-anim='language-row']",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: "#languages",
              start: "top 80%",
              once: true,
            },
          },
        ),
      );

      // Portrait: B&W → color when bio is in view, faster reverse when out
      const toColor = () =>
        gsap.to(".portrait-circle-img", {
          filter: "grayscale(0)",
          duration: 1.8,
          ease: "power2.inOut",
        });
      const toBw = () =>
        gsap.to(".portrait-circle-img", {
          filter: "grayscale(1)",
          duration: 0.6,
          ease: "power2.in",
        });
      tweens.push(
        ScrollTrigger.create({
          trigger: "#bio",
          start: "top 80%",
          end: "top top",
          onEnter: toColor,
          onLeave: toBw,
          onEnterBack: toColor,
          onLeaveBack: toBw,
        }) as unknown as { kill(): void },
      );
    };

    init();

    return () => {
      isMounted = false;
      tweens.forEach((t) => t.kill());
    };
  }, []);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
  };

  return (
    <>
      {/* ── Mobile pill nav — fixed bottom bar ── */}
      <nav
        className="md:hidden fixed z-90 left-0 right-0 bg-bg border-t border-border"
        style={{
          bottom: 0,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <div
          className="flex gap-2 px-4 py-3"
          style={{ minWidth: "max-content" }}
        >
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                data-pill={id}
                onClick={() => scrollToSection(id)}
                className="shrink-0 font-body font-medium uppercase border-0 cursor-pointer transition-colors duration-200"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  padding: "6px 14px",
                  background: isActive ? "#FFB77D" : "#1a1a1a",
                  color: isActive ? "#131313" : "#5a5a58",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Page layout ── */}
      {/* pb accounts for the fixed bottom nav on mobile */}
      <div className="max-w-container mx-auto px-margin-mob md:px-margin pb-20 md:pb-0">
        <div className="flex items-start">
          {/* ── Desktop sidebar ── */}
          <aside
            className="hidden md:flex flex-col flex-none"
            style={{
              width: "24%",
              position: "sticky",
              top: "120px",
              alignSelf: "flex-start",
              height: "calc(100vh - 160px)",
              paddingRight: "48px",
              paddingTop: "120px",
              paddingBottom: "40px",
            }}
          >
            <div>
              <p
                className="font-display font-bold text-text-primary"
                style={{ fontSize: "14px" }}
              >
                {OWNER_NAME}
              </p>
              <p
                className="font-body text-text-muted"
                style={{ fontSize: "12px", marginTop: "4px" }}
              >
                {OWNER_LOCATION}
              </p>

              <nav className="mt-10 flex flex-col gap-4">
                {SECTIONS.map(({ id, label }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`text-left font-body font-medium uppercase bg-transparent border-0 cursor-pointer transition-colors duration-200 ${
                        isActive
                          ? "text-accent"
                          : "text-text-muted hover:text-accent-deep"
                      }`}
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        paddingLeft: "12px",
                        borderLeft: isActive
                          ? "4px solid #FFB77D"
                          : "4px solid transparent",
                        transition: "color 0.2s ease, border-color 0.2s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ── Scrollable content ── */}
          <div className="w-full md:w-[76%] pt-section-mob md:pt-section pb-0">
            {/* ────── BIO ────── */}
            <section id="bio">
              <p
                data-anim="about-label"
                className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3"
              >
                {PAGE_LABEL}
              </p>

              {/* Hero row: headline left, circular portrait right */}
              <div className="flex items-center gap-12 mb-16">
                <div className="min-w-0">
                  <h1 className="font-display" style={{ lineHeight: 0.9 }}>
                    <span
                      data-anim="about-h1"
                      className="block font-light text-text-primary"
                      style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
                    >
                      {HEADLINE_1}
                    </span>
                    <span
                      data-anim="about-h2"
                      className="block font-bold"
                      style={{
                        fontSize: "clamp(56px, 8vw, 96px)",
                        color: "#FFB77D",
                      }}
                    >
                      {HEADLINE_2}
                    </span>
                  </h1>
                </div>

                {/* Circular portrait — desktop only; mobile version sits above bio text */}
                <div
                  className="shrink-0 hidden md:block"
                  style={{
                    filter:
                      "drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 3px 6px rgba(0,0,0,0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 5px 10px rgba(0,0,0,0.4))",
                  }}
                >
                  <div
                    className="portrait-circle-wrap relative overflow-hidden w-14 h-14 md:w-[211px] md:h-[211px]"
                    style={{ clipPath: "circle(50%)" }}
                  >
                    <img
                      src={PORTRAIT_SRC}
                      alt={PORTRAIT_ALT}
                      className="portrait-circle-img"
                      style={portraitCircleImgStyle}
                    />
                    <svg style={portraitGrainStyle} aria-hidden="true">
                      <filter id="portrait-grain">
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.65"
                          numOctaves="3"
                          stitchTiles="stitch"
                        />
                        <feColorMatrix type="saturate" values="0" />
                      </filter>
                      <rect
                        width="100%"
                        height="100%"
                        filter="url(#portrait-grain)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {BIO_STATS.map((stat) => (
                  <div key={stat.label} data-anim="bio-stat">
                    <p
                      className="font-display font-bold"
                      style={{
                        fontSize: "40px",
                        color: "#FFB77D",
                        lineHeight: 1,
                      }}
                    >
                      {stat.num}
                    </p>
                    <p
                      className="font-body text-text-muted"
                      style={{ fontSize: "12px", marginTop: "8px" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Portrait — mobile only, above bio text */}
              <div
                className="md:hidden mb-6 flex justify-center"
                style={{
                  filter:
                    "drop-shadow(0 1px 2px rgba(0,0,0,1)) drop-shadow(0 2px 3px rgba(0,0,0,0.8)) drop-shadow(0 3px 5px rgba(0,0,0,0.5))",
                }}
              >
                <div
                  className="portrait-circle-wrap relative overflow-hidden w-24 h-24"
                  style={{ clipPath: "circle(50%)" }}
                >
                  <img
                    src={PORTRAIT_SRC}
                    alt={PORTRAIT_ALT}
                    className="portrait-circle-img"
                    style={portraitCircleImgStyle}
                  />
                  <svg style={portraitGrainStyle} aria-hidden="true">
                    <filter id="portrait-grain-mob">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                      />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect
                      width="100%"
                      height="100%"
                      filter="url(#portrait-grain-mob)"
                    />
                  </svg>
                </div>
              </div>

              {/* Bio text */}
              <div data-anim="bio-text" style={{ maxWidth: "680px" }}>
                <p className="font-body text-text-primary" style={{ fontSize: "18px", lineHeight: 1.8 }}>
                  {BIO_P1_PRE}<span className="text-accent-deep">{BIO_P1_HL}</span>{BIO_P1_POST}
                </p>
                <p className="font-body text-text-primary" style={{ fontSize: "18px", lineHeight: 1.8, marginTop: "28px" }}>
                  {BIO_P2}
                </p>
                <p className="font-body text-text-primary" style={{ fontSize: "18px", lineHeight: 1.8, marginTop: "28px" }}>
                  {BIO_P3_PRE}<span className="text-accent-deep">{BIO_P3_HL}</span>{BIO_P3_POST}
                </p>
                <p className="font-body text-text-primary" style={{ fontSize: "18px", lineHeight: 1.8, marginTop: "28px" }}>
                  {BIO_P4}
                </p>
                <p className="font-body text-text-primary" style={{ fontSize: "18px", lineHeight: 1.8, marginTop: "28px" }}>
                  {BIO_P5}
                </p>
              </div>
            </section>

            {/* ────── EXPERIENCE ────── */}
            <section id="experience" className="mt-16 md:mt-32">
              <p className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3">
                {EXP_LABEL}
              </p>
              <h2 className="font-display font-bold text-[32px] text-text-primary mb-[60px] leading-[1.1]">
                {EXP_TITLE}
              </h2>
              <div data-anim="section-content">
                <Timeline />
              </div>
            </section>

            {/* ────── INDUSTRIES ────── */}
            <section id="industries" className="mt-16 md:mt-32">
              <p className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3">
                {IND_LABEL}
              </p>
              <h2 className="font-display font-bold text-[32px] text-text-primary mb-[60px] leading-[1.1]">
                {IND_TITLE}
              </h2>
              <div data-anim="section-content">
                <Industries />
              </div>
            </section>

            {/* ────── SKILLS ────── */}
            <section id="skills" className="mt-16 md:mt-32">
              <p className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3">
                {SKILLS_LABEL}
              </p>
              <h2 className="font-display font-bold text-[32px] text-text-primary mb-[60px] leading-[1.1]">
                {SKILLS_TITLE}
              </h2>
              <div data-anim="section-content">
                <Skills />
              </div>
            </section>

            {/* ────── LANGUAGES ────── */}
            <section id="languages" className="mt-16 md:mt-32">
              <p className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3">
                {LANG_LABEL}
              </p>
              <h2 className="font-display font-bold text-[32px] text-text-primary mb-[60px] leading-[1.1]">
                {LANG_TITLE}
              </h2>
              <div data-anim="section-content">
                <LanguageList />
              </div>
            </section>

            {/* ────── IMAGES ────── */}
            <section
              id="images"
              className="mt-16 md:mt-32 pb-section-mob md:pb-section"
            >
              <p className="font-body font-medium text-[11px] uppercase tracking-[0.15em] text-accent block mb-3">
                {IMG_LABEL}
              </p>
              <h2 className="font-display font-bold text-[32px] text-text-primary mb-15 leading-[1.1]">
                {IMG_TITLE}
              </h2>
              <div data-anim="section-content">
                <ImageGrid />
              </div>
            </section>
          </div>
        </div>
      </div>

      <ContactStrip />
    </>
  );
}
