import { LINKEDIN_URL } from "~/lib/constants";

const SECTION_LABEL = "About";
const GHOST_NUMBER = "001";
const BIO_1 =
  "Most organisations don't hire a Design Technologist. They hire a CTO, a Tech Lead, a Head of Product, or a Strategy Consultant — and they get someone who only speaks one language.";
const BIO_2 = "I speak all of them.";
const BIO_3 =
  "20+ years leading product development at the critical intersection of people, process, and technology. Currently building the next generation of data and AI-driven digital experiences at enterprise scale.";
const BIO_4 =
  "The rare hire who closes the gap between what technology can do and what a business needs to deliver.";
const LOCATION = "Stavanger, Norway";
const LABEL_LINKEDIN = "LinkedIn";

const bio2Style = {
  fontSize: "clamp(40px, 4vw, 48px)",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  lineHeight: 1.1,
  marginTop: "8px",
  marginBottom: "24px",
};

export function AboutStrip() {
  return (
    <section className="relative overflow-hidden bg-accent py-section-mob md:py-section">
      {/* Ghost number clips left — unchanged */}
      <span
        className="font-display font-black text-invert-text select-none pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2"
        style={{ fontSize: "120px", lineHeight: 1, opacity: 0.12 }}
        aria-hidden
      >
        {GHOST_NUMBER}
      </span>

      <div className="max-w-container mx-auto px-margin-mob md:px-margin relative z-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text/60 mb-8">
          {SECTION_LABEL}
        </p>

        <div className="flex flex-col gap-6 max-w-3xl">
          <p className="text-[24px] md:text-[28px] font-medium text-invert-text leading-[1.4]">
            {BIO_1}
          </p>
          <p className="text-invert-text" style={bio2Style}>
            {BIO_2}
          </p>
          <p className="text-[18px] md:text-[20px] font-medium text-invert-text/80 leading-[1.6]">
            {BIO_3}
          </p>
          <p className="text-[18px] md:text-[20px] font-medium text-invert-text leading-[1.6]">
            {BIO_4}
          </p>
        </div>

        <div className="mt-12 flex items-center gap-6">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text border-b border-invert-text pb-0.5 hover:opacity-60 transition-opacity duration-200"
          >
            {LABEL_LINKEDIN}
          </a>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-invert-text/40">
            {LOCATION}
          </span>
        </div>
      </div>
    </section>
  );
}
