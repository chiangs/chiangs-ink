import type { ComponentType } from "react";
import { useEffect, useRef, useMemo } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/$slug";
import { getProject } from "~/lib/mdx.server";
import { createProjectMdxComponents } from "~/lib/mdx-components";
import type { ProjectFrontmatter } from "~/types/content";
import {
  ContributionBar,
  MetricsStrip,
  NdaDisclosure,
  TeamComposition,
} from "~/components/common/MDX";

// ─── MDX module registry ──────────────────────────────────────────────────────
const PROJECT_MODULES = import.meta.glob<{
  default: ComponentType<{ components?: Record<string, ComponentType> }>;
}>("/content/work/*.mdx", { eager: true });

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  let project;
  try {
    project = await getProject(slug);
  } catch {
    throw new Response("Not Found", { status: 404 });
  }

  if (
    project.frontmatter.publishStatus === "draft" &&
    process.env.NODE_ENV !== "development"
  ) {
    throw new Response("Not Found", { status: 404 });
  }

  return { frontmatter: project.frontmatter, slug };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Work — Stephen Chiang" }];
  return [
    { title: `${data.frontmatter.title} — Stephen Chiang` },
    { name: "description", content: data.frontmatter.positioning },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkSlug() {
  const { frontmatter: fm, slug } = useLoaderData<typeof loader>();
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    if (typeof window === "undefined") return;
    let tl: { kill(): void } | null = null;
    let isMounted = true;

    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;

      const timeline = gsap.timeline({ delay: 0.1 });
      tl = timeline;
      timeline
        .fromTo(
          "[data-project-eyebrow]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        )
        .fromTo(
          "[data-project-title]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          "[data-project-positioning]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          "[data-project-client]",
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.2",
        );
    };

    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  const components = useMemo(
    () =>
      createProjectMdxComponents({
        industry: (fm.industry ?? fm.industries?.[0] ?? [])[0],
      }),
    [fm],
  );

  const moduleKey = `/content/work/${slug}.mdx`;
  const Content = PROJECT_MODULES[moduleKey]?.default ?? null;

  const industryLabel = fm.industry ?? "";

  // Metrics strip renders only when the array exists and is non-empty
  const hasMetrics = Array.isArray(fm.metrics) && fm.metrics.length > 0;

  return (
    <div className="bg-bg min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <ProjectHero fm={fm} heroRef={heroRef} industryLabel={industryLabel} />

      {/* ── Roles bar ─────────────────────────────────────────────────────── */}
      <ContributionBar roles={fm.roles} />

      {/* ── Team Composition bar ─────────────────────────────────────────────────────── */}
      {fm.team && <TeamComposition team={fm.team} />}

      {/* ── Metrics (conditional) ─────────────────────────────────────────── */}
      {hasMetrics && <MetricsStrip metrics={fm.metrics!} />}

      {/* ── MDX body ──────────────────────────────────────────────────────── */}
      {Content && (
        <div className="max-w-container mx-auto px-margin-mob md:px-margin py-16 md:py-24">
          <Content
            components={components as unknown as Record<string, ComponentType>}
          />
        </div>
      )}
      {fm.nda && <NdaDisclosure />}
      {/* ── Footer nav ────────────────────────────────────────────────────── */}
      <ProjectFooterNav />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_MIN_HEIGHT = "72vh";

const HERO_STATUS_COLORS: Record<string, string> = {
  Live: "text-[#00E5C7]",
  Delivered: "text-text-muted",
  Ongoing: "text-accent",
  Confidential: "text-text-muted",
};

// Module-level style objects — not recreated on every render
const heroImageStyle = {
  filter: "grayscale(100%) contrast(1.25) brightness(0.65)",
};

const heroOverlayStyle = {
  background:
    "linear-gradient(135deg, rgba(19,19,19,0.88) 0%, rgba(19,19,19,0.55) 100%)",
};

const heroFadeStyle = {
  height: "220px",
  background: "linear-gradient(to bottom, transparent, #131313)",
};

const heroContentMinHeight = { minHeight: HERO_MIN_HEIGHT };

function ProjectHero({
  fm,
  heroRef,
  industryLabel,
}: {
  fm: ProjectFrontmatter;
  heroRef: React.RefObject<HTMLDivElement>;
  industryLabel: string;
}) {
  const hasImage = !!fm.heroImage;
  const statusColor = HERO_STATUS_COLORS[fm.status] ?? "text-text-muted";

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={heroContentMinHeight}
    >
      {/* Background */}
      {hasImage ? (
        <>
          <img
            src={fm.heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={heroImageStyle}
          />
          <div className="absolute inset-0" style={heroOverlayStyle} />
        </>
      ) : (
        <HeroPatternFallback pattern={fm.heroPattern ?? "crosshatch"} />
      )}

      {/* Bottom fade to page bg */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={heroFadeStyle}
      />

      {/* Hero content */}
      <div
        className="relative z-10 max-w-container mx-auto px-margin-mob md:px-margin flex flex-col justify-end pb-16 md:pb-24 pt-32 md:pt-48"
        style={heroContentMinHeight}
      >
        {/* Eyebrow */}
        <div
          data-project-eyebrow
          className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5 opacity-0"
        >
          {industryLabel && (
            <>
              <span className="font-body font-medium text-sm uppercase tracking-[0.15em] text-accent">
                {industryLabel}
              </span>
              <span className="font-body text-text-muted text-sm">//</span>
            </>
          )}
          <span
            className={`font-body font-medium text-sm uppercase tracking-[0.15em] ${statusColor}`}
          >
            {fm.status}
          </span>
          <span className="font-body text-text-muted text-sm">//</span>
          <span className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted">
            {fm.year}
          </span>
        </div>

        {/* Title */}
        <h1
          data-project-title
          className="font-display font-bold text-text-primary mb-4 opacity-0"
          style={{ fontSize: "clamp(36px, 6vw, 80px)", lineHeight: 1.05 }}
        >
          {fm.title}
        </h1>

        {/* Positioning statement */}
        <p
          data-project-positioning
          className="font-display font-light text-accent max-w-2xl opacity-0"
          style={{ fontSize: "clamp(17px, 2.2vw, 24px)", lineHeight: 1.45 }}
        >
          {fm.positioning}
        </p>

        {/* Client */}
        <div data-project-client className="mt-5 opacity-0">
          <p className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted">
            {fm.client}
          </p>
          {fm.clientContext && (
            <p
              className="font-body text-sm text-text-muted mt-1 max-w-md"
              style={{ opacity: 0.6 }}
            >
              {fm.clientContext}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Pattern Fallback ────────────────────────────────────────────────────
// Raw hex values used in SVG fill/stroke — CSS vars don't resolve there.

const PATTERN_DEFS: Record<string, React.ReactElement> = {
  dots: (
    <pattern
      id="ph-pattern"
      x="0"
      y="0"
      width="24"
      height="24"
      patternUnits="userSpaceOnUse"
    >
      <circle cx="2" cy="2" r="1.4" fill="#FFB77D" />
    </pattern>
  ),
  lines: (
    <pattern
      id="ph-pattern"
      x="0"
      y="0"
      width="20"
      height="20"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="20" stroke="#FFB77D" strokeWidth="0.5" />
    </pattern>
  ),
  crosshatch: (
    <pattern
      id="ph-pattern"
      x="0"
      y="0"
      width="20"
      height="20"
      patternUnits="userSpaceOnUse"
    >
      <line x1="0" y1="0" x2="20" y2="20" stroke="#FFB77D" strokeWidth="0.5" />
      <line x1="20" y1="0" x2="0" y2="20" stroke="#FFB77D" strokeWidth="0.5" />
    </pattern>
  ),
  waves: (
    <pattern
      id="ph-pattern"
      x="0"
      y="0"
      width="40"
      height="20"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M0 10 Q10 0 20 10 Q30 20 40 10"
        fill="none"
        stroke="#FFB77D"
        strokeWidth="0.6"
      />
    </pattern>
  ),
};

const patternBgStyle = { background: "#161616" };
const patternSvgStyle = { opacity: 0.3 };

function HeroPatternFallback({
  pattern,
}: {
  pattern: "dots" | "lines" | "crosshatch" | "waves" | "none";
}) {
  if (pattern === "none") {
    return <div className="absolute inset-0 bg-surface-low" />;
  }

  const def = PATTERN_DEFS[pattern] ?? PATTERN_DEFS.crosshatch;

  return (
    <div className="absolute inset-0" style={patternBgStyle}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={patternSvgStyle}
      >
        <defs>{def}</defs>
        <rect width="100%" height="100%" fill="url(#ph-pattern)" />
      </svg>
    </div>
  );
}

// ─── Footer Nav ───────────────────────────────────────────────────────────────

const FOOTER_BACK_LABEL = "← All work";
const FOOTER_CTA_LABEL = "Work together →";

function ProjectFooterNav() {
  return (
    <div className="border-t border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin py-12 flex items-center justify-between">
        <a
          href="/work"
          className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted hover:text-accent"
          style={{ transition: "color var(--transition-fast)" }}
        >
          {FOOTER_BACK_LABEL}
        </a>
        <a
          href="/contact"
          className="font-body font-medium text-sm uppercase tracking-[0.15em] text-accent hover:text-text-primary"
          style={{ transition: "color var(--transition-fast)" }}
        >
          {FOOTER_CTA_LABEL}
        </a>
      </div>
    </div>
  );
}
