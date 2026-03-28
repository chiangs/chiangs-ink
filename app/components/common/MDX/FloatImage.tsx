type FloatSide = "left" | "right";

const captionStyle = {
  fontSize: "10px",
  letterSpacing: "0.15em",
} as const;

const imgStyle = {
  filter: "grayscale(100%) contrast(1.35) brightness(0.85)",
} as const;

const overlayStyle = {
  background: "rgba(255,183,125,0.65)",
  mixBlendMode: "multiply" as const,
} as const;

const rawImgStyle = {
  display: "block",
  width: "100%",
} as const;

export function FloatImage({
  src,
  alt,
  caption,
  side = "right",
  raw = false,
}: {
  src: string;
  alt: string;
  caption: string;
  side?: FloatSide;
  raw?: boolean;
}) {
  const figureClass = `float-image float-image--${side}`;

  return (
    <figure className={figureClass}>
      <div className="float-image__frame">
        {raw ? (
          <img src={src} alt={alt} style={rawImgStyle} />
        ) : (
          <>
            <img src={src} alt={alt} style={imgStyle} />
            <div className="float-image__overlay" style={overlayStyle} />
          </>
        )}
      </div>
      <figcaption
        className="font-body font-medium uppercase text-accent-muted"
        style={captionStyle}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
