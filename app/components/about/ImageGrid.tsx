// ImageGrid — Images section for About page

import { SITE_OWNER } from "~/lib/constants";

const IMG_INTRO =
  "Strength training, Muay Thai, hiking Norwegian fjords. Single father of three. The discipline outside work is the same discipline inside it.";
const IMG_INTRO2 =
  "I build mechanical keyboards and custom PCs — because the best way to understand how humans interact with machines is to build them yourself. That obsession with how things feel to use shapes how I think about HMI design and how AI should show up in the hands of real people.";

const IMG_PRO_SRC = "/images/about/professional-01.jpg";
const IMG_PRO_ALT = SITE_OWNER;
const IMG_PRO_CAPTION = "REF_002 // FIELD";
const IMG_P1_SRC = "/images/about/personal-01.jpg";
const IMG_P1_ALT = SITE_OWNER;
const IMG_P1_CAPTION = "REF_003 // PERSONAL";
const IMG_P2_SRC = "/images/about/personal-02.jpg";
const IMG_P2_ALT = SITE_OWNER;
const IMG_P2_CAPTION = "REF_004 // PERSONAL";

const imgCaptionStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "12px",
  right: "12px",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "10px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#E5E2E1",
  opacity: 0.5,
  zIndex: 5,
  pointerEvents: "none",
};

export function ImageGrid() {
  return (
    <>
      <p
        className="font-body text-text-muted"
        style={{
          fontSize: "16px",
          lineHeight: 1.7,
          marginBottom: "10px",
          maxWidth: "480px",
        }}
      >
        {IMG_INTRO}
      </p>
      <p
        className="font-body text-text-muted"
        style={{
          fontSize: "16px",
          lineHeight: 1.7,
          marginBottom: "40px",
          maxWidth: "480px",
        }}
      >
        {IMG_INTRO2}
      </p>

      {/* Desktop grid: large left spanning 2 rows, two small right */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "59% 39%",
          gridTemplateRows: "1fr 1fr",
          gap: "16px",
          minHeight: "640px",
        }}
      >
        {/* Large — professional, duotone treatment */}
        <div className="portrait relative" style={{ gridRow: "1 / 3" }}>
          <img
            src={IMG_PRO_SRC}
            alt={IMG_PRO_ALT}
            style={{ objectPosition: "center 20%" }}
          />
          <div className="portrait-fade" />
          <p style={imgCaptionStyle}>{IMG_PRO_CAPTION}</p>
        </div>
        {/* Small 1 */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#1a1a1a" }}
        >
          <img
            src={IMG_P1_SRC}
            alt={IMG_P1_ALT}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={imgCaptionStyle}>{IMG_P1_CAPTION}</p>
        </div>
        {/* Small 2 */}
        <div
          className="relative overflow-hidden"
          style={{ background: "#1a1a1a" }}
        >
          <img
            src={IMG_P2_SRC}
            alt={IMG_P2_ALT}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={imgCaptionStyle}>{IMG_P2_CAPTION}</p>
        </div>
      </div>

      {/* Mobile: single column stack */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="portrait relative" style={{ height: "56vw" }}>
          <img
            src={IMG_PRO_SRC}
            alt={IMG_PRO_ALT}
            style={{ objectPosition: "center 20%" }}
          />
          <p style={imgCaptionStyle}>{IMG_PRO_CAPTION}</p>
        </div>
        <div
          className="relative overflow-hidden"
          style={{ height: "56vw", background: "#1a1a1a" }}
        >
          <img
            src={IMG_P1_SRC}
            alt={IMG_P1_ALT}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={imgCaptionStyle}>{IMG_P1_CAPTION}</p>
        </div>
        <div
          className="relative overflow-hidden"
          style={{ height: "56vw", background: "#1a1a1a" }}
        >
          <img
            src={IMG_P2_SRC}
            alt={IMG_P2_ALT}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={imgCaptionStyle}>{IMG_P2_CAPTION}</p>
        </div>
      </div>
    </>
  );
}
