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
      <main className="section-padding">
        <div className="container-site">
          <p className="text-label text-[#5a5a58] mb-4">{SECTION_LABEL}</p>
          <h1 className="font-display font-black text-[clamp(48px,7vw,80px)] text-[#efefec] leading-[0.9]">
            {HEADING_LINE_1}
            <br />
            <span className="text-[#f5a020]">{HEADING_LINE_2}</span>
          </h1>
          {/* Work index content goes here */}
        </div>
      </main>
      <Footer />
    </>
  );
}
