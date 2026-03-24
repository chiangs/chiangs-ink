import { Link } from "react-router";

const SECTION_LABEL = "Writing";
const LABEL_ALL_POSTS = "All posts →";
const HREF_WRITING = "/writing";

// Stub data — replace with MDX content
const posts = [
  {
    slug: "post-one",
    number: "01",
    title: "On building product teams that ship",
    date: "Mar 2026",
    readTime: "6 min read",
  },
  {
    slug: "post-two",
    number: "02",
    title: "Design systems as organisational strategy",
    date: "Feb 2026",
    readTime: "8 min read",
  },
  {
    slug: "post-three",
    number: "03",
    title: "Why engineers should care about typography",
    date: "Jan 2026",
    readTime: "4 min read",
  },
];

export function WritingList() {
  return (
    <section className="py-section-mob md:py-section border-b border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <div className="flex items-baseline justify-between mb-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{SECTION_LABEL}</p>
          <Link
            to={HREF_WRITING}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent hover:opacity-60 transition-opacity duration-200"
          >
            {LABEL_ALL_POSTS}
          </Link>
        </div>

        <div>
          {posts.map((post) => (
            <WritingRow key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WritingRow({
  slug,
  number,
  title,
  date,
  readTime,
}: (typeof posts)[0]) {
  return (
    <Link
      to={`/writing/${slug}`}
      className="group relative flex items-center justify-between py-8 border-b border-border overflow-hidden"
    >
      {/* Hover bar slides in from left */}
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top" />

      {/* Ghost number */}
      <span
        className="font-display font-black text-accent select-none pointer-events-none absolute left-0 transition-opacity duration-200 group-hover:opacity-[0.6]"
        style={{ fontSize: "48px", lineHeight: 1, opacity: 0.2 }}
        aria-hidden
      >
        {number}
      </span>

      {/* Title */}
      <span className="font-display font-bold text-[28px] md:text-[32px] text-text-primary group-hover:text-accent transition-colors duration-200 relative z-10 ml-12">
        {title}
      </span>

      {/* Meta */}
      <div className="flex items-center gap-4 relative z-10 shrink-0 ml-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{date}</span>
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{readTime}</span>
      </div>
    </Link>
  );
}
