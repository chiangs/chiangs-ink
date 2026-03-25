// CurrentlyDrawer.tsx
// Triggered by clicking the live time display in the nav.
// Slides in from the right as a personal "currently" snapshot.
// Content is sourced from app/lib/currently.ts — edit there, not here.

import { useEffect, useRef } from "react";
import {
  CURRENTLY_ITEMS,
  CURRENTLY_TITLE,
  CURRENTLY_FOOTER,
  type CurrentlyItem,
} from "~/lib/currently";

const ARIA_CLOSE = "Close currently drawer";
const LABEL_CLOSE = "ESC ✕";

type CurrentlyDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CurrentlyDrawer({ isOpen, onClose }: CurrentlyDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Close on outside click — deferred so the opening click doesn't immediately close
  useEffect(() => {
    if (!isOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const id = setTimeout(
      () => document.addEventListener("mousedown", onPointer),
      100,
    );
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const blocks = CURRENTLY_ITEMS.map((item) => (
    <CurrentlyBlock key={`currently-block-${item.label}`} item={item} />
  ));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(13,13,13,0.7)",
          zIndex: 998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="currently-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(420px, 90vw)",
          background: "var(--color-card)",
          borderLeft: "1px solid var(--color-accent)",
          zIndex: 999,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          overflowY: "auto",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={ARIA_CLOSE}
          className="absolute top-6 right-6 bg-transparent border-0 font-body text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted cursor-pointer p-1 transition-colors duration-200 hover:text-accent"
        >
          {LABEL_CLOSE}
        </button>

        {/* Header */}
        <div>
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-accent-deep mb-4">
            {CURRENTLY_TITLE}
          </p>
          <div className="w-10 h-px bg-accent" />
        </div>

        {/* Content blocks */}
        {blocks}

        {/* Footer */}
        <p
          className="font-body text-[11px] text-text-muted tracking-[0.05em] leading-relaxed pt-6 mt-auto"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {CURRENTLY_FOOTER}
        </p>
      </div>
    </>
  );
}

// Individual content block — label + paragraphs, with optional book title italicised
function CurrentlyBlock({ item }: { item: CurrentlyItem }) {
  const { label, paragraphs, bookTitle } = item;

  const renderedParagraphs = paragraphs.map((text, i) => {
    const content =
      bookTitle && i === 0 ? renderWithBookTitle(text, bookTitle) : text;
    return (
      <p
        key={i}
        className="font-body text-[16px] font-normal text-text-primary leading-[1.75] m-0"
        style={{ marginTop: i > 0 ? "16px" : 0 }}
      >
        {content}
      </p>
    );
  });

  return (
    <div
      style={{
        borderLeft: "4px solid var(--color-accent)",
        paddingLeft: "20px",
      }}
    >
      <p className="font-body text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted mb-3">
        {label}
      </p>
      {renderedParagraphs}
    </div>
  );
}

// Splits the paragraph at bookTitle and wraps it in <em>
function renderWithBookTitle(text: string, bookTitle: string) {
  const idx = text.indexOf(bookTitle);
  if (idx === -1) return text;
  return (
    <>
      <em className="italic text-text-primary">{bookTitle}</em>
      {text.slice(idx + bookTitle.length)}
    </>
  );
}
