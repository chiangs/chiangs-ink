// CursorFollower.tsx
// Renders the #cursor-dot element and drives it with a RAF loop.
// No-ops on touch devices and on the server.
// Expands with a label on [data-cursor] elements:
//   data-cursor="view"  → "VIEW →"
//   data-cursor="read"  → "READ →"
//   data-cursor (no value) → "VIEW →"

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { CURSOR_LAG } from "~/lib/constants";

const CURSOR_LABEL_VIEW = "VIEW →";
const CURSOR_LABEL_READ = "READ →";
const RIPPLE_DURATION_MS = 500;

const CURSOR_LABELS: Record<string, string> = {
  view: CURSOR_LABEL_VIEW,
  read: CURSOR_LABEL_READ,
};

type Ripple = { id: number; x: number; y: number };

function getCursorLabel(el: Element): string {
  const val = el.getAttribute("data-cursor");
  if (val === null) return "";
  return CURSOR_LABELS[val] ?? CURSOR_LABEL_VIEW;
}

export function CursorFollower() {
  const [mounted, setMounted] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const location = useLocation();

  // Step 1 — detect environment; skip touch/hybrid devices
  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    setMounted(true);
  }, []);

  // Reset expanded state on route change
  useEffect(() => {
    if (!mounted) return;
    const dot = document.getElementById("cursor-dot");
    if (!dot) return;
    dot.classList.remove("expanded");
    setLabel(null);
  }, [location.pathname, mounted]);

  // Step 2 — start RAF loop and attach listeners once dot is in the DOM
  useEffect(() => {
    if (!mounted) return;

    const dot = document.getElementById("cursor-dot");
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      dotX += (mouseX - dotX) * CURSOR_LAG;
      dotY += (mouseY - dotY) * CURSOR_LAG;
      dot.style.left = `${dotX}px`;
      dot.style.top = `${dotY}px`;
      rafId = requestAnimationFrame(animate);
    };

    // Use event delegation — works for elements added after mount
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-cursor]");
      if (target) {
        dot.classList.add("expanded");
        setLabel(getCursorLabel(target));
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("[data-cursor]")) {
        dot.classList.remove("expanded");
        setLabel(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, RIPPLE_DURATION_MS);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div id="cursor-dot">{label}</div>
      {ripples.map((r) => (
        <div
          key={r.id}
          className="cursor-ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </>
  );
}
