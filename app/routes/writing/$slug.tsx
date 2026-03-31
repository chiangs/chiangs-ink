import type { ComponentType, CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { ContactStrip } from "~/components/common";
import {
  getReadTimeVariant,
  HeroPattern,
  MobileBriefingDemo,
  VesselPriorityDashboard,
  ShiftConvergencePattern,
  BriefingConversation,
} from "~/components/writing";
import { useScrolled } from "~/hooks";
import { HREF_WRITING, SITE_OWNER } from "~/lib/constants";
import { createMdxComponents, type TocItem } from "~/lib/mdx-components";
import { getAllArticles, getArticle } from "~/lib/mdx.server";
import { formatDate } from "~/lib/utils";
import type { Route } from "./+types/$slug";

// ─── MDX module registry ──────────────────────────────────────────────────────
// All article MDX modules compiled at build time via @mdx-js/rollup
const ARTICLE_MODULES = import.meta.glob<{
  default: ComponentType<{ components?: Record<string, ComponentType> }>;
}>("/content/writing/*.mdx", { eager: true });

// ─── Page constants ───────────────────────────────────────────────────────────
const SITE_SUFFIX = `— ${SITE_OWNER}`;
const BACK_LABEL = "← Writing";
const BACK_HREF = HREF_WRITING;
const META_SEP = " · ";
const LABEL_IN_THIS_ARTICLE = "IN THIS ARTICLE";
const LABEL_RELATED = "RELATED WRITING";
const ARIA_SCROLL_TOP = "Scroll to top";
const ARIA_BACK_WRITING = "Back to Writing";

// ─── Style constants (module-level per CLAUDE.md) ─────────────────────────────
const heroTitleStyle: CSSProperties = {
  fontSize: "clamp(40px, 6vw, 72px)",
  maxWidth: "900px",
};
const heroSubtitleStyle: CSSProperties = {
  fontSize: "clamp(18px, 2vw, 22px)",
  maxWidth: "680px",
};
const tocProgressStyle: CSSProperties = {
  width: "0%",
  background: "var(--color-accent)",
};
const mobileProgressFillStyle: CSSProperties = {
  width: "0%",
  background: "var(--color-accent)",
  height: "100%",
};
const heroDotsDimStyle: CSSProperties = {
  background: "rgba(0,0,0,0.55)",
};

// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  let article;
  try {
    article = await getArticle(slug);
  } catch {
    throw new Response("Not Found", { status: 404 });
  }

  if (article.frontmatter.status === "draft") {
    throw new Response("Not Found", { status: 404 });
  }

  const allArticles = await getAllArticles();
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  return { frontmatter: article.frontmatter, slug, related };
}

// ─── Meta ─────────────────────────────────────────────────────────────────────
export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: `Article ${SITE_SUFFIX}` }];
  return [
    { title: `${data.frontmatter.title} ${SITE_SUFFIX}` },
    { name: "description", content: data.frontmatter.subtitle },
  ];
}

