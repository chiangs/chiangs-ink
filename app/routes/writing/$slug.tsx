import type { Route } from "./+types/$slug";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { Link, useLoaderData } from "react-router";
import { ContactStrip } from "~/components/common";
import { HREF_WRITING, SITE_OWNER } from "~/lib/constants";
import { getAllArticles, getArticle } from "~/lib/mdx.server";
import { formatDate } from "~/lib/utils";

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
const LABEL_COPY = "COPY";
const LABEL_COPIED = "COPIED";

// ─── Style constants (module-level per CLAUDE.md) ─────────────────────────────
const heroTitleStyle: CSSProperties = {
  fontSize: "clamp(40px, 6vw, 72px)",
  maxWidth: "900px",
};
const heroSubtitleStyle: CSSProperties = {
  fontSize: "clamp(18px, 2vw, 22px)",
  maxWidth: "680px",
};
const h2Style: CSSProperties = { fontSize: "clamp(24px, 3vw, 36px)" };
const h3Style: CSSProperties = { fontSize: "clamp(18px, 2vw, 24px)" };
const pullQuoteStyle: CSSProperties = { fontSize: "clamp(22px, 2.5vw, 32px)" };
const inlineCodeStyle: CSSProperties = {
  fontSize: "15px",
  border: "1px solid var(--color-ghost-border)",
};
const codeBlockBorderStyle: CSSProperties = {
  border: "1px solid var(--color-ghost-border)",
};
const tocProgressStyle: CSSProperties = {
  width: "0%",
  background: "var(--color-accent)",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TocItem = { id: string; text: string; level: 2 | 3 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node !== null && typeof node === "object" && "props" in node) {
    return getNodeText(
      (node as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─── MDX component factory ────────────────────────────────────────────────────
// Returns stable component overrides passed to the Content MDX component.
// onHeading must be stable (useCallback) so the components object never changes.
function createMdxComponents(onHeading: (item: TocItem) => void) {
  function H2({ children }: { children?: ReactNode }) {
    const text = getNodeText(children);
    const id = slugify(text);
    useEffect(() => {
      onHeading({ id, text, level: 2 });
    }, [id, text]);
    return (
      <h2
        id={id}
        className="font-display font-bold text-text-primary scroll-mt-24 mt-16 mb-6"
        style={h2Style}
      >
        {children}
      </h2>
    );
  }

  function H3({ children }: { children?: ReactNode }) {
    const text = getNodeText(children);
    const id = slugify(text);
    useEffect(() => {
      onHeading({ id, text, level: 3 });
    }, [id, text]);
    return (
      <h3
        id={id}
        className="font-display font-bold text-text-primary scroll-mt-24 mt-12 mb-4"
        style={h3Style}
      >
        {children}
      </h3>
    );
  }

  function P({ children }: { children?: ReactNode }) {
    return (
      <p className="font-body text-lg text-text-primary leading-[1.8] mb-7">
        {children}
      </p>
    );
  }

  function Blockquote({ children }: { children?: ReactNode }) {
    return (
      <blockquote
        className="border-l-4 border-accent bg-surface p-8 my-12 font-display font-light italic text-text-primary"
        style={pullQuoteStyle}
      >
        {children}
      </blockquote>
    );
  }

  // Named JSX component used directly in MDX content: <PullQuote>...</PullQuote>
  function PullQuote({ children }: { children?: ReactNode }) {
    return (
      <blockquote
        className="border-l-4 border-accent bg-surface p-8 my-12 font-display font-light italic text-text-primary"
        style={pullQuoteStyle}
      >
        {children}
      </blockquote>
    );
  }

  function Pre({ children }: { children?: ReactNode }) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
      const text = preRef.current?.textContent ?? "";
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="relative my-10">
        <pre
          ref={preRef}
          className="bg-surface overflow-x-auto p-6 text-text-primary text-sm"
          style={codeBlockBorderStyle}
        >
          {children}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 font-body font-medium text-sm text-accent uppercase tracking-[0.1em] transition-opacity duration-200"
        >
          {copied ? LABEL_COPIED : LABEL_COPY}
        </button>
      </div>
    );
  }

  function Code({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }) {
    // className present on fenced code blocks (e.g. language-js) — render plainly inside Pre
    if (className) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code
        className="font-mono text-[15px] text-accent bg-surface px-1.5 py-0.5"
        style={inlineCodeStyle}
      >
        {children}
      </code>
    );
  }

  function UL({ children }: { children?: ReactNode }) {
    return <ul className="mb-7">{children}</ul>;
  }

  function LI({ children }: { children?: ReactNode }) {
    return (
      <li className="relative pl-6 mb-3 font-body text-lg text-text-primary leading-[1.8]">
        <span
          className="absolute left-0 text-accent select-none"
          aria-hidden="true"
        >
          —
        </span>
        {children}
      </li>
    );
  }

  function HR() {
    return (
      <div className="flex items-center my-16 gap-4" aria-hidden="true">
        <div className="flex-1 border-t border-border" />
        <div className="w-1 h-1 bg-accent" />
        <div className="flex-1 border-t border-border" />
      </div>
    );
  }

  function A({ href = "", children }: { href?: string; children?: ReactNode }) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    const externalProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-4 hover:text-text-primary transition-colors duration-200"
        {...externalProps}
      >
        {children}
      </a>
    );
  }

  function Strong({ children }: { children?: ReactNode }) {
    return (
      <strong className="font-medium text-text-primary">{children}</strong>
    );
  }

  function Em({ children }: { children?: ReactNode }) {
    return <em className="italic text-text-muted">{children}</em>;
  }

  return {
    h2: H2,
    h3: H3,
    p: P,
    blockquote: Blockquote,
    PullQuote,
    pre: Pre,
    code: Code,
    ul: UL,
    li: LI,
    hr: HR,
    a: A,
    strong: Strong,
    em: Em,
  };
}

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
    () => createMdxComponents(onHeading),
    [onHeading],
  );

  // TOC border progress line — passive listener, no CSS transition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (!tocProgressRef.current) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      tocProgressRef.current.style.width = `${pct}%`;
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
  const formattedDate = formatDate(frontmatter.date);
  const metaText = `${formattedDate}${META_SEP}${frontmatter.readTime}`;
  const hasToc = tocItems.length >= 2;
  const hasSubtitle = Boolean(frontmatter.subtitle);

  const contentElement = Content ? (
    <Content components={mdxComponents as Record<string, ComponentType>} />
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
        {/* Article hero */}
        <header className="bg-bg border-b border-border pt-section-mob md:pt-section pb-12 md:pb-16">
          <div
            ref={heroRef}
            className="max-w-container mx-auto px-margin-mob md:px-margin"
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
