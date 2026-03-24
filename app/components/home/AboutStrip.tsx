const SECTION_LABEL = "About";
const GHOST_NUMBER = "001";
const BIO =
  "I operate at the intersection of product strategy, design systems, and engineering leadership — helping organisations build faster and smarter without sacrificing craft.";
const EMAIL = "stephen@chiang.studio";
const HREF_EMAIL = `mailto:${EMAIL}`;
const LOCATION = "Stavanger, Norway";

export function AboutStrip() {
  return (
    <section className="relative overflow-hidden bg-accent py-section-mob md:py-section">
      {/* Ghost number clips left */}
      <span
        className="font-display font-black text-invert-text select-none pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2"
        style={{ fontSize: "120px", lineHeight: 1, opacity: 0.12 }}
        aria-hidden
      >
        {GHOST_NUMBER}
      </span>

      <div className="max-w-container mx-auto px-margin-mob md:px-margin relative z-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text/60 mb-8">{SECTION_LABEL}</p>

        <p className="text-[28px] md:text-[32px] font-[500] text-invert-text leading-[1.4] max-w-3xl">
          {BIO}
        </p>

        <div className="mt-12 flex items-center gap-6">
          <a
            href={HREF_EMAIL}
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text border-b border-invert-text pb-0.5 hover:opacity-60 transition-opacity duration-200"
          >
            {EMAIL}
          </a>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text/40">{LOCATION}</span>
        </div>
      </div>
    </section>
  );
}
