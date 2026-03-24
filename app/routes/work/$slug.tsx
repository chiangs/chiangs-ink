import { Nav, Footer } from "~/components";
import type { Route } from "./+types/$slug";

const SITE_SUFFIX = "— Stephen Chiang";
const BREADCRUMB_LABEL = "Work";
const BREADCRUMB_HREF = "/work";
const BREADCRUMB_SEPARATOR = " / ";
const HEADING = "Project";
const CONTENT_PLACEHOLDER = "Content coming soon.";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.slug} ${SITE_SUFFIX}` }];
}

export default function WorkProject({ params }: Route.ComponentProps) {
  return (
    <>
      <Nav />
      <main className="py-section-mob md:py-section">
        <div className="max-w-container mx-auto px-margin-mob md:px-margin">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-8">
            <a href={BREADCRUMB_HREF} className="hover:text-accent transition-colors duration-200">
              {BREADCRUMB_LABEL}
            </a>
            {BREADCRUMB_SEPARATOR}
            {params.slug}
          </p>
          <h1 className="font-display font-black text-[clamp(48px,7vw,80px)] text-text-primary leading-[0.9] mb-16">
            {HEADING}
          </h1>
          {/* MDX content goes here */}
          <p className="text-text-muted">{CONTENT_PLACEHOLDER}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
