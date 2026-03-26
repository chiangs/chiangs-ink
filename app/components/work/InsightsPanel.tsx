import React, { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, Treemap, treemapSquarify } from "~/lib/visx";
import { HeatmapRect } from "~/lib/visx";
import { Graph } from "~/lib/visx";
import { useParentSize } from "~/lib/visx";
import { loadD3Force } from "~/lib/d3";
import type { ProjectFrontmatter } from "~/types/content";

// ─── Copy ─────────────────────────────────────────────────────────────────────

const LABEL_WORK_INSIGHTS = "WORK INSIGHTS";
const LABEL_HIDE = "Hide ↑";
const LABEL_SHOW = "Show ↓";
const LABEL_INDUSTRY_PROPORTION = "INDUSTRY PROPORTION";
const LABEL_PROJECT_ACTIVITY = "PROJECT ACTIVITY";
const LABEL_WORK_CONNECTIONS = "WORK CONNECTIONS";
const LABEL_TECH_STACK = "TECH STACK";
const LABEL_AVG_MVP = "AVG. TIME TO MVP";
const LABEL_MONTHS_TO_MVP = "months to MVP";

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

const HEAT_MONTHS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];
const HEAT_CELL = 14;
const HEAT_GAP = 2;

const NETWORK_NODE_R = 5;

// ─── Style objects ────────────────────────────────────────────────────────────

const panelStyle = { paddingTop: "32px", paddingBottom: "32px" };
const cellStyle = { padding: "20px", background: "#131313" };
const avgValueStyle = {
  fontSize: "48px",
  lineHeight: 1,
  color: "var(--color-accent)",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
};
const legendGridStyle = { gridTemplateColumns: "1fr 1fr" };

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightData = {
  industryCounts: [string, number][];
  yearMonthData: { year: number; month: number; count: number }[];
  years: number[];
  networkNodes: { id: string; type: "role" | "industry" | "tag" }[];
  networkLinks: { source: string; target: string }[];
  stackTree: { name: string; children: { name: string; value: number }[] }[];
  avgMVP: number | null;
  totalProjects: number;
  uniqueIndustries: number;
};

// ─── Pure data computation ────────────────────────────────────────────────────

