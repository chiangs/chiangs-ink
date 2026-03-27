// NetworkGraph404.tsx
// Force-directed network graph for the 404 page right panel.
// Canvas fills position: absolute inset: 0 — parent controls all sizing.
// Pure requestAnimationFrame — no physics library.
// ~60 nodes (#FFB77D), ~90 links. 30% dead nodes pulse. 50% dead links flicker.

import { useEffect, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const LABEL = "GRAPH_404 // CONNECTION LOST";

const NODE_COUNT = 60;
const LINK_COUNT = 90;
const DEAD_NODE_RATIO = 0.3;
const DEAD_LINK_RATIO = 0.5;

// Copper colour channels
const CR = 255;
const CG = 183;
const CB = 125;

// Physics
const REPULSION = 1600;
const SPRING_REST = 100;
const SPRING_K = 0.008;
const DAMPING = 0.93;
const CENTER_PULL = 0.0005;
const MAX_SPEED = 1.8;
const DRIFT = 0.025;
const BOUNDS_PAD = 32;
const BOUNDS_PUSH = 0.4;

// ── Types ─────────────────────────────────────────────────────────────────────

type GraphNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  dead: boolean;
  phase: number;
  phaseSpeed: number;
};

type GraphLink = {
  a: number;
  b: number;
  dead: boolean;
  opacity: number;
  targetOpacity: number;
  flickerTimer: number;
  flickerInterval: number;
};

// ── Initialisation ────────────────────────────────────────────────────────────

function createNodes(cx: number, cy: number): GraphNode[] {
  const nodes: GraphNode[] = [];
  const deadCount = Math.round(NODE_COUNT * DEAD_NODE_RATIO);

  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 30;
    nodes.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 4.5,
      dead: i < deadCount,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.5 + Math.random() * 1.0,
    });
  }
  return nodes;
}

function makeLink(a: number, b: number, dead: boolean): GraphLink {
  return {
    a,
    b,
    dead,
    opacity: dead ? 0 : 0.45,
    targetOpacity: dead ? 0.55 : 0.45,
    flickerTimer: Math.random() * 1500,
    flickerInterval: 400 + Math.random() * 1800,
  };
}

function createLinks(): GraphLink[] {
  const links: GraphLink[] = [];
  const seen = new Set<string>();
  const deadCount = Math.round(LINK_COUNT * DEAD_LINK_RATIO);

  // Spanning tree — guarantees connectivity
  const order = Array.from({ length: NODE_COUNT }, (_, i) => i).sort(
    () => Math.random() - 0.5,
  );
  for (let i = 1; i < order.length && links.length < LINK_COUNT; i++) {
    const a = Math.min(order[i - 1], order[i]);
    const b = Math.max(order[i - 1], order[i]);
    const key = `${a}-${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push(makeLink(a, b, links.length < deadCount));
  }

  // Fill with random edges
  let tries = 0;
  while (links.length < LINK_COUNT && tries < 4000) {
    tries++;
    const a = Math.floor(Math.random() * NODE_COUNT);
    let b = Math.floor(Math.random() * (NODE_COUNT - 1));
    if (b >= a) b++;
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    links.push(
      makeLink(Math.min(a, b), Math.max(a, b), links.length < deadCount),
    );
  }

  return links;
}

// ── Physics ───────────────────────────────────────────────────────────────────

function stepPhysics(
  nodes: GraphNode[],
  links: GraphLink[],
  w: number,
  h: number,
  dt: number,
): void {
  const t = Math.min(dt / 16.67, 2.5);
  const cx = w / 2;
  const cy = h / 2;

  for (const n of nodes) {
    n.vx *= DAMPING;
    n.vy *= DAMPING;
  }

  // Node–node repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d2 = dx * dx + dy * dy || 1;
      const d = Math.sqrt(d2);
      const f = (REPULSION / d2) * t;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      nodes[i].vx -= fx;
      nodes[i].vy -= fy;
      nodes[j].vx += fx;
      nodes[j].vy += fy;
    }
  }

  // Link spring attraction
  for (const lk of links) {
    const a = nodes[lk.a];
    const b = nodes[lk.b];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = (d - SPRING_REST) * SPRING_K * t;
    a.vx += (dx / d) * f;
    a.vy += (dy / d) * f;
    b.vx -= (dx / d) * f;
    b.vy -= (dy / d) * f;
  }

  // Weak centre gravity
  for (const n of nodes) {
    n.vx += (cx - n.x) * CENTER_PULL * t;
    n.vy += (cy - n.y) * CENTER_PULL * t;
  }

  // Slow random drift
  for (const n of nodes) {
    n.vx += (Math.random() - 0.5) * DRIFT;
    n.vy += (Math.random() - 0.5) * DRIFT;
  }

  // Integrate, clamp speed, soft bounds
  for (const n of nodes) {
    const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
    if (speed > MAX_SPEED) {
      n.vx = (n.vx / speed) * MAX_SPEED;
      n.vy = (n.vy / speed) * MAX_SPEED;
    }
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < BOUNDS_PAD) n.vx += BOUNDS_PUSH;
    if (n.x > w - BOUNDS_PAD) n.vx -= BOUNDS_PUSH;
    if (n.y < BOUNDS_PAD) n.vy += BOUNDS_PUSH;
    if (n.y > h - BOUNDS_PAD) n.vy -= BOUNDS_PUSH;
  }
}

function stepFlicker(links: GraphLink[], dt: number): void {
  for (const lk of links) {
    if (!lk.dead) continue;
    lk.flickerTimer -= dt;
    if (lk.flickerTimer <= 0) {
      lk.targetOpacity = lk.targetOpacity < 0.1 ? 0.55 : 0;
      lk.flickerTimer = lk.flickerInterval * (0.5 + Math.random() * 0.8);
    }
    lk.opacity += (lk.targetOpacity - lk.opacity) * 0.1;
  }
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawLinks(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  links: GraphLink[],
): void {
  ctx.lineWidth = 0.5;
  for (const lk of links) {
    const opacity = lk.dead ? lk.opacity : 0.45;
    if (opacity < 0.01) continue;
    const a = nodes[lk.a];
    const b = nodes[lk.b];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${CR},${CG},${CB},${opacity.toFixed(3)})`;
    ctx.stroke();
  }
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  timestamp: number,
): void {
  for (const n of nodes) {
    const alpha = n.dead
      ? 0.12 + 0.1 * Math.sin(timestamp * 0.001 * n.phaseSpeed + n.phase)
      : 0.88;

    // Glow halo
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${CR},${CG},${CB},${(alpha * 0.12).toFixed(3)})`;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${CR},${CG},${CB},${alpha.toFixed(3)})`;
    ctx.fill();
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
  inset: 0,
  display: "block",
  width: "100%",
  height: "100%",
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  right: "64px",
  bottom: "64px",
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

export function NetworkGraph404() {
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
    let nodes: GraphNode[] = [];
    let links: GraphLink[] = [];
    let lastTs = 0;
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
      nodes = createNodes(w / 2, h / 2);
      links = createLinks();
    }

    function tick(ts: number) {
      if (!isMounted) return;
      const dt = lastTs ? ts - lastTs : 16;
      lastTs = ts;

      ctxRef.clearRect(0, 0, w, h);
      stepPhysics(nodes, links, w, h, dt);
      stepFlicker(links, dt);
      drawLinks(ctxRef, nodes, links);
      drawNodes(ctxRef, nodes, ts);

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
      <canvas ref={canvasRef} style={canvasStyle} />
      <span aria-hidden="true" style={labelStyle} className="hidden md:block">
        {LABEL}
      </span>
    </div>
  );
}
