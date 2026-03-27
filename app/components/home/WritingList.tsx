import { Link } from "react-router";
import type { ArticleFrontmatter } from "~/types/content";
import { WritingRow } from "~/components/common";
import { HREF_WRITING } from "~/lib/constants";

const SECTION_LABEL = "Writing";
const LABEL_ALL_POSTS = "All posts →";

type Props = {
  articles: ArticleFrontmatter[];
};

export function WritingList({ articles }: Props) {
  const articleList = articles.map((article, i) => (
    <WritingRow
      key={article.slug ?? i}
      article={article}
      index={i}
      variant="compact"
    />
  ));

  return (
    <section className="py-section-mob md:py-section border-b border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin">
        <div className="flex items-baseline justify-between mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-text-muted">
            {SECTION_LABEL}
          </p>
          <Link
            to={HREF_WRITING}
            className="text-sm font-medium uppercase tracking-[0.15em] text-accent hover:opacity-60 transition-opacity duration-200"
          >
            {LABEL_ALL_POSTS}
          </Link>
        </div>

        <div>{articleList}</div>
      </div>
    </section>
  );
}
