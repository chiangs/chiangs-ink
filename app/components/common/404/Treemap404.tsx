// Treemap404.tsx
// Squarified treemap for the 404 page right panel.
// Canvas fills position: absolute inset: 0 — parent controls all sizing.
// Pure requestAnimationFrame — no libraries.
// Cells animate scaleY 0→1 from top, staggered left-to-right by x-position.
// 18-frame ease-out per cell, 6-frame stagger delay between cells.

import { useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const PANEL_LABEL = "ROOT CAUSE ANALYSIS // INCONCLUSIVE";

const ANIM_FRAMES = 18;
const STAGGER_FRAMES = 6;
const PAD = 8;
const INSET = 1; // px inset each side → 2px visual gap between adjacent cells

// Copper colour channels
const CR = 255;
const CG = 183;
const CB = 125;

// ── Dataset ───────────────────────────────────────────────────────────────────

type DataItem = {
  label: string;
  value: number;
  accent: boolean;
};

const DATA: DataItem[] = [
  { label: "Wrong turn", value: 28, accent: true },
  { label: "Rogue link", value: 22, accent: true },
  { label: "Cosmic misalignment", value: 18, accent: false },
  { label: "Operator error", value: 14, accent: false },
  { label: "Aggressive clicking", value: 10, accent: false },
  { label: "Expired bookmark", value: 5, accent: false },
  { label: "Unknown forces", value: 3, accent: false },
];

// ── Types ─────────────────────────────────────────────────────────────────────

type Tile = DataItem & { x: number; y: number; w: number; h: number };

// ── Squarify ──────────────────────────────────────────────────────────────────

function worstRatio(row: number[], shortSide: number): number {
  if (row.length === 0 || shortSide === 0) return Infinity;
  const s = row.reduce((a, b) => a + b, 0);
  if (s === 0) return Infinity;
  const maxA = Math.max(...row);
  const minA = Math.min(...row);
  const s2 = s * s;
  const w2 = shortSide * shortSide;
  return Math.max((w2 * maxA) / s2, s2 / (w2 * minA));
}

function squarify(
  items: DataItem[],
  x: number,
  y: number,
  w: number,
  h: number,
): Tile[] {
  if (items.length === 0 || w <= 0 || h <= 0) return [];

  const totalValue = items.reduce((s, i) => s + i.value, 0);
  const totalArea = w * h;

  type Entry = { item: DataItem; area: number };
  let remaining: Entry[] = items.map((item) => ({
    item,
    area: (item.value / totalValue) * totalArea,
  }));

  const results: Tile[] = [];
  let rx = x,
    ry = y,
    rw = w,
    rh = h;

  while (remaining.length > 0) {
    if (remaining.length === 1) {
      results.push({ ...remaining[0].item, x: rx, y: ry, w: rw, h: rh });
      break;
    }

    const shortSide = Math.min(rw, rh);
    const row: Entry[] = [];
    const rowAreas: number[] = [];

    for (const entry of remaining) {
      const candidate = [...rowAreas, entry.area];
      if (
        row.length === 0 ||
        worstRatio(candidate, shortSide) <= worstRatio(rowAreas, shortSide)
      ) {
        row.push(entry);
        rowAreas.push(entry.area);
      } else {
        break;
      }
    }

    const rowSum = rowAreas.reduce((a, b) => a + b, 0);

    if (rw >= rh) {
      // Column along left edge
      const colW = rowSum / rh;
      let curY = ry;
      for (let i = 0; i < row.length; i++) {
        const cellH = rowAreas[i] / colW;
        results.push({ ...row[i].item, x: rx, y: curY, w: colW, h: cellH });
        curY += cellH;
      }
      rx += colW;
      rw -= colW;
    } else {
      // Row along top edge
      const rowH = rowSum / rw;
      let curX = rx;
      for (let i = 0; i < row.length; i++) {
        const cellW = rowAreas[i] / rowH;
        results.push({ ...row[i].item, x: curX, y: ry, w: cellW, h: rowH });
        curX += cellW;
      }
      ry += rowH;
      rh -= rowH;
    }

    remaining = remaining.slice(row.length);
  }

  return results;
}

// ── Easing ────────────────────────────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawTreemap(
  ctx: CanvasRenderingContext2D,
  tiles: Tile[],
  xRankMap: Map<Tile, number>,
  frame: number,
): void {
  for (const tile of tiles) {
    const xRank = xRankMap.get(tile) ?? 0;
    const startFrame = xRank * STAGGER_FRAMES;
    const raw = Math.min(Math.max((frame - startFrame) / ANIM_FRAMES, 0), 1);
    const progress = easeOutCubic(raw);

    if (progress === 0) continue;

    // Inset rect for visual gap between cells
    const ix = tile.x + INSET;
    const iy = tile.y + INSET;
    const iw = tile.w - INSET * 2;
    const ih = tile.h - INSET * 2;
    if (iw <= 0 || ih <= 0) continue;

    const drawH = ih * progress;

    ctx.save();
    ctx.beginPath();
    ctx.rect(ix, iy, iw, drawH);
    ctx.clip();

    // Fill
    ctx.fillStyle = tile.accent ? `rgba(${CR},${CG},${CB},0.22)` : "#1a1a1a";
    ctx.fillRect(ix, iy, iw, ih);

    // Accent border
    if (tile.accent) {
      ctx.strokeStyle = `rgba(${CR},${CG},${CB},1)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(ix + 0.5, iy + 0.5, iw - 1, ih - 1);
    }

    // Labels — revealed naturally as the cell scales up
    if (iw > 50) {
      ctx.font = "500 11px 'Manrope', sans-serif";
      ctx.textBaseline = "top";
      ctx.fillStyle = tile.accent
        ? `rgba(${CR},${CG},${CB},1)`
        : "rgba(115,115,113,1)";
      ctx.fillText(tile.label, ix + PAD, iy + PAD, iw - PAD * 2);

      if (ih > 48) {
        ctx.fillText(`${tile.value}%`, ix + PAD, iy + PAD + 16, iw - PAD * 2);
      }
    }

    ctx.restore();
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

export function Treemap404() {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let tiles: Tile[] = [];
    let xRankMap = new Map<Tile, number>();
    let frame = 0;
    let w = 0;
    let h = 0;

    function buildTiles() {
      tiles = squarify(DATA, 0, 0, w, h);
      const sorted = [...tiles].sort((a, b) => a.x - b.x || a.y - b.y);
      xRankMap = new Map(sorted.map((t, i) => [t, i]));
      frame = 0;
    }

    function resize() {
      const rect = panel.getBoundingClientRect();
      const newW = Math.floor(rect.width);
      const newH = Math.floor(rect.height);
      if (newW === w && newH === h) return;
      w = newW;
      h = newH;
      canvas.width = w;
      canvas.height = h;
      buildTiles();
    }

    function tick() {
      if (!isMounted) return;
      ctxRef.clearRect(0, 0, w, h);
      drawTreemap(ctxRef, tiles, xRankMap, frame);
      frame++;
      raf = requestAnimationFrame(tick);
    }

    resize();
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
        {PANEL_LABEL}
      </span>
    </div>
  );
}
