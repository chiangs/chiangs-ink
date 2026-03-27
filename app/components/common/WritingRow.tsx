import { Link } from "react-router";
import type { ArticleFrontmatter } from "~/types/content";
import { createRipple } from "~/lib/ripple";
import { formatDate } from "~/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_TAGS = 3;

// ─── Style objects ────────────────────────────────────────────────────────────

const ghostNumberStyle: React.CSSProperties = { fontSize: "120px", opacity: 0.08 };
const ghostNumberMobStyle: React.CSSProperties = { fontSize: "72px", opacity: 0.08 };
const titleDetailStyle: React.CSSProperties = {
  fontSize: "clamp(20px, 2.5vw, 28px)",
  transition: "color var(--transition-fast)",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type WritingRowProps = {
  article: ArticleFrontmatter;
  index: number;
  variant?: "detailed" | "compact";
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WritingRow({
  article,
  index,
  variant = "detailed",
}: WritingRowProps) {
  const number = String(index + 1).padStart(3, "0");
  if (variant === "compact") {
    return <CompactRow article={article} number={number} />;
  }
  return <DetailedRow article={article} number={number} />;
}

// ─── Detailed variant (writing index) ─────────────────────────────────────────

function DetailedRow({
  article,
  number,
}: {
  article: ArticleFrontmatter;
  number: string;
}) {
  const displayTags = (article.tags ?? []).slice(0, MAX_TAGS);
  const formattedDate = formatDate(article.date);
  const readTimeFormatted = article.readTime.toUpperCase();

  return (
    <Link
      to={`/writing/${article.slug}`}
      className="writing-row group relative flex flex-wrap md:flex-nowrap items-start md:items-center w-full border-b border-border overflow-hidden py-5 md:py-0 md:min-h-28 px-margin-mob md:px-6 md:gap-4"
      data-cursor="read"
      onTouchStart={createRipple}
    >
      {/* Left bar — slides in from left on hover */}
      <span className="left-bar absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />

      {/* Ghost number — desktop */}
      <span
        className="hidden md:block absolute left-[-10px] font-display font-bold text-accent select-none pointer-events-none leading-none group-hover:opacity-[0.16]"
        style={{ ...ghostNumberStyle, transition: "opacity var(--transition-fast)" }}
        aria-hidden
      >
        {number}
      </span>
      {/* Ghost number — mobile */}
      <span
        className="md:hidden absolute left-[-8px] font-display font-bold text-accent select-none pointer-events-none leading-none"
        style={ghostNumberMobStyle}
        aria-hidden
      >
        {number}
      </span>

      {/* Zone 2 — Title + tags */}
      <div className="flex-1 md:pl-20 md:py-6 w-full md:w-auto">
        <span
          className="font-display font-bold text-text-primary group-hover:text-accent block"
          style={titleDetailStyle}
        >
          {article.title}
        </span>
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="font-body font-medium text-xs text-text-muted uppercase tracking-[0.1em] border border-border px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Mobile meta */}
        <span className="md:hidden block font-body font-medium text-sm text-text-muted uppercase tracking-[0.12em] mt-2">
          {article.category} · {formattedDate} · {article.readTime}
        </span>
      </div>

      {/* Zone 3 — Category — desktop */}
      <div className="hidden md:block shrink-0 w-40 py-6">
        <span className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em]">
          {article.category}
        </span>
      </div>

      {/* Zone 4 — Date + read time — desktop */}
      <div className="hidden md:block text-right shrink-0 min-w-24 py-6">
        <span className="font-body font-normal text-sm text-text-muted block">
          {formattedDate}
        </span>
        <span className="font-body font-medium text-sm text-accent block mt-1">
          {readTimeFormatted}
        </span>
      </div>
    </Link>
  );
}

// ─── Compact variant (home WritingList) ───────────────────────────────────────

function CompactRow({
  article,
  number,
}: {
  article: ArticleFrontmatter;
  number: string;
}) {
  const formattedDate = formatDate(article.date);

  return (
    <Link
      to={`/writing/${article.slug}`}
      className="writing-row group relative flex flex-wrap md:flex-nowrap items-center md:justify-between py-6 md:py-8 border-b border-border overflow-hidden"
      data-cursor="read"
      onTouchStart={createRipple}
    >
      {/* Hover bar slides in from left */}
      <span className="left-bar absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />

      {/* Ghost number */}
      <span
        className="writing-ghost-number font-display font-black text-accent select-none pointer-events-none absolute left-0 leading-none opacity-20 z-0 transition-opacity duration-200 group-hover:opacity-[0.6]"
        aria-hidden
      >
        {number}
      </span>

      {/* Title */}
      <span className="font-display font-bold text-[clamp(18px,4.5vw,24px)] md:text-[32px] text-text-primary group-hover:text-accent transition-colors duration-200 ml-12 w-full md:w-auto relative z-[1]">
        {article.title}
      </span>

      {/* Mobile meta — single condensed line below title */}
      <span className="md:hidden font-body text-sm font-medium uppercase tracking-[0.12em] text-text-muted ml-12 w-full mt-2 relative z-[1]">
        {article.category} · {formattedDate} · {article.readTime}
      </span>

      {/* Desktop meta — three separate spans */}
      <div className="hidden md:flex items-center gap-4 relative z-10 shrink-0 ml-8">
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
          {article.category}
        </span>
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
          {formattedDate}
        </span>
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
          {article.readTime}
        </span>
      </div>
    </Link>
  );
}
