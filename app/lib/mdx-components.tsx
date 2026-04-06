// mdx-components.tsx
// MDX component factories for all content routes.
// Import createWritingMdxComponents, createProjectMdxComponents, and TocItem from here.

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArticleImage,
  DefinitionBlock,
  FloatImage,
  Highlight,
  ImageGrid,
  MdxLink,
} from "~/components/common/MDX";
import {
  Challenge,
  Outcomes,
  ProjectImage,
  ProjectImagePair,
  ProjectPullQuote,
  SectionDivider,
  Situation,
  WhatWasBuilt,
  WhatWasHard,
} from "~/components/common/MDX/projects";

// ─── Types ────────────────────────────────────────────────────────────────────
export type TocItem = { id: string; text: string; level: 2 | 3 };

// ─── Style constants ──────────────────────────────────────────────────────────
const h2Style: CSSProperties = { fontSize: "clamp(24px, 3vw, 36px)" };
const h3Style: CSSProperties = { fontSize: "clamp(18px, 2vw, 24px)" };
const pullQuoteStyle: CSSProperties = { fontSize: "clamp(22px, 2.5vw, 32px)" };
const inlineCodeStyle: CSSProperties = {
  fontSize: "15px",
  border: "1px solid var(--color-ghost-border)",
};
const codeBlockBorderStyle: CSSProperties = {
  border: "1px solid var(--color-ghost-border)",
};

// ─── Copy button labels ───────────────────────────────────────────────────────
const LABEL_COPY = "COPY";
const LABEL_COPIED = "COPIED";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getNodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (node !== null && typeof node === "object" && "props" in node) {
    return getNodeText(
      (node as { props?: { children?: ReactNode } }).props?.children,
    );
  }
  return "";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─── Writing MDX component factory ───────────────────────────────────────────
