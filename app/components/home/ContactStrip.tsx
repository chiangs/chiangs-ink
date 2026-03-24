import { Link } from "react-router";

const SECTION_LABEL = "Get in touch";
const HEADING_LINE_1 = "Let's build";
const HEADING_LINE_2 = "something";
const HEADING_LINE_3 = "together.";
const EMAIL = "stephen@chiang.studio";
const HREF_EMAIL = `mailto:${EMAIL}`;
const LABEL_CONTACT_FORM = "OPEN CONTACT FORM →";
const HREF_CONTACT = "/contact";

export function ContactStrip() {
  return (
    <section className="py-section-mob md:py-section bg-bg">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-6">{SECTION_LABEL}</p>
          <h2 className="font-display font-black text-[clamp(32px,5vw,64px)] text-text-primary leading-[0.95]">
            {HEADING_LINE_1}
            <br />
            <span className="text-accent">{HEADING_LINE_2}</span>
            <br />
            {HEADING_LINE_3}
          </h2>
        </div>

        <div className="flex flex-col items-start gap-4">
          <a
            href={HREF_EMAIL}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-accent border-b border-border-accent pb-0.5 hover:opacity-60 transition-opacity duration-200"
          >
            {EMAIL}
          </a>
          <Link
            to={HREF_CONTACT}
            className="text-[11px] font-medium uppercase tracking-[0.15em] bg-invert-bg text-invert-text px-8 py-4 font-bold hover:bg-bg hover:text-accent border border-border-accent transition-colors duration-200"
          >
            {LABEL_CONTACT_FORM}
          </Link>
        </div>
      </div>
    </section>
  );
}
