import { useEffect, useRef, useState } from "react";
import { storage } from "~/lib/storage";

// ─── Copy ─────────────────────────────────────────────────────────────────────

const LABEL_HIDE = "Hide ↑";
const LABEL_SHOW = "Show ↓";

// ─── Style objects ────────────────────────────────────────────────────────────

const panelStyle = { paddingTop: "32px", paddingBottom: "32px" };

// ─── InsightsPanel ────────────────────────────────────────────────────────────

type InsightsPanelProps = {
  label: string;
  storageKey?: string;
  onMount?: () => void;
  onExpand?: () => void;
  children: (props: { mounted: boolean }) => React.ReactNode;
};

export function InsightsPanel({
  label,
  storageKey,
  onMount,
  onExpand,
  children,
}: InsightsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const onMountRef = useRef(onMount);
  const onExpandRef = useRef(onExpand);
  onMountRef.current = onMount;
  onExpandRef.current = onExpand;

  useEffect(() => {
    setMounted(true);
    const el = contentRef.current;

    // Restore persisted state (collapses without animation, before paint)
    const persisted = storageKey ? storage.getJSON<boolean>(storageKey) : null;
    const collapseOnMount =
      persisted === false || (persisted === null && window.innerWidth < 768);

    if (collapseOnMount && el) {
      setIsExpanded(false);
      el.style.height = "0px";
      el.style.overflow = "hidden";
    } else {
      onMountRef.current?.();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const { default: gsap } = await import("gsap");
    const el = contentRef.current;
    if (!el) {
      isAnimating.current = false;
      return;
    }
    if (isExpanded) {
      gsap.set(el, { height: el.scrollHeight, overflow: "hidden" });
      gsap.to(el, {
        height: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    } else {
      el.style.overflow = "hidden";
      onExpandRef.current?.();
      gsap.to(el, {
        height: "auto",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          el.style.overflow = "";
          isAnimating.current = false;
        },
      });
    }
    const next = !isExpanded;
    setIsExpanded(next);
    if (storageKey) storage.setJSON(storageKey, next);
  };

  return (
    <div className="bg-surface border-b border-border">
      <div
        className="max-w-container mx-auto px-margin-mob md:px-margin"
        style={panelStyle}
      >
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between"
          aria-expanded={isExpanded}
        >
          <span className="font-body font-medium text-sm text-accent uppercase tracking-[0.15em]">
            {label}
          </span>
          <span className="font-body font-medium text-sm accent-glow-pulse">
            {isExpanded ? LABEL_HIDE : LABEL_SHOW}
          </span>
        </button>
        <div ref={contentRef}>{children({ mounted })}</div>
      </div>
    </div>
  );
}
