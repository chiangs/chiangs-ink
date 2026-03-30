import type { CSSProperties, ReactNode } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
type DefinitionBlockProps = {
  label: string;
  definition: string;
  children?: ReactNode;
};

// ─── Style constants ──────────────────────────────────────────────────────────
const definitionStyle: CSSProperties = {
  fontSize: "clamp(32px, 5vw, 56px)",
  marginTop: "12px",
};

// ─── Component ────────────────────────────────────────────────────────────────
export function DefinitionBlock({
  label,
  definition,
  children,
}: DefinitionBlockProps) {
  const childContent = children ? (
    <div className="font-body text-base text-invert-text opacity-80 mt-6 leading-[1.8] max-w-2xl [&_p]:text-invert-text">
      {children}
    </div>
  ) : null;
  return (
    <div className="bg-accent py-16 px-margin-mob md:px-margin my-12 -mx-margin-mob md:-mx-margin">
      <p className="font-body font-medium text-sm uppercase tracking-[0.15em] text-invert-text opacity-60">
        {label}
      </p>
      <p
        className="font-display font-bold text-invert-text leading-[1.05]"
        style={definitionStyle}
      >
        {definition}
      </p>
      {childContent}
    </div>
  );
}
