const ROLE_LABEL = "Design Technologist / Product & Technology Leader";
const HEADING_LINE_1 = "Engineering";
const HEADING_LINE_2 = "the strategy";
const HEADING_LINE_3_PRE = "behind";
const HEADING_LINE_3_POST = "how";
const HEADING_LINE_4 = "products get";
const HEADING_LINE_5 = "built.";
const SUBTEXT = "Based in Stavanger, Norway — working across product, design, and engineering to build things that matter.";
const LABEL_PORTRAIT = "PORTRAIT";
const LABEL_TIMEZONE = "CET";
const COPYRIGHT = "STEPHEN CHIANG © 2026";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center border-b border-border overflow-hidden">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin w-full grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-0 items-stretch">
        {/* Left — text */}
        <div className="flex flex-col justify-center py-20 pr-0 md:pr-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-8">{ROLE_LABEL}</p>

          <h1 className="font-display font-black text-[clamp(48px,7vw,80px)] leading-[0.9] text-text-primary mb-6">
            {HEADING_LINE_1}
            <br />
            {HEADING_LINE_2}
            <br />
            <span className="text-accent">{HEADING_LINE_3_PRE}</span> {HEADING_LINE_3_POST}
            <br />
            {HEADING_LINE_4}
            <br />
            {HEADING_LINE_5}
          </h1>

          <p className="text-[18px] text-text-muted leading-[1.75] max-w-sm">{SUBTEXT}</p>
        </div>

        {/* Right — portrait placeholder */}
        <div className="relative hidden md:block bg-surface min-h-[90vh]">
          {/* Portrait image goes here — duotone treatment applied via CSS */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{LABEL_PORTRAIT}</span>
          </div>

          {/* Live time */}
          <div className="absolute top-6 right-6">
            <span className="font-body text-[11px] text-text-primary/60 tracking-widest">
              {LABEL_TIMEZONE}
            </span>
          </div>

          {/* Vertical text */}
          <div
            className="absolute bottom-8 right-0 text-[10px] text-text-muted tracking-[0.2em]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {COPYRIGHT}
          </div>
        </div>
      </div>
    </section>
  );
}
