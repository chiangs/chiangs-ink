import { Nav, Footer } from "~/components";
import type { Route } from "./+types/$slug";

const SITE_SUFFIX = "— Stephen Chiang";
const BREADCRUMB_LABEL = "Writing";
const BREADCRUMB_HREF = "/writing";
const BREADCRUMB_SEPARATOR = " / ";
const HEADING = "Article title";
const CONTENT_PLACEHOLDER = "Content coming soon.";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `${params.slug} ${SITE_SUFFIX}` }];
}

export default function Article({ params }: Route.ComponentProps) {
  return (
    <>
      <Nav />
      <main className="section-padding">
        <div className="container-site max-w-[720px]">
          <p className="text-label text-[#5a5a58] mb-8">
            <a href={BREADCRUMB_HREF} className="hover:text-[#f5a020] transition-colors duration-200">
              {BREADCRUMB_LABEL}
            </a>
            {BREADCRUMB_SEPARATOR}
            {params.slug}
          </p>
          <h1 className="font-display font-black text-[clamp(32px,5vw,56px)] text-[#efefec] leading-[1.05] mb-8">
            {HEADING}
          </h1>
          {/* MDX content goes here */}
          <p className="text-[#5a5a58]">{CONTENT_PLACEHOLDER}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