// Returns stable component overrides passed to the Content MDX component.
// onHeading must be stable (useCallback) so the components object never changes.
export function createWritingMdxComponents(onHeading: (item: TocItem) => void) {
  function H2({ children }: { children?: ReactNode }) {
    const text = getNodeText(children);
    const id = slugify(text);
    useEffect(() => {
      onHeading({ id, text, level: 2 });
    }, [id, text]);
    return (
      <h2
        id={id}
        className="font-display font-bold text-text-primary scroll-mt-24 mt-16 mb-6"
        style={h2Style}
      >
        {children}
      </h2>
    );
  }

  function H3({ children }: { children?: ReactNode }) {
    const text = getNodeText(children);
    const id = slugify(text);
    useEffect(() => {
      onHeading({ id, text, level: 3 });
    }, [id, text]);
    return (
      <h3
        id={id}
        className="font-display font-bold text-text-primary scroll-mt-24 mt-12 mb-4"
        style={h3Style}
      >
        {children}
      </h3>
    );
  }

  function P({ children }: { children?: ReactNode }) {
    return (
      <p className="font-body text-lg text-text-primary leading-[1.8] mb-7">
        {children}
      </p>
    );
  }

  function Blockquote({ children }: { children?: ReactNode }) {
    return (
      <blockquote
        className="border-l-4 border-accent bg-surface p-8 my-12 font-display font-light italic text-text-primary"
        style={pullQuoteStyle}
      >
        {children}
      </blockquote>
    );
  }

  // Named JSX component used directly in MDX content: <PullQuote>...</PullQuote>
  function PullQuote({ children }: { children?: ReactNode }) {
    return (
      <blockquote
        className="border-l-4 border-accent bg-surface p-8 my-12 font-display font-light italic text-text-primary"
        style={pullQuoteStyle}
      >
        {children}
      </blockquote>
    );
  }

  function Pre({ children }: { children?: ReactNode }) {
    const [copied, setCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
      const text = preRef.current?.textContent ?? "";
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    return (
      <div className="relative my-10">
        <pre
          ref={preRef}
          className="bg-surface overflow-x-auto p-6 text-text-primary text-sm"
          style={codeBlockBorderStyle}
        >
          {children}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 font-body font-medium text-sm text-accent uppercase tracking-[0.1em] transition-opacity duration-200"
        >
          {copied ? LABEL_COPIED : LABEL_COPY}
        </button>
      </div>
    );
  }

  function Code({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }) {
    // className present on fenced code blocks (e.g. language-js) — render plainly inside Pre
    if (className) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code
        className="font-mono text-[15px] text-accent bg-surface px-1.5 py-0.5"
        style={inlineCodeStyle}
      >
        {children}
      </code>
    );
  }

  function UL({ children }: { children?: ReactNode }) {
    return <ul className="mb-7">{children}</ul>;
  }

  function LI({ children }: { children?: ReactNode }) {
    return (
      <li className="relative pl-6 mb-3 font-body text-lg text-text-primary leading-[1.8]">
        <span
          className="absolute left-0 text-accent select-none"
          aria-hidden="true"
        >
          —
        </span>
        {children}
      </li>
    );
  }

  function HR() {
    return (
      <div className="flex items-center my-16 gap-4" aria-hidden="true">
        <div className="flex-1 border-t border-border" />
        <div className="w-1 h-1 bg-accent" />
        <div className="flex-1 border-t border-border" />
      </div>
    );
  }

  function A({ href = "", children }: { href?: string; children?: ReactNode }) {
    const isExternal = href.startsWith("http") || href.startsWith("//");
    const externalProps = isExternal
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-4 hover:text-text-primary transition-colors duration-200"
        {...externalProps}
      >
        {children}
      </a>
    );
  }

  function Strong({ children }: { children?: ReactNode }) {
    return (
      <strong className="text-accent-deep font-medium not-italic">
        {children}
      </strong>
    );
  }

  function Em({ children }: { children?: ReactNode }) {
    return <em className="text-accent italic">{children}</em>;
  }

  // Default img override — plain markdown ![]() gets the same duotone treatment
  function Img({ src = "", alt = "" }: { src?: string; alt?: string }) {
    return <ArticleImage src={src} alt={alt} />;
  }

  return {
    h2: H2,
    h3: H3,
    p: P,
    blockquote: Blockquote,
    PullQuote,
    Highlight,
    pre: Pre,
    code: Code,
    ul: UL,
    li: LI,
    hr: HR,
    a: A,
    strong: Strong,
    em: Em,
    img: Img,
    ArticleImage,
    DefinitionBlock,
    FloatImage,
    MdxLink,
    ImageGrid,
  };
}

type ProjectMdxContext = {
  industry?: string;
};

// ─── Project MDX component factory ───────────────────────────────────────────
// No TOC — project pages don't need heading registration.
export function createProjectMdxComponents(ctx: ProjectMdxContext = {}) {
  return {
    Situation,
    WhatWasBuilt,
    ProjectImage,
    ProjectImagePair,
    Outcomes,
    ProjectPullQuote,
    PullQuote: ProjectPullQuote,
    Challenge,
    SectionDivider,
    ImageGrid,

    WhatWasHard: ({
      children,
      callout,
    }: {
      children: ReactNode;
      callout?: string;
    }) => (
      <WhatWasHard callout={callout} industry={ctx.industry}>
        {children}
      </WhatWasHard>
    ),

    h2: ({ children }: { children?: ReactNode }) => (
      <h2
        className="font-display font-bold text-text-primary mt-14 mb-5"
        style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="font-display font-bold text-text-primary text-xl mt-10 mb-4">
        {children}
      </h3>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p
        className="font-body mb-5 max-w-2xl"
        style={{ fontSize: "16px", lineHeight: 1.8 }}
      >
        {children}
      </p>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="font-body mb-5 max-w-2xl space-y-2 pl-5 list-disc marker:text-accent">
        {children}
      </ul>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li style={{ fontSize: "16px", lineHeight: 1.8 }}>{children}</li>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-medium">{children}</strong>
    ),
  };
}
