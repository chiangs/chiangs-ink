import { Link } from "react-router";
import type { ProjectFrontmatter } from "~/types/content";

const SECTION_LABEL = "Selected Work";

type Props = {
  projects: ProjectFrontmatter[];
};

type WorkRowData = {
  slug: string;
  number: string;
  name: string;
  category: string;
  outcome: string;
  featured: boolean;
};

export function WorkRows({ projects }: Props) {
  const rows: WorkRowData[] = projects.map((p, i) => ({
    slug: p.slug ?? "",
    number: String(i + 1).padStart(2, "0"),
    name: p.title,
    category: p.tags[0] ?? "",
    outcome: p.metrics[0] ? `${p.metrics[0].value} ${p.metrics[0].label}` : "",
    featured: p.featured,
  }));

  return (
    <section className="py-section-mob md:py-section">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-16">
          {SECTION_LABEL}
        </p>
        <div>
          {rows.map((row) => (
            <WorkRow key={row.slug} {...row} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkRow({ slug, number, name, category, outcome, featured }: WorkRowData) {
  const featuredClass = featured
    ? "bg-surface border-y border-y-accent -mx-margin-mob px-margin-mob md:-mx-margin md:px-margin"
    : "";
  const rowClass = `work-row relative flex items-center justify-between py-8 ${featuredClass}`;

  return (
    <Link to={`/work/${slug}`} className={rowClass} data-cursor="view">
      {/* Ghost number */}
      <span
        className="ghost-number font-display font-black text-accent select-none pointer-events-none absolute left-0"
        style={{ fontSize: "160px", lineHeight: 1 }}
        aria-hidden
      >
        {number}
      </span>

      {/* Project name */}
      <span className="project-title font-display font-bold text-[36px] relative z-10 ml-4">
        {name}
      </span>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 relative z-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          {category}
        </span>
        <span className="outcome-text text-[14px] text-text-muted">{outcome}</span>
      </div>
    </Link>
  );
}
