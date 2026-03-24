import { Nav, Footer } from "~/components";

const PAGE_TITLE = "Work — Stephen Chiang";
const SECTION_LABEL = "Work";
const HEADING_LINE_1 = "Selected";
const HEADING_LINE_2 = "Projects";

export function meta() {
  return [{ title: PAGE_TITLE }];
}

export default function WorkIndex() {
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
          {/* Work index content goes here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
