import { Nav, Footer } from "~/components";

const PAGE_TITLE = "Writing — Stephen Chiang";
const SECTION_LABEL = "Writing";
const HEADING_LINE_1 = "Essays &";
const HEADING_LINE_2 = "Notes";

export function meta() {
  return [{ title: PAGE_TITLE }];
}

export default function WritingIndex() {
  return (
    <>
      <Nav />
      <main className="py-section-mob md:py-section">
        <div className="max-w-container mx-auto px-margin-mob md:px-margin">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted mb-4">{SECTION_LABEL}</p>
          <h1 className="font-display font-black text-[clamp(48px,7vw,80px)] text-text-primary leading-[0.9]">
            {HEADING_LINE_1}
            <br />
            <span className="text-accent">{HEADING_LINE_2}</span>
          </h1>
          {/* Writing list goes here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
