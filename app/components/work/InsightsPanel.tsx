import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  hierarchy,
  Treemap,
  treemapSquarify,
  Group,
  useParentSize,
} from "~/lib/visx";
import { loadD3Force } from "~/lib/d3";
import type { ProjectFrontmatter } from "~/types/content";

// ─── Copy ─────────────────────────────────────────────────────────────────────

const LABEL_WORK_INSIGHTS = "WORK INSIGHTS";
const LABEL_HIDE = "Hide ↑";
const LABEL_SHOW = "Show ↓";
const LABEL_INDUSTRY_PROPORTION = "INDUSTRY PROPORTION";
const LABEL_INDUSTRY_PROPORTION_SUB = "Proportion of work by sector";
const LABEL_CAPABILITY_SPREAD = "CAPABILITY SPREAD";
const LABEL_CAPABILITY_SPREAD_SUB = "Solution type depth across all work";
const LABEL_RADAR_EMPTY = "Add more projects to generate capability spread.";
const LABEL_WORK_CONNECTIONS = "WORK CONNECTIONS";
const LABEL_WORK_CONNECTIONS_SUB =
  "Solution types and roles connected through project work";
const LABEL_TECH_STACK = "TECH STACK";
const LABEL_TECH_STACK_SUB =
  "Sized by frequency · Copper = used across multiple projects";
const LABEL_AVG_MVP = "AVG. TIME TO MVP";
const LABEL_MONTHS_TO_MVP = "months to MVP";
const LABEL_NETWORK_EMPTY = "Add more projects to reveal work connections.";

// ─── Industry colour map ──────────────────────────────────────────────────────

const INDUSTRY_COLORS: Record<string, string> = {
  Maritime: "var(--color-accent)",
  "Oil & Gas / Energy": "var(--color-accent-deep)",
  "Defence / Military": "var(--color-text-muted)",
  "Government / Public Sector": "var(--color-text-primary)",
  "Consulting & Professional Services": "#3a3a38",
  Healthcare: "#2e2e2c",
  "Technology / SaaS": "#4a4a48",
};
const INDUSTRY_COLOR_FALLBACK = "var(--color-border)";

// ─── Chart config ─────────────────────────────────────────────────────────────

const WAFFLE_COLS = 10;
const WAFFLE_ROWS = 10;
const WAFFLE_CELL = 14;
const WAFFLE_GAP = 2;
const WAFFLE_TOTAL = WAFFLE_COLS * WAFFLE_ROWS;
const WAFFLE_SVG = WAFFLE_COLS * (WAFFLE_CELL + WAFFLE_GAP) - WAFFLE_GAP;

const RADAR_HEIGHT = 280;
const RADAR_OUTER_R = 90;
const RADAR_OUTER_R_MOB = 70;
const RADAR_RINGS = 3;
const RADAR_MAX_AXES = 8;
const RADAR_LABEL_OFFSET = 14;
const RADAR_LINE_HEIGHT = 13;

const NETWORK_HEIGHT = 240;
const NETWORK_SOL_R = 6;
const NETWORK_LABEL_MAX = 14;

// ─── Style objects ────────────────────────────────────────────────────────────

