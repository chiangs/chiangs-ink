import { Link } from "react-router";

const SECTION_LABEL = "Selected Work";

// Stub data — replace with MDX/CMS content
const projects = [
  {
    slug: "project-one",
    number: "01",
    name: "Project One",
    category: "Product Strategy",
    outcome: "Reduced time-to-ship by 40%",
    featured: false,
  },
  {
    slug: "project-two",
    number: "02",
    name: "Project Two",
    category: "Design Systems",
    outcome: "Unified design language across 6 products",
    featured: true,
  },
  {
    slug: "project-three",
    number: "03",
    name: "Project Three",
    category: "Engineering",
    outcome: "Scaled platform to 2M users",
    featured: false,
  },
];

export function WorkRows() {
  return (
    <section className="py-section-mob md:py-section border-b border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-16">{SECTION_LABEL}</p>
        <div>
          {projects.map((project) => (
            <WorkRow key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkRow({
  slug,
  number,
  name,
  category,
  outcome,
  featured,
}: (typeof projects)[0]) {
  const rowClass = [
    "group relative flex items-center justify-between py-8 border-b border-border transition-colors duration-200",
    featured
      ? "bg-surface border-y border-y-accent -mx-margin-mob px-margin-mob md:-mx-margin md:px-margin"
      : "hover:bg-hover-surface",
  ].join(" ");

  return (
    <Link to={`/work/${slug}`} className={rowClass}>
      {/* Ghost number */}
      <span
        className="font-display font-black text-accent select-none pointer-events-none absolute left-0 transition-opacity duration-200"
        style={{ fontSize: "160px", lineHeight: 1, opacity: 0.08 }}
        aria-hidden
      >
        {number}
      </span>

      {/* Project name */}
      <span className="font-display font-bold text-[36px] text-text-primary group-hover:text-accent transition-colors duration-200 relative z-10 ml-4">
        {name}
      </span>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 relative z-10">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{category}</span>
        <span className="text-[14px] text-text-muted">{outcome}</span>
      </div>
    </Link>
  );
}
