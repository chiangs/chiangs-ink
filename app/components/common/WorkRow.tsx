import { Link } from "react-router";
import type { ProjectFrontmatter } from "~/types/content";
import { createRipple } from "~/lib/ripple";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_TAGS = 3;
const MAX_METRICS = 3;

// ─── Style objects ────────────────────────────────────────────────────────────

const ghostNumberStyle = { fontSize: "120px", opacity: 0.08 };
const ghostNumberMobStyle = { fontSize: "72px", opacity: 0.08 };
const titleTransitionStyle = { transition: "color var(--transition-fast)" };
const rowTransitionStyle = { transition: "background var(--transition-fast)" };

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkRowProps = {
  project: ProjectFrontmatter;
  index: number;
  variant?: "detailed" | "compact";
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WorkRow({
  project,
  index,
  variant = "detailed",
}: WorkRowProps) {
  const number = String(index + 1).padStart(2, "0");
  if (variant === "compact") {
    return <CompactRow project={project} number={number} />;
  }
  return <DetailedRow project={project} number={number} />;
}

// ─── Detailed variant (work index) ────────────────────────────────────────────

function DetailedRow({
  project,
  number,
}: {
  project: ProjectFrontmatter;
  number: string;
}) {
  const displayTags = project.tags.slice(0, MAX_TAGS);
  const displayMetrics = project.metrics.slice(0, MAX_METRICS);
  const industryLabel = project.industry ?? "";

  return (
    <Link
      to={`/work/${project.slug}`}
      className="work-row group relative flex items-center w-full border-b border-border overflow-hidden md:min-h-30 px-margin-mob py-5 md:px-6 md:py-0 md:gap-4"
      style={rowTransitionStyle}
      data-cursor="view"
      onTouchStart={createRipple}
    >
      {/* Ghost number — desktop */}
      <span
        className="hidden md:block absolute left-[-10px] font-display font-bold text-accent select-none pointer-events-none leading-none group-hover:opacity-[0.16]"
        style={{
          ...ghostNumberStyle,
          transition: "opacity var(--transition-fast)",
        }}
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

      {/* Zone 2: Title + tags (+ mobile meta inline) */}
      <div className="flex-1 md:flex-none md:w-100 md:py-6">
        {/* Top row: title left, year+status right on mobile */}
        <div className="flex justify-between items-start gap-3 md:block">
          <span
            className="font-display font-bold text-text-primary group-hover:text-accent block text-[clamp(16px,4.5vw,20px)] md:text-[clamp(18px,4.5vw,22px)]"
            style={titleTransitionStyle}
          >
            {project.title}
          </span>
          {/* Mobile: year + status — hidden on desktop */}
          <div className="md:hidden text-right shrink-0 min-w-20">
            <span className="font-display font-bold text-sm text-text-primary block">
              {project.year}
            </span>
            <span className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] block mt-0.5">
              {project.status}
            </span>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 md:gap-1.5 mt-2">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="font-body font-medium text-xs text-text-muted uppercase tracking-[0.1em] border border-border px-1.5 md:px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Industry — mobile only, below tags */}
        {industryLabel && (
          <span className="md:hidden block font-body font-medium text-sm text-accent uppercase tracking-[0.1em] mt-1.5">
            {industryLabel}
          </span>
        )}
      </div>

      {/* Zone 3: Metrics — desktop only */}
      {displayMetrics.length > 0 && (
        <div className="hidden md:flex flex-col gap-2 flex-1 min-w-0 py-6">
          {displayMetrics.map((m) => (
            <div key={m.label} className="flex items-baseline gap-2 text-left">
              <span className="font-display font-bold text-base text-accent shrink-0">
                {m.value}
              </span>
              <span className="font-body font-normal text-sm text-text-muted">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Zone 4: Meta — desktop only */}
      <div className="hidden md:block text-right min-w-30 py-6">
        <span className="font-display font-bold text-sm text-text-primary block">
          {project.year}
        </span>
        <span className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] block mt-1">
          {project.status}
        </span>
        {industryLabel && (
          <span className="font-body font-medium text-sm text-accent uppercase tracking-[0.1em] mt-1 block">
            {industryLabel}
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Compact variant (home featured rows) ─────────────────────────────────────

function CompactRow({
  project,
  number,
}: {
  project: ProjectFrontmatter;
  number: string;
}) {
  const category = project.tags[0] ?? "";
  const outcome = project.metrics[0]
    ? `${project.metrics[0].value} ${project.metrics[0].label}`
    : "";
  const featuredClass = project.featured
    ? "bg-surface border-y border-y-accent -mx-margin-mob px-margin-mob md:-mx-margin md:px-margin"
    : "";
  const rowClass = `work-row relative flex flex-wrap md:flex-nowrap items-center md:justify-between py-6 md:py-8 ${featuredClass}`;

  return (
    <Link
      to={`/work/${project.slug}`}
      className={rowClass}
      data-cursor="view"
      onTouchStart={createRipple}
    >
      {/* Ghost number */}
      <span
        className="ghost-number font-display font-black text-accent select-none pointer-events-none absolute left-0"
        aria-hidden
      >
        {number}
      </span>

      {/* Project name */}
      <span className="project-title font-display font-bold text-[clamp(20px,5vw,28px)] md:text-4xl relative z-10 w-full md:w-auto">
        {project.title}
      </span>

      {/* Meta */}
      <div className="flex flex-row justify-between md:flex-col md:items-end gap-1 relative z-10 w-full md:w-auto mt-2 md:mt-0 max-w-full overflow-hidden">
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
          {category}
        </span>
        <span className="outcome-text text-sm text-text-muted">
          {outcome}
        </span>
      </div>
    </Link>
  );
}