// ─── Route component ──────────────────────────────────────────────────────────
export default function Article() {
  const { frontmatter, slug, related } = useLoaderData<typeof loader>();

  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const tocProgressRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // MDX content component for this slug
  const moduleKey = `/content/writing/${slug}.mdx`;
  const Content = ARTICLE_MODULES[moduleKey]?.default ?? null;

  // Stable heading registration callback
  const onHeading = useCallback((item: TocItem) => {
    setTocItems((prev) => {
      if (prev.some((h) => h.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  // MDX component overrides — stable for lifetime of page
  const mdxComponents = useMemo(
    () => ({
      ...createMdxComponents(onHeading),
      VesselPriorityDashboard,
      MobileBriefingDemo,
      ShiftConvergencePattern,
      BriefingConversation,
    }),
    [onHeading],
  );

  // Scroll progress — drives TOC border line (desktop) + mobile reading bar
  // Single listener updates both refs; no CSS transition on either (direct follow)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0;
      if (tocProgressRef.current)
        tocProgressRef.current.style.width = `${pct}%`;
      if (mobileProgressRef.current)
        mobileProgressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP hero entrance: back link → eyebrow → title → subtitle → meta
  useEffect(() => {
    if (typeof window === "undefined") return;
    let tl: { kill(): void } | null = null;
    let isMounted = true;
    const init = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted || !heroRef.current) return;
      const els = heroRef.current.querySelectorAll("[data-hero-el]");
      tl = gsap.timeline();
      (tl as ReturnType<typeof gsap.timeline>).from(els, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      });
    };
    init();
    return () => {
      isMounted = false;
      tl?.kill();
    };
  }, []);

  // IntersectionObserver — active TOC heading tracking
  useEffect(() => {
    if (tocItems.length < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  const isScrolledDeep = useScrolled(400);

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // TOC smooth scroll
  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Derived values (computed before return per CLAUDE.md) ─────────────────
  const floatingBtnsClass = `md:hidden fixed bottom-6 right-6 flex flex-col gap-2 z-[48] transition-opacity duration-200${isScrolledDeep ? " opacity-100 pointer-events-auto" : " opacity-0 pointer-events-none"}`;
  const formattedDate = formatDate(frontmatter.date);
  const metaText = `${formattedDate}${META_SEP}${frontmatter.readTime}`;
  const heroPatternVariant = getReadTimeVariant(frontmatter.readTime);
  const hasToc = tocItems.length >= 2;
  const hasSubtitle = Boolean(frontmatter.subtitle);

  const contentElement = Content ? (
    <Content
      components={mdxComponents as unknown as Record<string, ComponentType>}
    />
  ) : null;

  const tocList = tocItems.map((item) => {
    const isActive = activeId === item.id;
    const itemClass = `flex items-center gap-2${item.level === 3 ? " pl-3" : ""}`;
    const dotClass = `w-1 h-1 flex-shrink-0 ${isActive ? "bg-accent" : "bg-transparent"}`;
    const linkClass = `font-body font-medium text-sm leading-snug transition-colors duration-200 ${
      isActive ? "text-accent" : "text-text-muted hover:text-accent-deep"
    }`;
    return (
      <li key={item.id} className={itemClass}>
        <span className={dotClass} />
        <a
          href={`#${item.id}`}
          className={linkClass}
          onClick={(e) => handleTocClick(e, item.id)}
        >
          {item.text}
        </a>
      </li>
    );
  });

  const tocSidebar = hasToc ? (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <div className="sticky top-24">
        <p className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted mb-6">
          {LABEL_IN_THIS_ARTICLE}
        </p>
        <nav aria-label="Table of contents">
          <ul className="space-y-3">{tocList}</ul>
        </nav>
        <div className="relative border-t border-border mt-8 pt-6">
          <div
            ref={tocProgressRef}
            className="absolute top-0 left-0 h-px"
            style={tocProgressStyle}
          />
          <Link
            to={BACK_HREF}
            className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-colors duration-200"
          >
            {BACK_LABEL}
          </Link>
        </div>
      </div>
    </aside>
  ) : null;

  const relatedList = related.map((article) => {
    const relatedMeta = `${article.category}${META_SEP}${formatDate(article.date)}${META_SEP}${article.readTime}`;
    return (
      <Link
        key={article.slug}
        to={`${BACK_HREF}/${article.slug}`}
        className="flex items-center justify-between py-6 border-b border-border group"
      >
        <span className="font-display font-bold text-lg text-text-primary group-hover:text-accent transition-colors duration-200">
          {article.title}
        </span>
        <span className="hidden md:block font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted ml-8 whitespace-nowrap">
          {relatedMeta}
        </span>
      </Link>
    );
  });

  const relatedSection =
    related.length > 0 ? (
      <section className="bg-surface-low py-section-mob md:py-section">
        <div className="max-w-container mx-auto px-margin-mob md:px-margin">
          <p className="font-body font-medium text-sm uppercase tracking-[0.15em] text-accent mb-8">
            {LABEL_RELATED}
          </p>
          <div>{relatedList}</div>
        </div>
      </section>
    ) : null;

  return (
    <main>
      {/* Mobile reading progress bar — fixed below nav, hidden on md+ */}
      <div className="md:hidden fixed top-16 left-0 right-0 h-0.5 bg-border z-[49]">
        <div ref={mobileProgressRef} style={mobileProgressFillStyle} />
      </div>

      {/* Floating scroll-to-top + back buttons — mobile only, appears after 400px */}
      <div className={floatingBtnsClass}>
        <button
          onClick={handleScrollTop}
          aria-label={ARIA_SCROLL_TOP}
          className="w-10 h-10 flex items-center justify-center bg-surface border border-border hover:bg-surface-high transition-colors duration-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 10 L8 5 L13 10"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Link
          to={BACK_HREF}
          aria-label={ARIA_BACK_WRITING}
          className="w-10 h-10 flex items-center justify-center bg-surface border border-border hover:bg-surface-high transition-colors duration-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11 3 L6 8 L11 13"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Article hero */}
      <header className="relative overflow-hidden border-b border-border pt-section-mob md:pt-section pb-12 md:pb-16">
        <HeroPattern variant={heroPatternVariant} />
        {heroPatternVariant === "dots" && (
          <div className="absolute inset-0" style={heroDotsDimStyle} />
        )}
        <div
          ref={heroRef}
          className="relative z-[1] max-w-container mx-auto px-margin-mob md:px-margin"
        >
          <Link
            to={BACK_HREF}
            data-hero-el
            className="inline-block font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-colors duration-200 mb-10"
          >
            {BACK_LABEL}
          </Link>
          <p
            data-hero-el
            className="font-body font-medium text-sm uppercase tracking-[0.15em] text-accent mb-4"
          >
            {frontmatter.category}
          </p>
          <h1
            data-hero-el
            className="font-display font-bold text-text-primary leading-[1.05] mb-6"
            style={heroTitleStyle}
          >
            {frontmatter.title}
          </h1>
          {hasSubtitle && (
            <p
              data-hero-el
              className="font-body font-normal text-text-muted mb-8"
              style={heroSubtitleStyle}
            >
              {frontmatter.subtitle}
            </p>
          )}
          <p
            data-hero-el
            className="font-body font-medium text-sm uppercase tracking-[0.15em] text-text-muted"
          >
            {metaText}
          </p>
        </div>
      </header>

      {/* Two-column body: main content + sticky sidebar TOC */}
      <div className="max-w-container mx-auto px-margin-mob md:px-margin py-16 md:py-20">
        <div className="flex gap-16 lg:gap-24">
          <div className="min-w-0 flex-1 max-w-180">{contentElement}</div>
          {tocSidebar}
        </div>
      </div>

      {relatedSection}

      <ContactStrip />
    </main>
  );
}
