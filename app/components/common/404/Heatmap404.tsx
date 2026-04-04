// Heatmap404.tsx
// Heatmap grid for the 404 page right panel.
// Canvas fills position: absolute inset: 0 — parent controls all sizing.
// Pure requestAnimationFrame — no libraries.
// 48×24 cells, 2px gap. Four states:
//   dead (12%): static 0.03
//   pulse (50%): sin 0.04–0.18, slow
//   semi-glitch (25%): sin 0.08–0.42, 2–3× faster — the living field
//   full-glitch (13%): flicker 0.04 ↔ 0.5–0.95, on 1–12 frames, off 30–90 frames

import { useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const LABEL = "DATA // NOT FOUND";

const COLS = 48;
const ROWS = 24;
const GAP = 2;
const DEAD_RATIO = 0.12;
const PULSE_RATIO = 0.5;
const SEMI_RATIO = 0.25;
// full-glitch fills the remainder (~0.13)

// Copper colour channels
const CR = 255;
const CG = 183;
const CB = 125;

// ── Types ─────────────────────────────────────────────────────────────────────

type CellState = "dead" | "pulse" | "semi-glitch" | "glitch";

type Cell = {
  state: CellState;
  // pulse + semi-glitch
  phase: number;
  phaseSpeed: number;
  // glitch only
  glitchOn: boolean;
  glitchPeak: number;
  glitchTimer: number;
  glitchOnDuration: number;
  glitchOffDuration: number;
};

// ── Initialisation ────────────────────────────────────────────────────────────

function createCells(): Cell[] {
  const total = COLS * ROWS;
  const deadCount = Math.round(total * DEAD_RATIO);
  const pulseCount = Math.round(total * PULSE_RATIO);
  const semiCount = Math.round(total * SEMI_RATIO);
  const glitchCount = total - deadCount - pulseCount - semiCount;

  const states: CellState[] = [
    ...Array<CellState>(deadCount).fill("dead"),
    ...Array<CellState>(pulseCount).fill("pulse"),
    ...Array<CellState>(semiCount).fill("semi-glitch"),
    ...Array<CellState>(glitchCount).fill("glitch"),
  ];

  // Fisher-Yates shuffle
  for (let i = states.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = states[i];
    states[i] = states[j];
    states[j] = tmp;
  }

  return states.map((state) => ({
    state,
    phase: Math.random() * Math.PI * 2,
    // semi-glitch runs 2–3× faster than pulse (pulse: 0.3–1.0, semi: 1.2–2.4)
    phaseSpeed:
      state === "semi-glitch"
        ? 1.2 + Math.random() * 1.2
        : 0.3 + Math.random() * 0.7,
    glitchOn: false,
    glitchPeak: 0.5 + Math.random() * 0.45,
    glitchTimer: Math.floor(30 + Math.random() * 60),
    glitchOnDuration: Math.floor(1 + Math.random() * 11),
    glitchOffDuration: Math.floor(30 + Math.random() * 60),
  }));
}

// ── Step ──────────────────────────────────────────────────────────────────────

function stepGlitch(cells: Cell[]): void {
  for (const cell of cells) {
    if (cell.state !== "glitch") continue;
    cell.glitchTimer--;
    if (cell.glitchTimer > 0) continue;
    cell.glitchOn = !cell.glitchOn;
    if (cell.glitchOn) {
      cell.glitchOnDuration = Math.floor(1 + Math.random() * 11);
      cell.glitchTimer = cell.glitchOnDuration;
    } else {
      cell.glitchOffDuration = Math.floor(30 + Math.random() * 60);
      cell.glitchTimer = cell.glitchOffDuration;
    }
  }
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawGhost(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  label: string,
): void {
  const size = Math.min(w * 0.55, 200);
  ctx.save();
  ctx.font = `700 ${size}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(${CR},${CG},${CB},0.10)`;
  ctx.fillText(label, w / 2, h / 2);
  ctx.restore();
}

function drawCells(
  ctx: CanvasRenderingContext2D,
  cells: Cell[],
  w: number,
  h: number,
  timestamp: number,
): void {
  const cellW = (w - (COLS - 1) * GAP) / COLS;
  const cellH = (h - (ROWS - 1) * GAP) / ROWS;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = cells[row * COLS + col];
      const x = col * (cellW + GAP);
      const y = row * (cellH + GAP);

      let alpha: number;
      if (cell.state === "dead") {
        alpha = 0.03;
      } else if (cell.state === "glitch") {
        alpha = cell.glitchOn ? cell.glitchPeak : 0.04;
      } else if (cell.state === "semi-glitch") {
        // faster sin wave, 0.08–0.42
        alpha =
          0.08 +
          0.34 *
            (0.5 +
              0.5 * Math.sin(timestamp * 0.001 * cell.phaseSpeed + cell.phase));
      } else {
        // pulse: slow sin wave, 0.04–0.18
        alpha =
          0.04 +
          0.14 *
            (0.5 +
              0.5 * Math.sin(timestamp * 0.001 * cell.phaseSpeed + cell.phase));
      }

      ctx.fillStyle = `rgba(${CR},${CG},${CB},${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, cellW, cellH);
    }
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const canvasStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  display: "block",
  height: "100%",
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  right: "16px",
  bottom: "0",
  transformOrigin: "right bottom",
  transform: "rotate(90deg)",
  whiteSpace: "nowrap",
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "var(--color-text-muted)",
  pointerEvents: "none",
  zIndex: 1,
};

// ── Component ─────────────────────────────────────────────────────────────────

type Heatmap404Props = {
  statusCode?: string;
};

export function Heatmap404({ statusCode = "404" }: Heatmap404Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusCodeRef = useRef(statusCode);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const panelEl = panelRef.current;
    const canvasEl = canvasRef.current;
    if (!panelEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const panel: HTMLDivElement = panelEl;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctxRef: CanvasRenderingContext2D = ctx;

    let isMounted = true;
    let raf = 0;
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      const rect = panel.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = w;
      canvas.height = h;
    }

    function init() {
      resize();
      cells = createCells();
    }

    function tick(ts: number) {
      if (!isMounted) return;
      ctxRef.clearRect(0, 0, w, h);
      drawGhost(ctxRef, w, h, statusCodeRef.current);
      stepGlitch(cells);
      drawCells(ctxRef, cells, w, h, ts);
      raf = requestAnimationFrame(tick);
    }

    init();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      if (isMounted) resize();
    });
    ro.observe(panel);

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={panelRef} style={panelStyle}>
      <canvas
        ref={canvasRef}
        style={canvasStyle}
        className="w-full right-0 md:w-[calc(100%-28px)] md:right-7"
      />
      <span aria-hidden="true" style={labelStyle} className="hidden md:block">
        {LABEL}
      </span>
    </div>
  );
}