const panelStyle = { paddingTop: "32px", paddingBottom: "32px" };
const cellStyle = { padding: "20px", background: "#131313" };
const avgValueStyle: React.CSSProperties = {
  fontSize: "64px",
  lineHeight: 1,
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  background: "var(--gradient-viz)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const networkLegendStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  pointerEvents: "none",
};
const tooltipBaseStyle: React.CSSProperties = {
  position: "absolute",
  background: "#2a2a2a",
  padding: "8px 12px",
  pointerEvents: "none",
  zIndex: 10,
  maxWidth: 180,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightData = {
  industryCounts: [string, number][];
  radarAxes: { label: string; value: number }[];
  networkNodes: { id: string; type: "solutionType" | "role" }[];
  networkLinks: { source: string; target: string }[];
  networkLinkCounts: Record<string, number>;
  networkNodeProjectCounts: Record<string, number>;
  stackTree: { name: string; children: { name: string; value: number }[] }[];
  avgMVP: number | null;
  totalProjects: number;
  uniqueIndustries: number;
};

// ─── Pure data computation ────────────────────────────────────────────────────

function computeInsights(projects: ProjectFrontmatter[]): InsightData {
  const rawIndustry: Record<string, number> = {};
  const rawSolutionType: Record<string, number> = {};
  const rawFrameworks: Record<string, number> = {};
  const rawLanguages: Record<string, number> = {};
  const rawPlatforms: Record<string, number> = {};
  const mvpTimes: number[] = [];

  // Network: solutionType ↔ role
  const networkLinkCounts: Record<string, number> = {};
  const solSet = new Set<string>();
  const roleSet = new Set<string>();
  const nodeProjectCounts: Record<string, number> = {};

  for (const p of projects) {
    const inds = p.industries ?? p.industry ?? [];
    const sols = p.solutionType ?? [];
    const roles = p.roles ?? [];

    for (const ind of inds) {
      rawIndustry[ind] = (rawIndustry[ind] ?? 0) + 1;
    }
    for (const sol of sols) {
      rawSolutionType[sol] = (rawSolutionType[sol] ?? 0) + 1;
      solSet.add(`sol:${sol}`);
      nodeProjectCounts[`sol:${sol}`] =
        (nodeProjectCounts[`sol:${sol}`] ?? 0) + 1;
    }
    for (const role of roles) {
      roleSet.add(`role:${role}`);
      nodeProjectCounts[`role:${role}`] =
        (nodeProjectCounts[`role:${role}`] ?? 0) + 1;
    }
    for (const sol of sols) {
      for (const role of roles) {
        const key = `sol:${sol}|role:${role}`;
        networkLinkCounts[key] = (networkLinkCounts[key] ?? 0) + 1;
      }
    }

    if (p.stack) {
      for (const f of p.stack.frameworks)
        rawFrameworks[f] = (rawFrameworks[f] ?? 0) + 1;
      for (const l of p.stack.languages)
        rawLanguages[l] = (rawLanguages[l] ?? 0) + 1;
      for (const pl of p.stack.platforms)
        rawPlatforms[pl] = (rawPlatforms[pl] ?? 0) + 1;
    }
    for (const m of p.metrics) {
      if (/month|mvp/i.test(m.label)) {
        const n = parseFloat(m.value);
        if (!isNaN(n)) mvpTimes.push(n);
      }
    }
  }

  const avgMVP =
    mvpTimes.length > 0
      ? mvpTimes.reduce((a, b) => a + b, 0) / mvpTimes.length
      : null;

  // Radar: top RADAR_MAX_AXES solution types by frequency
  const radarAxes = Object.entries(rawSolutionType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, RADAR_MAX_AXES)
    .map(([label, value]) => ({ label, value }));

  const networkNodes = [
    ...Array.from(solSet).map((id) => ({ id, type: "solutionType" as const })),
    ...Array.from(roleSet).map((id) => ({ id, type: "role" as const })),
  ];
  const networkLinks = Object.keys(networkLinkCounts).map((key) => {
    const sep = key.indexOf("|");
    return { source: key.slice(0, sep), target: key.slice(sep + 1) };
  });

  const makeChildren = (rec: Record<string, number>) =>
    Object.entries(rec)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

  const stackTree = [
    { name: "Frameworks", children: makeChildren(rawFrameworks) },
    { name: "Languages", children: makeChildren(rawLanguages) },
    { name: "Platforms", children: makeChildren(rawPlatforms) },
  ].filter((g) => g.children.length > 0);

  return {
    industryCounts: Object.entries(rawIndustry).sort((a, b) => b[1] - a[1]),
    radarAxes,
    networkNodes,
    networkLinks,
    networkLinkCounts,
    networkNodeProjectCounts: nodeProjectCounts,
    stackTree,
    avgMVP,
    totalProjects: projects.length,
    uniqueIndustries: Object.keys(rawIndustry).length,
  };
}

// ─── ChartLabel ───────────────────────────────────────────────────────────────

function ChartLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] mb-3">
      {children}
    </p>
  );
}

// ─── WaffleChart ──────────────────────────────────────────────────────────────

