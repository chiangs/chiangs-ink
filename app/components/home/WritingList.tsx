import { Link } from "react-router";
import type { ArticleFrontmatter } from "~/types/content";

const SECTION_LABEL = "Writing";
const LABEL_ALL_POSTS = "All posts →";
const HREF_WRITING = "/writing";

type Props = {
  articles: ArticleFrontmatter[];
};

type WritingRowData = {
  slug: string;
  number: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function WritingList({ articles }: Props) {
  const rows: WritingRowData[] = articles.map((a, i) => ({
    slug: a.slug ?? "",
    number: String(i + 1).padStart(2, "0"),
    title: a.title,
    date: formatDate(a.date),
    readTime: a.readTime,
    category: a.category,
  }));

  return (
    <section className="py-section-mob md:py-section border-b border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <div className="flex items-baseline justify-between mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
            {SECTION_LABEL}
          </p>
          <Link
            to={HREF_WRITING}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent hover:opacity-60 transition-opacity duration-200"
          >
            {LABEL_ALL_POSTS}
          </Link>
        </div>

        <div>
          {rows.map((row) => (
            <WritingRow key={row.slug} {...row} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingRow({ slug, number, title, date, readTime, category }: WritingRowData) {
  return (
    <Link
      to={`/writing/${slug}`}
      className="writing-row group relative flex flex-wrap md:flex-nowrap items-center md:justify-between py-6 md:py-8 border-b border-border overflow-hidden"
      data-cursor="read"
    >
      {/* Hover bar slides in from left */}
      <span className="left-bar absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />

      {/* Ghost number */}
      <span
        className="writing-ghost-number font-display font-black text-accent select-none pointer-events-none absolute left-0 transition-opacity duration-200 group-hover:opacity-[0.6]"
        style={{ lineHeight: 1, opacity: 0.2, position: "absolute", zIndex: 0 }}
        aria-hidden
      >
        {number}
      </span>

      {/* Title */}
      <span
        className="font-display font-bold text-[clamp(18px,4.5vw,24px)] md:text-[32px] text-text-primary group-hover:text-accent transition-colors duration-200 ml-12 w-full md:w-auto"
        style={{ position: "relative", zIndex: 1 }}
      >
        {title}
      </span>

      {/* Mobile meta — single condensed line below title */}
      <span
        className="md:hidden font-body font-medium uppercase text-text-muted ml-12 w-full"
        style={{ fontSize: "10px", letterSpacing: "0.12em", marginTop: "8px", position: "relative", zIndex: 1 }}
      >
        {category} · {date} · {readTime}
      </span>

      {/* Desktop meta — three separate spans */}
      <div className="hidden md:flex items-center gap-4 relative z-10 shrink-0 ml-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          {category}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          {date}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">
          {readTime}
        </span>
      </div>
    </Link>
  );
}