function computeInsights(projects: ProjectFrontmatter[]): InsightData {
  const rawIndustry: Record<string, number> = {};
  const rawYearMonth: Record<string, number> = {};
  const rawFrameworks: Record<string, number> = {};
  const rawLanguages: Record<string, number> = {};
  const rawPlatforms: Record<string, number> = {};
  const mvpTimes: number[] = [];

  const nodeSet = new Set<string>();
  const linkSet = new Set<string>();
  const edges: { source: string; target: string }[] = [];

  for (const p of projects) {
    const year = Number(p.year);
    // distribute across months evenly for heatmap
    const monthKey = `${year}-${(year % 12) + 1}`;
    rawYearMonth[monthKey] = (rawYearMonth[monthKey] ?? 0) + 1;

    for (const ind of p.industries ?? p.industry ?? []) {
      rawIndustry[ind] = (rawIndustry[ind] ?? 0) + 1;
      if (!nodeSet.has(`ind:${ind}`)) {
        nodeSet.add(`ind:${ind}`);
      }
    }
    for (const role of p.roles) {
      if (!nodeSet.has(`role:${role}`)) {
        nodeSet.add(`role:${role}`);
      }
    }
    for (const tag of p.solutionType ?? p.tags ?? []) {
      if (!nodeSet.has(`tag:${tag}`)) {
        nodeSet.add(`tag:${tag}`);
      }
    }
    // link roles ↔ industries
    for (const ind of p.industries ?? p.industry ?? []) {
      for (const role of p.roles) {
        const key = `ind:${ind}|role:${role}`;
        if (!linkSet.has(key)) {
          linkSet.add(key);
          edges.push({ source: `ind:${ind}`, target: `role:${role}` });
        }
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

  const networkNodes = Array.from(nodeSet).map((id) => ({
    id,
    type: id.startsWith("ind:")
      ? ("industry" as const)
      : id.startsWith("role:")
        ? ("role" as const)
        : ("tag" as const),
  }));

  // Build year-month data
  const yearSet = new Set(projects.map((p) => Number(p.year)));
  const years = Array.from(yearSet).sort();
  const yearMonthData: { year: number; month: number; count: number }[] = [];
  for (const y of years) {
    for (let m = 0; m < 12; m++) {
      const key = `${y}-${m + 1}`;
      yearMonthData.push({ year: y, month: m, count: rawYearMonth[key] ?? 0 });
    }
  }

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
    yearMonthData,
    years,
    networkNodes,
    networkLinks: edges,
    stackTree,
    avgMVP,
    totalProjects: projects.length,
    uniqueIndustries: Object.keys(rawIndustry).length,
  };
}

// ─── ChartLabel ───────────────────────────────────────────────────────────────

function ChartLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body font-medium text-[10px] text-text-muted uppercase tracking-[0.1em] mb-3">
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
      <svg
        viewBox={`0 0 ${WAFFLE_SVG} ${WAFFLE_SVG}`}
        width={WAFFLE_SVG}
        height={WAFFLE_SVG}
        aria-label="Industry proportion waffle chart"
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
      <div className="grid gap-x-3 gap-y-1 mt-3" style={legendGridStyle}>
        {industryCounts.map(([industry, count]) => {
          const pct = Math.round((count / Math.max(total, 1)) * 100);
          const color = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLOR_FALLBACK;
          return (
            <div key={industry} className="flex items-center gap-1.5 min-w-0">
              <span
                className="shrink-0 inline-block"
                style={{ width: 10, height: 10, background: color }}
              />
              <span className="font-body font-normal text-[10px] text-text-muted truncate">
                {industry} {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CalendarHeatmap ──────────────────────────────────────────────────────────

function CalendarHeatmap({
  yearMonthData,
  years,
}: {
  yearMonthData: { year: number; month: number; count: number }[];
  years: number[];
}) {
  const maxCount = Math.max(...yearMonthData.map((d) => d.count), 1);

  const heatW = years.length * (HEAT_CELL + HEAT_GAP) - HEAT_GAP;
  const heatH = 12 * (HEAT_CELL + HEAT_GAP) - HEAT_GAP;

  // bins for HeatmapRect: column = year, row = month
  const bins = years.map((year) => ({
    bin: year,
    bins: yearMonthData
      .filter((d) => d.year === year)
      .sort((a, b) => a.month - b.month)
      .map((d) => ({ bin: d.month, count: d.count })),
  }));

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_PROJECT_ACTIVITY}</ChartLabel>
      <div className="overflow-x-auto">
        <svg width={heatW + 24} height={heatH + 20}>
          <g transform="translate(20, 0)">
            <HeatmapRect
              data={bins}
              xScale={(i: number) => i * (HEAT_CELL + HEAT_GAP)}
              yScale={(i: number) => i * (HEAT_CELL + HEAT_GAP)}
              colorScale={(count: number | { valueOf(): number }) => {
                const n = Number(count);
                if (n === 0) return "#1a1a1a";
                const t = n / maxCount;
                return t > 0.6
                  ? "var(--color-accent)"
                  : t > 0.3
                    ? "var(--color-accent-deep)"
                    : "#3a3a38";
              }}
              opacityScale={() => 1}
              binWidth={HEAT_CELL}
              binHeight={HEAT_CELL}
              gap={HEAT_GAP}
            >
              {(heatmap) =>
                heatmap.map((columns) =>
                  columns.map((bin) => (
                    <rect
                      key={`heat-${bin.row}-${bin.column}`}
                      x={bin.x}
                      y={bin.y}
                      width={bin.width}
                      height={bin.height}
                      fill={bin.color ?? "#1a1a1a"}
                      rx={0}
                    />
                  )),
                )
              }
            </HeatmapRect>
            {/* Year labels */}
            {years.map((year, i) => (
              <text
                key={year}
                x={i * (HEAT_CELL + HEAT_GAP) + HEAT_CELL / 2}
                y={heatH + 14}
                textAnchor="middle"
                fontSize={8}
                fontFamily="var(--font-body)"
                fill="var(--color-text-muted)"
              >
                {year}
              </text>
            ))}
          </g>
          {/* Month labels */}
          {HEAT_MONTHS.map((m, i) => (
            <text
              key={m + i}
              x={2}
              y={i * (HEAT_CELL + HEAT_GAP) + HEAT_CELL / 2 + 4}
              fontSize={7}
              fontFamily="var(--font-body)"
              fill="var(--color-text-muted)"
            >
              {m}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ─── NetworkGraph ─────────────────────────────────────────────────────────────

type NodeDatum = {
  id: string;
  type: "role" | "industry" | "tag";
  x?: number;
  y?: number;
};
type LinkDatum = { source: string; target: string };

function NetworkGraph({
  nodes: rawNodes,
  links: rawLinks,
}: {
  nodes: NodeDatum[];
  links: LinkDatum[];
}) {
  const { parentRef, width } = useParentSize({ debounceTime: 100 });
  const HEIGHT = 200;

  const [positions, setPositions] = useState<{
    nodes: { id: string; x: number; y: number; type: string }[];
    links: { x1: number; y1: number; x2: number; y2: number }[];
  } | null>(null);

  useEffect(() => {
    if (!width || rawNodes.length === 0) return;
    let isMounted = true;

    const run = async () => {
      const { forceSimulation, forceLink, forceManyBody, forceCenter } =
        await loadD3Force();
      if (!isMounted) return;

      const nodesCopy: (NodeDatum & { x: number; y: number })[] = rawNodes.map(
        (n) => ({
          ...n,
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: HEIGHT / 2 + (Math.random() - 0.5) * 100,
        }),
      );

      const nodeById = new Map(nodesCopy.map((n) => [n.id, n]));

      const linksCopy = rawLinks
        .map((l) => ({
          source: nodeById.get(l.source)!,
          target: nodeById.get(l.target)!,
        }))
        .filter((l) => l.source && l.target);

      const sim = forceSimulation(nodesCopy as never[])
        .force(
          "link",
          forceLink(linksCopy)
            .id((d: unknown) => (d as NodeDatum).id)
            .distance(40),
        )
        .force("charge", forceManyBody().strength(-60))
        .force("center", forceCenter(width / 2, HEIGHT / 2))
        .stop();

      for (let i = 0; i < 200; i++) sim.tick();

      if (!isMounted) return;

      setPositions({
        nodes: nodesCopy.map((n) => ({
          id: n.id,
          x: n.x ?? 0,
          y: n.y ?? 0,
          type: n.type,
        })),
        links: linksCopy.map((l) => ({
          x1: (l.source as { x: number }).x ?? 0,
          y1: (l.source as { y: number }).y ?? 0,
          x2: (l.target as { x: number }).x ?? 0,
          y2: (l.target as { y: number }).y ?? 0,
        })),
      });
    };

    run();
    return () => {
      isMounted = false;
    };
  }, [width, rawNodes, rawLinks]);

  const nodeColor = (type: string) =>
    type === "industry"
      ? "var(--color-accent)"
      : type === "role"
        ? "var(--color-text-primary)"
        : "var(--color-text-muted)";

  const graphLinks = positions
    ? positions.links.map((l, i) => ({
        source: { x: l.x1, y: l.y1 },
        target: { x: l.x2, y: l.y2 },
        index: i,
      }))
    : [];

  const graphNodes = positions
    ? positions.nodes.map((n, i) => ({ ...n, index: i }))
    : [];

  return (
    <div style={cellStyle}>
      <ChartLabel>{LABEL_WORK_CONNECTIONS}</ChartLabel>
      <div
        ref={parentRef as React.RefObject<HTMLDivElement>}
        style={{ height: HEIGHT, position: "relative" }}
      >
        {positions && width > 0 && (
          <svg width={width} height={HEIGHT} style={{ display: "block" }}>
            <Graph
              graph={{ nodes: graphNodes, links: graphLinks }}
              linkComponent={({
                link,
              }: {
                link: {
                  source: { x: number; y: number };
                  target: { x: number; y: number };
                };
              }) => (
                <line
                  x1={link.source.x}
                  y1={link.source.y}
                  x2={link.target.x}
                  y2={link.target.y}
                  stroke="#222220"
                  strokeWidth={1}
                />
              )}
              nodeComponent={({
                node,
              }: {
                node: { id: string; x: number; y: number; type: string };
              }) => (
                <circle
                  cx={0}
                  cy={0}
                  r={NETWORK_NODE_R}
                  fill={nodeColor(node.type)}
                  opacity={0.85}
                />
              )}
            />
          </svg>
        )}
      </div>
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
  const HEIGHT = 200;

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
        <span className="font-body font-normal text-[13px] text-text-muted block mt-2">
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
          <span className="font-body font-medium text-[11px] text-accent uppercase tracking-[0.15em]">
            {LABEL_WORK_INSIGHTS}
          </span>
          <span className="font-body font-medium text-[11px] text-text-muted">
            {isExpanded ? LABEL_HIDE : LABEL_SHOW}
          </span>
        </button>

        {/* Collapsible body */}
        <div ref={contentRef}>
          <p className="font-body font-normal text-[12px] text-text-muted mt-3 mb-6">
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
                <CalendarHeatmap
                  yearMonthData={insights.yearMonthData}
                  years={insights.years}
                />
                <NetworkGraph
                  nodes={insights.networkNodes}
                  links={insights.networkLinks}
                />
              </div>

              {/* Row 2 — treemap spans 2, stat spans 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
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