function WaffleChart({
  industryCounts,
  total,
}: {
  industryCounts: [string, number][];
  total: number;
}) {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

  const { cells, cellInfo } = useMemo(() => {
    const filledCells = new Array<string>(WAFFLE_TOTAL).fill(
      INDUSTRY_COLOR_FALLBACK,
    );
    const info = new Array<string>(WAFFLE_TOTAL).fill("");
    let idx = 0;
    for (const [industry, count] of industryCounts) {
      const numCells = Math.round((count / Math.max(total, 1)) * WAFFLE_TOTAL);
      const color = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLOR_FALLBACK;
      for (let i = 0; i < numCells && idx < WAFFLE_TOTAL; i++) {
        filledCells[idx] = color;
        info[idx] = industry;
        idx++;
      }
    }
    return { cells: filledCells, cellInfo: info };
  }, [industryCounts, total]);

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_INDUSTRY_PROPORTION}</ChartLabel>
      <p
        className="font-body font-normal text-sm text-text-muted"
        style={{ marginBottom: 16 }}
      >
        {LABEL_INDUSTRY_PROPORTION_SUB}
      </p>
      <div className="flex gap-4 items-start">
        <svg
          viewBox={`0 0 ${WAFFLE_SVG} ${WAFFLE_SVG}`}
          width={WAFFLE_SVG}
          height={WAFFLE_SVG}
          aria-label="Industry proportion waffle chart"
          className="shrink-0 mt-4"
        >
          {cells.map((color, i) => {
            const col = i % WAFFLE_COLS;
            const row = Math.floor(i / WAFFLE_ROWS);
            const x = col * (WAFFLE_CELL + WAFFLE_GAP);
            const y = row * (WAFFLE_CELL + WAFFLE_GAP);
            const isDimmed =
              hoveredIndustry !== null &&
              cellInfo[i] !== hoveredIndustry &&
              cellInfo[i] !== "";
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={WAFFLE_CELL}
                height={WAFFLE_CELL}
                fill={color}
                opacity={isDimmed ? 0.2 : 1}
                style={{ cursor: "default", transition: "opacity 0.15s" }}
                onMouseEnter={() => {
                  if (cellInfo[i]) setHoveredIndustry(cellInfo[i]);
                }}
                onMouseLeave={() => setHoveredIndustry(null)}
              />
            );
          })}
        </svg>
        <div className="flex flex-col gap-1.5 min-w-0 mt-4">
          {industryCounts.map(([industry, count]) => {
            const pct = Math.round((count / Math.max(total, 1)) * 100);
            const color = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLOR_FALLBACK;
            return (
              <div key={industry} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="shrink-0 inline-block"
                  style={{ width: 10, height: 10, background: color }}
                />
                <span className="font-body font-normal text-sm text-text-muted truncate">
                  {industry} {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CapabilityRadar ──────────────────────────────────────────────────────────

const radarPolygonStyle: React.CSSProperties = {
  fill: "rgba(255,183,125,0.15)",
  stroke: "#FFB77D",
  strokeWidth: 1.5,
  transformOrigin: "center center",
};

function CapabilityRadar({
  axes,
}: {
  axes: { label: string; value: number }[];
}) {
  const { parentRef, width } = useParentSize({ debounceTime: 100 });
  const isMob = width > 0 && width < 400;
  const outerR = isMob ? RADAR_OUTER_R_MOB : RADAR_OUTER_R;
  const cx = width > 0 ? width / 2 : 0;
  const cy = RADAR_HEIGHT / 2;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const axisRefs = useRef<(SVGLineElement | null)[]>([]);
  const polygonRef = useRef<SVGPolygonElement | null>(null);

  const n = axes.length;
  const maxVal = Math.max(...axes.map((a) => a.value), 1);
  const isEmpty = n < 3;

  // Angle for each axis: start at top (−π/2), go clockwise
  const angleOf = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;

  const pointOnAxis = (i: number, r: number) => ({
    x: cx + r * Math.cos(angleOf(i)),
    y: cy + r * Math.sin(angleOf(i)),
  });

  const polygonPoints = useMemo(
    () =>
      axes
        .map((a, i) => {
          const r = (a.value / maxVal) * outerR;
          const pt = pointOnAxis(i, r);
          return `${pt.x},${pt.y}`;
        })
        .join(" "),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [axes, cx, cy, outerR, maxVal],
  );

  // Animate axes then polygon on mount / data change
  useEffect(() => {
    if (!width || isEmpty) return;
    let isMounted = true;

    const run = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;

      // Axis lines: each grows from center outward (animate individually for type safety)
      const lines = axisRefs.current.filter(Boolean) as SVGLineElement[];
      lines.forEach((line, i) => {
        const pt = pointOnAxis(i, outerR);
        gsap.fromTo(
          line,
          { attr: { x2: cx, y2: cy } },
          {
            attr: { x2: pt.x, y2: pt.y },
            duration: 0.3,
            delay: i * 0.04,
            ease: "power2.out",
            onComplete: () => {
              if (i !== lines.length - 1 || !isMounted || !polygonRef.current)
                return;
              // Polygon scales in after last axis finishes
              gsap.fromTo(
                polygonRef.current,
                { scale: 0 },
                {
                  scale: 1,
                  duration: 0.6,
                  ease: "power2.out",
                  transformOrigin: `${cx}px ${cy}px`,
                },
              );
            },
          },
        );
      });
    };

    run();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, n, cx, cy, outerR, isEmpty]);

  // Tooltip for hovered vertex
  const tooltipData = useMemo(() => {
    if (hoveredIdx === null) return null;
    const a = axes[hoveredIdx];
    const r = (a.value / maxVal) * outerR;
    const pt = pointOnAxis(hoveredIdx, r);
    return { label: a.label, value: a.value, x: pt.x + 10, y: pt.y - 10 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIdx, axes, cx, cy, outerR, maxVal]);

  const tooltipStyle = useMemo(
    (): React.CSSProperties => ({
      ...tooltipBaseStyle,
      left: tooltipData?.x ?? 0,
      top: tooltipData?.y ?? 0,
    }),
    [tooltipData],
  );

  // text-anchor based on position around the circle
  const labelAnchor = (i: number): "start" | "end" | "middle" => {
    const angle = angleOf(i);
    const cos = Math.cos(angle);
    if (cos > 0.3) return "start";
    if (cos < -0.3) return "end";
    return "middle";
  };

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_CAPABILITY_SPREAD}</ChartLabel>
      <p
        className="font-body font-normal text-sm text-text-muted"
        style={{ marginBottom: 16 }}
      >
        {LABEL_CAPABILITY_SPREAD_SUB}
      </p>

      {isEmpty ? (
        <div
          className="flex items-center justify-center text-center"
          style={{ height: RADAR_HEIGHT }}
        >
          <span className="font-body font-normal text-sm text-text-muted">
            {LABEL_RADAR_EMPTY}
          </span>
        </div>
      ) : (
        <div
          ref={parentRef as React.RefObject<HTMLDivElement>}
          style={{ height: RADAR_HEIGHT, position: "relative" }}
        >
          {width > 0 && (
            <>
              <svg
                width={width}
                height={RADAR_HEIGHT}
                style={{ display: "block", overflow: "visible" }}
              >
                <Group>
                  {/* Concentric guide rings */}
                  {Array.from({ length: RADAR_RINGS }, (_, ri) => {
                    const r = ((ri + 1) / (RADAR_RINGS + 1)) * outerR;
                    const pts = Array.from({ length: n }, (__, i) => {
                      const pt = pointOnAxis(i, r);
                      return `${pt.x},${pt.y}`;
                    }).join(" ");
                    return (
                      <polygon
                        key={ri}
                        points={pts}
                        fill="none"
                        stroke="#222220"
                        strokeWidth={0.5}
                      />
                    );
                  })}

                  {/* Axis lines */}
                  {axes.map((_, i) => {
                    const outer = pointOnAxis(i, outerR);
                    return (
                      <line
                        key={i}
                        ref={(el) => {
                          axisRefs.current[i] = el;
                        }}
                        x1={cx}
                        y1={cy}
                        x2={outer.x}
                        y2={outer.y}
                        stroke="#1e1e1e"
                        strokeWidth={1}
                      />
                    );
                  })}

                  {/* Data polygon */}
                  <polygon
                    ref={polygonRef}
                    points={polygonPoints}
                    style={radarPolygonStyle}
                  />

                  {/* Vertex dots */}
                  {axes.map((a, i) => {
                    const r = (a.value / maxVal) * outerR;
                    const pt = pointOnAxis(i, r);
                    const isHovered = hoveredIdx === i;
                    return (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5 : 3}
                        fill="#FFB77D"
                        style={{ cursor: "default", transition: "r 0.1s" }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />
                    );
                  })}

                  {/* Axis labels — wrap on spaces, vertically centred */}
                  {axes.map((a, i) => {
                    const pt = pointOnAxis(i, outerR + RADAR_LABEL_OFFSET);
                    const words = a.label.split(" ");
                    const totalH = (words.length - 1) * RADAR_LINE_HEIGHT;
                    const startY = pt.y - totalH / 2;
                    return (
                      <text
                        key={i}
                        x={pt.x}
                        y={startY}
                        textAnchor={labelAnchor(i)}
                        dominantBaseline="middle"
                        fontSize={11}
                        fontFamily="var(--font-body)"
                        fontWeight={400}
                        fill="#5a5a58"
                      >
                        {words.map((word, wi) => (
                          <tspan
                            key={wi}
                            x={pt.x}
                            dy={wi === 0 ? 0 : RADAR_LINE_HEIGHT}
                          >
                            {word}
                          </tspan>
                        ))}
                      </text>
                    );
                  })}
                </Group>
              </svg>

              {/* Tooltip */}
              {hoveredIdx !== null && tooltipData && (
                <div style={tooltipStyle}>
                  <div className="font-body font-normal text-sm text-text-primary">
                    {tooltipData.label}
                  </div>
                  <div className="font-body font-normal text-sm text-text-muted mt-0.5">
                    {tooltipData.value} project
                    {tooltipData.value !== 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NetworkGraph ─────────────────────────────────────────────────────────────

type NodeDatum = {
  id: string;
  type: "solutionType" | "role";
  x?: number;
  y?: number;
};
type LinkDatum = { source: string; target: string };

type PositionedNode = { id: string; x: number; y: number; type: string };
type PositionedLink = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  sourceId: string;
  targetId: string;
};

function truncateLabel(text: string): string {
  return text.length > NETWORK_LABEL_MAX
    ? text.slice(0, NETWORK_LABEL_MAX - 1) + "…"
    : text;
}

function stripPrefix(id: string): string {
  return id.replace(/^(ind:|sol:|role:)/, "");
}

function NetworkGraph({
  nodes: rawNodes,
  links: rawLinks,
  linkCounts,
  nodeProjectCounts,
}: {
  nodes: NodeDatum[];
  links: LinkDatum[];
  linkCounts: Record<string, number>;
  nodeProjectCounts: Record<string, number>;
}) {
  const { parentRef, width } = useParentSize({ debounceTime: 100 });

  const [positions, setPositions] = useState<{
    nodes: PositionedNode[];
    links: PositionedLink[];
  } | null>(null);

  const [hoveredNode, setHoveredNode] = useState<PositionedNode | null>(null);

  const isEmpty = rawNodes.length < 2 || rawLinks.length === 0;

  useEffect(() => {
    if (!width || rawNodes.length === 0) return;
    let isMounted = true;

    const run = async () => {
      const {
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter,
        forceCollide,
      } = await loadD3Force();
      if (!isMounted) return;

      const nodesCopy: (NodeDatum & { x: number; y: number })[] = rawNodes.map(
        (n) => ({
          ...n,
          x: width / 2 + (Math.random() - 0.5) * 80,
          y: NETWORK_HEIGHT / 2 + (Math.random() - 0.5) * 80,
        }),
      );

      const nodeById = new Map(nodesCopy.map((n) => [n.id, n]));

      const linksCopy = rawLinks
        .map((l) => ({
          source: nodeById.get(l.source)!,
          target: nodeById.get(l.target)!,
          _sourceId: l.source,
          _targetId: l.target,
        }))
        .filter((l) => l.source && l.target);

      // Collision radius = node radius + half max label width, so labels don't overlap
      const collideRadius = () => NETWORK_SOL_R + 44;

      // Repel nodes from the top-right legend zone (~110×52px at top-right corner)
      const legendCx = width - 63;
      const legendCy = 34;
      const legendRepelR = 80;
      const legendRepelForce = (alpha: number) => {
        for (const node of nodesCopy) {
          const dx = (node.x ?? 0) - legendCx;
          const dy = (node.y ?? 0) - legendCy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < legendRepelR) {
            const f = ((legendRepelR - dist) / legendRepelR) * alpha * 2;
            (node as { vx?: number }).vx =
              ((node as { vx?: number }).vx ?? 0) + (dx / dist) * f;
            (node as { vy?: number }).vy =
              ((node as { vy?: number }).vy ?? 0) + (dy / dist) * f;
          }
        }
      };

      const sim = forceSimulation(nodesCopy as never[])
        .force(
          "link",
          forceLink(linksCopy)
            .id((d: unknown) => (d as NodeDatum).id)
            .distance(80),
        )
        .force("charge", forceManyBody().strength(-120))
        .force("center", forceCenter(width * 0.44, NETWORK_HEIGHT / 2 + 8))
        .force(
          "collide",
          forceCollide()
            .radius(collideRadius as never)
            .strength(0.8),
        )
        .force("legendRepel", legendRepelForce as never)
        .stop();

      for (let i = 0; i < 200; i++) sim.tick();

      if (!isMounted) return;

      // Pad by enough to keep node + label inside bounds
      // Label is up to 14 chars ~5.5px wide = ~77px, centered → 38px each side
      // Label sits r+11=17px below center; add a few px margin
      const PAD_X = 44;
      const PAD_Y_TOP = 16;
      const PAD_Y_BOT = 28; // extra for label below node
      setPositions({
        nodes: nodesCopy.map((n) => ({
          id: n.id,
          x: Math.max(PAD_X, Math.min(width - PAD_X, n.x ?? 0)),
          y: Math.max(
            PAD_Y_TOP,
            Math.min(NETWORK_HEIGHT - PAD_Y_BOT, n.y ?? 0),
          ),
          type: n.type,
        })),
        links: linksCopy.map((l) => ({
          x1: (l.source as { x: number }).x ?? 0,
          y1: (l.source as { y: number }).y ?? 0,
          x2: (l.target as { x: number }).x ?? 0,
          y2: (l.target as { y: number }).y ?? 0,
          sourceId: l._sourceId,
          targetId: l._targetId,
        })),
      });
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [width, rawNodes, rawLinks]);

  const edgeCount = (l: PositionedLink) => {
    return (
      linkCounts[`${l.sourceId}|${l.targetId}`] ??
      linkCounts[`${l.targetId}|${l.sourceId}`] ??
      1
    );
  };

  const tooltipContent = useMemo(() => {
    if (!hoveredNode) return null;
    const label = stripPrefix(hoveredNode.id);
    const isRole = hoveredNode.type === "role";
    const projectCount = nodeProjectCounts[hoveredNode.id] ?? 0;
    const detail = `Appears in ${projectCount} project${projectCount !== 1 ? "s" : ""}`;
    const typeLabel = isRole ? "Role" : "Solution type";
    return { label, type: typeLabel, detail };
  }, [hoveredNode, nodeProjectCounts]);

  const tooltipStyle = useMemo((): React.CSSProperties => {
    if (!hoveredNode) return tooltipBaseStyle;
    const x = hoveredNode.x + 14;
    const y = Math.max(0, hoveredNode.y - 12);
    return { ...tooltipBaseStyle, left: x, top: y };
  }, [hoveredNode]);

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_WORK_CONNECTIONS}</ChartLabel>
      <p className="font-body font-normal text-sm text-text-muted mb-4">
        {LABEL_WORK_CONNECTIONS_SUB}
      </p>

      {isEmpty ? (
        <div
          className="flex items-center justify-center text-center"
          style={{ height: NETWORK_HEIGHT }}
        >
          <span className="font-body font-normal text-sm text-text-muted">
            {LABEL_NETWORK_EMPTY}
          </span>
        </div>
      ) : (
        <div
          ref={parentRef as React.RefObject<HTMLDivElement>}
          style={{
            height: NETWORK_HEIGHT,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {positions && width > 0 && (
            <>
              <svg
                width={width}
                height={NETWORK_HEIGHT}
                style={{ display: "block" }}
              >
                {/* Links */}
                {positions.links.map((l, i) => {
                  const count = edgeCount(l);
                  const isStrong = count >= 2;
                  return (
                    <line
                      key={i}
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      stroke={isStrong ? "rgba(255,183,125,0.4)" : "#2a2a2a"}
                      strokeWidth={isStrong ? 2 : 1}
                    />
                  );
                })}

                {/* Nodes + Labels */}
                {positions.nodes.map((n) => {
                  const isRole = n.type === "role";
                  const label = stripPrefix(n.id);
                  return (
                    <g
                      key={n.id}
                      transform={`translate(${n.x},${n.y})`}
                      style={{ cursor: "default" }}
                      onMouseEnter={() => setHoveredNode(n)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <title>{label}</title>
                      {isRole ? (
                        <circle r={NETWORK_SOL_R} fill="#D97707" />
                      ) : (
                        <circle
                          r={NETWORK_SOL_R}
                          fill="none"
                          stroke="#5a5a58"
                          strokeWidth={1.5}
                        />
                      )}
                      <text
                        y={NETWORK_SOL_R + 11}
                        textAnchor="middle"
                        fontSize={9}
                        fontFamily="var(--font-body)"
                        fontWeight={400}
                        fill={isRole ? "#D97707" : "#5a5a58"}
                      >
                        {truncateLabel(label)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredNode && tooltipContent && (
                <div style={tooltipStyle}>
                  <div className="font-body font-normal text-sm text-text-primary">
                    {tooltipContent.label}
                  </div>
                  <div className="font-body font-normal text-sm text-text-muted mt-0.5">
                    {tooltipContent.type}
                  </div>
                  <div className="font-body font-normal text-sm text-text-muted mt-0.5">
                    {tooltipContent.detail}
                  </div>
                </div>
              )}

              {/* Legend */}
              <div style={networkLegendStyle}>
                <div className="flex items-center gap-1.5">
                  <svg width={12} height={12}>
                    <circle
                      cx={6}
                      cy={6}
                      r={5}
                      fill="none"
                      stroke="#5a5a58"
                      strokeWidth={1.5}
                    />
                  </svg>
                  <span className="font-body font-normal text-sm text-text-muted">
                    Solution type
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width={12} height={12}>
                    <circle cx={6} cy={6} r={5} fill="#D97707" />
                  </svg>
                  <span className="font-body font-normal text-sm text-text-muted">
                    Role
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TechTreemap ──────────────────────────────────────────────────────────────

type TreeLeaf = { name: string; value?: number; children?: TreeLeaf[] };

function TechTreemap({
  stackTree,
}: {
  stackTree: { name: string; children: { name: string; value: number }[] }[];
}) {
  const { parentRef, width } = useParentSize({ debounceTime: 100 });
  const HEIGHT = 150;

  if (!stackTree.length) return null;

  const root = hierarchy<TreeLeaf>({
    name: "root",
    children: stackTree as TreeLeaf[],
  })
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  const groupColors: Record<string, string> = {
    Frameworks: "var(--color-accent)",
    Languages: "var(--color-accent-deep)",
    Platforms: "var(--color-text-muted)",
  };

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_TECH_STACK}</ChartLabel>
      <p
        className="font-body font-normal text-sm text-text-muted"
        style={{ marginBottom: 16 }}
      >
        {LABEL_TECH_STACK_SUB}
      </p>
      <div
        ref={parentRef as React.RefObject<HTMLDivElement>}
        style={{ height: HEIGHT }}
      >
        {width > 0 && (
          <Treemap
            top={0}
            left={0}
            root={root}
            size={[width, HEIGHT]}
            tile={treemapSquarify}
            round
          >
            {(treemap) => (
              <svg width={width} height={HEIGHT}>
                {treemap
                  .descendants()
                  .filter((n) => n.depth > 0)
                  .map((node, i) => {
                    const x = node.x0;
                    const y = node.y0;
                    const w = node.x1 - node.x0;
                    const h = node.y1 - node.y0;
                    const isLeaf = node.depth === 2;
                    const parentName = node.parent?.data?.name ?? "";
                    const fill = isLeaf
                      ? "#1e1e1e"
                      : (groupColors[node.data?.name ?? ""] ?? "#2a2a2a");
                    return (
                      <g key={`treemap-${i}`}>
                        <rect
                          x={x + 1}
                          y={y + 1}
                          width={Math.max(w - 2, 0)}
                          height={Math.max(h - 2, 0)}
                          fill={fill}
                        />
                        {isLeaf && w > 40 && h > 14 && (
                          <text
                            x={x + 6}
                            y={y + 14}
                            fontSize={9}
                            fontFamily="var(--font-body)"
                            fontWeight={500}
                            fill={
                              groupColors[parentName] ??
                              "var(--color-text-muted)"
                            }
                            clipPath={`url(#clip-${i})`}
                          >
                            {node.data?.name}
                          </text>
                        )}
                        <defs>
                          <clipPath id={`clip-${i}`}>
                            <rect x={x} y={y} width={w} height={h} />
                          </clipPath>
                        </defs>
                      </g>
                    );
                  })}
              </svg>
            )}
          </Treemap>
        )}
      </div>
    </div>
  );
}

// ─── AvgMVPStat ───────────────────────────────────────────────────────────────

function AvgMVPStat({ avgMVP }: { avgMVP: number | null }) {
  const displayValue =
    avgMVP === null
      ? "—"
      : Number.isInteger(avgMVP)
        ? String(avgMVP)
        : avgMVP.toFixed(1);

  return (
    <div style={cellStyle} className="flex flex-col justify-between h-full">
      <ChartLabel>{LABEL_AVG_MVP}</ChartLabel>
      <div className="flex flex-col justify-center flex-1">
        <span style={avgValueStyle}>{displayValue}</span>
        <span className="font-body font-normal text-sm text-text-muted block mt-2">
          {LABEL_MONTHS_TO_MVP}
        </span>
      </div>
    </div>
  );
}

// ─── InsightsPanel ────────────────────────────────────────────────────────────

export function InsightsPanel({
  projects,
}: {
  projects: ProjectFrontmatter[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const insights = useMemo(() => computeInsights(projects), [projects]);

  const subLabel = `${projects.length} project${projects.length !== 1 ? "s" : ""} across ${insights.uniqueIndustries} ${insights.uniqueIndustries !== 1 ? "industries" : "industry"}.`;

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 768 && contentRef.current) {
      setIsExpanded(false);
      contentRef.current.style.height = "0px";
      contentRef.current.style.overflow = "hidden";
    }
  }, []);

  const handleToggle = async () => {
    const { default: gsap } = await import("gsap");
    const el = contentRef.current;
    if (!el) return;

    if (isExpanded) {
      gsap.set(el, { height: el.scrollHeight, overflow: "hidden" });
      gsap.to(el, { height: 0, duration: 0.4, ease: "power2.inOut" });
    } else {
      el.style.overflow = "hidden";
      gsap.to(el, {
        height: "auto",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          el.style.overflow = "";
        },
      });
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="bg-surface border-b border-border">
      <div
        className="max-w-container mx-auto px-margin-mob md:px-margin"
        style={panelStyle}
      >
        {/* Toggle header */}
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between"
          aria-expanded={isExpanded}
        >
          <span className="font-body font-medium text-sm text-accent uppercase tracking-[0.15em]">
            {LABEL_WORK_INSIGHTS}
          </span>
          <span className="font-body font-medium text-sm text-text-muted">
            {isExpanded ? LABEL_HIDE : LABEL_SHOW}
          </span>
        </button>

        {/* Collapsible body */}
        <div ref={contentRef}>
          <p className="font-body font-normal text-sm text-text-muted mt-3 mb-6">
            {subLabel}
          </p>

          {mounted && (
            <>
              {/* Row 1 — 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <WaffleChart
                  industryCounts={insights.industryCounts}
                  total={insights.totalProjects}
                />
                <CapabilityRadar axes={insights.radarAxes} />
                <NetworkGraph
                  nodes={insights.networkNodes}
                  links={insights.networkLinks}
                  linkCounts={insights.networkLinkCounts}
                  nodeProjectCounts={insights.networkNodeProjectCounts}
                />
              </div>

              {/* Row 2 — treemap spans 2, stat spans 1 — desktop only */}
              <div className="hidden md:grid grid-cols-3 gap-3 mt-3">
                <div className="md:col-span-2">
                  <TechTreemap stackTree={insights.stackTree} />
                </div>
                <AvgMVPStat avgMVP={insights.avgMVP} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
