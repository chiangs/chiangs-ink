import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ArticleFrontmatter } from "~/types/content";
import {
  AreaStack,
  AxisBottom,
  curveBasis,
  scaleLinear,
  scalePoint,
  Group,
  useParentSize,
  stackOffsetWiggle,
  stackOrderInsideOut,
  d3Stack,
  PatternLines,
  PatternCircles,
} from "~/lib/visx";

// ─── Copy ─────────────────────────────────────────────────────────────────────

const LABEL_WRITING_INSIGHTS = "WRITING INSIGHTS";
const LABEL_HIDE = "Hide ↑";
const LABEL_SHOW = "Show ↓";
const LABEL_TOPIC_FREQUENCY = "TOP 5 TOPICS";
const LABEL_TOPIC_FREQUENCY_SUB = "Most written about subjects";
const LABEL_READ_TIME = "READ TIME";
const LABEL_READ_TIME_SUB = "Minutes per article";
const LABEL_AVG_READ_TIME = "AVG. READ TIME";
const LABEL_MIN_READ = "min read";
const LABEL_NO_TAGS = "No tags found on published articles.";
const LABEL_FOCUS_OVER_TIME = "WRITING FOCUS OVER TIME";
const LABEL_FOCUS_OVER_TIME_SUB =
  "What I think about — and how that thinking shifts over time";

// ─── Style objects ────────────────────────────────────────────────────────────

const panelStyle = { paddingTop: "32px", paddingBottom: "32px" };
const cellStyle: React.CSSProperties = {
  padding: "20px",
  background: "var(--color-bg)",
};
const streamCellStyle: React.CSSProperties = {
  padding: "20px",
  background: "var(--color-bg)",
};
const avgValueStyle: React.CSSProperties = {
  fontSize: "40px",
  lineHeight: 1,
  color: "var(--color-accent)",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
};
const avgSeparatorStyle: React.CSSProperties = {
  marginTop: 20,
  paddingTop: 20,
  borderTop: "1px solid var(--color-border)",
};
const legendSwatchStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  flexShrink: 0,
};

// ─── Streamgraph constants ────────────────────────────────────────────────────

// Raw hex values are permitted here — these are D3/SVG fill attributes
// where CSS custom properties are not reliably supported.
const STREAM_COLORS = [
  "#FF9A3C", // copper — saturated
  "#00E5C7", // teal — saturated
  "#4DA6FF", // blue — saturated
  "#F472B6", // pink
  "#A78BFA", // purple
  "#34D399", // green
];

// Surface-based base/pattern colors for patterned streams (index 3+).
// Keyed by offset from index 3; last entry used for all remaining.
const STREAM_PATTERN_CONFIG = [
  { baseFill: "#2a2a2a", patternColor: "#3a3a38" }, // index 3 — surface-highest
  { baseFill: "#222220", patternColor: "#333330" }, // index 4 — border
  { baseFill: "#1e1e1e", patternColor: "#2a2a2a" }, // index 5 — hover-surface
  { baseFill: "#1a1a1a", patternColor: "#222220" }, // index 6+ — surface
] as const;
const STREAM_INNER_HEIGHT = 140;
const STREAM_AXIS_HEIGHT = 28;
const STREAM_MARGIN_TOP = 8;

// ─── Types ────────────────────────────────────────────────────────────────────

type ReadTimeBuckets = { short: number; medium: number; long: number };

type WritingInsightData = {
  tagFrequency: [string, number][];
  avgReadTime: number | null;
  readTimeBuckets: ReadTimeBuckets;
};

type StreamDatum = {
  quarter: string;
  [key: string]: string | number;
};

// ─── Data computation ─────────────────────────────────────────────────────────

function computeInsights(articles: ArticleFrontmatter[]): WritingInsightData {
  const tagMap: Record<string, number> = {};
  const readTimes: number[] = [];

  for (const a of articles) {
    a.tags?.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] ?? 0) + 1;
    });
    if (a.readTime) {
      const mins = parseInt(a.readTime, 10);
      if (!isNaN(mins)) readTimes.push(mins);
    }
  }

  const tagFrequency = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const avgReadTime =
    readTimes.length > 0
      ? Math.round(readTimes.reduce((s, n) => s + n, 0) / readTimes.length)
      : null;
  const readTimeBuckets: ReadTimeBuckets = {
    short: readTimes.filter((t) => t <= 5).length,
    medium: readTimes.filter((t) => t > 5 && t <= 10).length,
    long: readTimes.filter((t) => t > 10).length,
  };

  return { tagFrequency, avgReadTime, readTimeBuckets };
}

// ─── Streamgraph data helpers ─────────────────────────────────────────────────

function toQuarterLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const q = Math.ceil((d.getMonth() + 1) / 3);
  const yr = String(d.getFullYear()).slice(2);
  return `Q${q} '${yr}`;
}

function quarterSortKey(s: string): number {
  const m = s.match(/Q(\d) '(\d{2})/);
  if (!m) return 0;
  return (parseInt(m[2], 10) + 2000) * 10 + parseInt(m[1], 10);
}

function buildStreamData(articles: ArticleFrontmatter[]): {
  data: StreamDatum[];
  quarters: string[];
  categories: string[];
} {
  const qcMap: Record<string, Record<string, number>> = {};

  for (const a of articles) {
    const q = toQuarterLabel(a.date);
    if (!qcMap[q]) qcMap[q] = {};
    const tags = a.tags && a.tags.length > 0 ? a.tags : ["Untagged"];
    for (const tag of tags) {
      qcMap[q][tag] = (qcMap[q][tag] ?? 0) + 1;
    }
  }

  const quarters = Object.keys(qcMap).sort(
    (a, b) => quarterSortKey(a) - quarterSortKey(b),
  );

  const categoryTotals: Record<string, number> = {};
  for (const q of quarters) {
    for (const [cat, cnt] of Object.entries(qcMap[q])) {
      categoryTotals[cat] = (categoryTotals[cat] ?? 0) + cnt;
    }
  }
  const categories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  const data: StreamDatum[] = quarters.map((q) => {
    const row: StreamDatum = { quarter: q };
    for (const cat of categories) {
      row[cat] = qcMap[q][cat] ?? 0;
    }
    return row;
  });

  return { data, quarters, categories };
}

// ─── Bucket config ────────────────────────────────────────────────────────────

const READ_TIME_BUCKETS: { label: string; key: keyof ReadTimeBuckets }[] = [
  { label: "SHORT · 1–5 MIN", key: "short" },
  { label: "MEDIUM · 6–10 MIN", key: "medium" },
  { label: "LONG · 11+ MIN", key: "long" },
];

// ─── WritingStreamgraph ───────────────────────────────────────────────────────

function WritingStreamgraph({ articles }: { articles: ArticleFrontmatter[] }) {
  const { parentRef, width } = useParentSize({ debounceTime: 150 });
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);

  const { data, quarters, categories } = useMemo(
    () => buildStreamData(articles),
    [articles],
  );

  useEffect(() => {
    if (!svgRef.current || !clipRectRef.current || width === 0) return;
    let isMounted = true;
    const run = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      const paths = svgRef.current!.querySelectorAll(".stream-path");
      // Set streams to initial hidden state before animating
      gsap.set(paths, { opacity: 0, y: 6 });
      // Clip scan left→right reveals the temporal story
      gsap.fromTo(
        clipRectRef.current,
        { attr: { width: 0 } },
        { attr: { width }, duration: 1.8, ease: "power2.inOut" },
      );
      // Streams stagger-fade in as the scan passes over them
      gsap.to(paths, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.1,
      });
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [width]);

  if (quarters.length < 2 || articles.length < 4) {
    return null;
  }

  const innerWidth = width;
  const innerHeight = STREAM_INNER_HEIGHT;
  const svgHeight = STREAM_INNER_HEIGHT + STREAM_AXIS_HEIGHT + STREAM_MARGIN_TOP;

  const visibleCategories = categories.slice(0, STREAM_COLORS.length);

  const xScale = scalePoint<string>({
    domain: quarters,
    range: [0, innerWidth],
    padding: 0,
  });

  // Pre-compute stack to derive actual Y domain (wiggle produces negative values)
  const preStack = d3Stack()
    .keys(visibleCategories)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .value((d: any, key: string) => (d[key] as number) ?? 0)
    .offset(stackOffsetWiggle)
    .order(stackOrderInsideOut);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stackedSeries: any[] = preStack(data as any[]);
  let yMin = 0;
  let yMax = 0;
  for (const series of stackedSeries) {
    for (const point of series) {
      if (point[0] < yMin) yMin = point[0];
      if (point[1] > yMax) yMax = point[1];
    }
  }

  const yScale = scaleLinear<number>({
    domain: [yMin, yMax],
    range: [innerHeight, 0],
  });

  return (
    <div style={streamCellStyle}>
      <p className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] mb-1">
        {LABEL_FOCUS_OVER_TIME}
      </p>
      <p className="font-body font-normal text-sm text-text-muted mb-4">
        {LABEL_FOCUS_OVER_TIME_SUB}
      </p>

      {/* Chart */}
      <div ref={parentRef as React.RefObject<HTMLDivElement>}>
        {width > 0 && (
          <svg
            ref={svgRef}
            width={width}
            height={svgHeight}
            style={{ display: "block" }}
          >
            <defs>
              {/* Clip rect for left-to-right scan reveal */}
              <clipPath id="stream-chart-clip">
                <rect
                  ref={clipRectRef}
                  x={0}
                  y={0}
                  width={0}
                  height={STREAM_INNER_HEIGHT + STREAM_MARGIN_TOP + 4}
                />
              </clipPath>
              {/* Index 3 — loose diagonal lines */}
              {visibleCategories.length > 3 && (
                <PatternLines
                  id="stream-pattern-3"
                  height={10}
                  width={10}
                  stroke={STREAM_PATTERN_CONFIG[0].patternColor}
                  strokeWidth={1}
                  orientation={["diagonal"]}
                />
              )}
              {/* Index 4 — loose horizontal lines */}
              {visibleCategories.length > 4 && (
                <PatternLines
                  id="stream-pattern-4"
                  height={10}
                  width={10}
                  stroke={STREAM_PATTERN_CONFIG[1].patternColor}
                  strokeWidth={1}
                  orientation={["horizontal"]}
                />
              )}
              {/* Index 5+ — large spaced dots */}
              {visibleCategories.slice(5).map((_, offset) => {
                const i = offset + 5;
                const cfg = STREAM_PATTERN_CONFIG[2];
                return (
                  <PatternCircles
                    key={i}
                    id={`stream-pattern-${i}`}
                    height={14}
                    width={14}
                    fill={cfg.patternColor}
                    radius={3}
                  />
                );
              })}
            </defs>
            {/* Clipped group — scan reveals streams left→right */}
            <g clipPath="url(#stream-chart-clip)">
              <Group top={STREAM_MARGIN_TOP}>
                <AreaStack
                  data={data}
                  keys={visibleCategories}
                  x={(d) => xScale(d.data.quarter as string) ?? 0}
                  y0={(d) => yScale(d[0])}
                  y1={(d) => yScale(d[1])}
                  curve={curveBasis}
                  offset="wiggle"
                  order="insideout"
                >
                  {({ stacks, path }) => {
                    // insideout ordering rearranges stacks — resolve original
                    // category index via key so solid/patterned logic is stable
                    const getOrigIdx = (key: string) =>
                      visibleCategories.indexOf(key);

                    const patterned = stacks.filter(
                      (s) => getOrigIdx(s.key as string) >= 3,
                    );
                    const solid = stacks.filter(
                      (s) => getOrigIdx(s.key as string) < 3,
                    );

                    return (
                      <>
                        {/* Patterned streams — drawn first (bottom) */}
                        {patterned.map((stack) => {
                          const origIdx = getOrigIdx(stack.key as string);
                          const d = path(stack) ?? "";
                          const cfg =
                            STREAM_PATTERN_CONFIG[
                              Math.min(
                                origIdx - 3,
                                STREAM_PATTERN_CONFIG.length - 1,
                              )
                            ];
                          return (
                            <g key={stack.key} className="stream-path">
                              <path
                                d={d}
                                fill={cfg.baseFill}
                                fillOpacity={0.9}
                                stroke="none"
                              />
                              <path
                                d={d}
                                fill={`url(#stream-pattern-${origIdx})`}
                                fillOpacity={0.5}
                                stroke="none"
                              />
                            </g>
                          );
                        })}
                        {/* Solid streams — drawn last (top), never dimmed */}
                        {solid.map((stack) => {
                          const origIdx = getOrigIdx(stack.key as string);
                          const color = STREAM_COLORS[origIdx];
                          const d = path(stack) ?? "";
                          return (
                            <path
                              key={stack.key}
                              className="stream-path"
                              d={d}
                              fill={color}
                              fillOpacity={1}
                              stroke="none"
                            />
                          );
                        })}
                      </>
                    );
                  }}
                </AreaStack>
              </Group>
            </g>
            {/* Axis outside clip — labels always visible */}
            <Group top={STREAM_MARGIN_TOP}>
              <AxisBottom
                scale={xScale}
                top={innerHeight}
                stroke="transparent"
                tickStroke="transparent"
                tickLabelProps={() => ({
                  fill: "#737371",
                  fontSize: 11,
                  fontFamily: "Manrope, sans-serif",
                  textAnchor: "middle" as const,
                })}
              />
            </Group>
          </svg>
        )}
      </div>

      {/* Legend — below chart */}
      <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4">
        {visibleCategories.map((cat, i) => {
          const color = STREAM_COLORS[i % STREAM_COLORS.length];
          const isSolid = i < 3;
          const patternCfg = isSolid
            ? null
            : STREAM_PATTERN_CONFIG[
                Math.min(i - 3, STREAM_PATTERN_CONFIG.length - 1)
              ];
          const swatchStyle: React.CSSProperties = isSolid
            ? { ...legendSwatchStyle, background: color }
            : {
                ...legendSwatchStyle,
                background: patternCfg!.baseFill,
                outline: `1px solid ${patternCfg!.patternColor}`,
              };
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <div style={swatchStyle} />
              <span className="font-body font-normal text-xs text-text-muted">
                {cat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WritingInsightsPanel({
  articles,
}: {
  articles: ArticleFrontmatter[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 768 && contentRef.current) {
      setIsExpanded(false);
      contentRef.current.style.height = "0px";
      contentRef.current.style.overflow = "hidden";
    }
  }, []);

  const insights = useMemo(() => computeInsights(articles), [articles]);

  const handleToggle = async () => {
    if (isAnimating.current || !contentRef.current) return;
    isAnimating.current = true;
    const el = contentRef.current;
    const { default: gsap } = await import("gsap");
    if (!isExpanded) {
      setIsExpanded(true);
      gsap.to(el, {
        height: "auto",
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    } else {
      gsap.to(el, {
        height: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsExpanded(false);
          isAnimating.current = false;
        },
      });
    }
  };

  // Animate bars when panel opens
  useEffect(() => {
    if (!isExpanded || !mounted || !barContainerRef.current) return;
    let isMounted = true;
    const run = async () => {
      const { default: gsap } = await import("gsap");
      if (!isMounted) return;
      const fills =
        barContainerRef.current!.querySelectorAll<HTMLElement>(".bar-fill");
      gsap.fromTo(
        fills,
        { width: 0 },
        {
          width: (_i: number, el: Element) =>
            (el as HTMLElement).dataset.width ?? "0%",
          duration: 0.6,
          delay: 0.15,
          ease: "power2.out",
          stagger: 0.08,
        },
      );
    };
    run();
    return () => {
      isMounted = false;
    };
  }, [isExpanded, mounted]);

  const maxTagCount =
    insights.tagFrequency.length > 0 ? insights.tagFrequency[0][1] : 1;
  const maxBucketCount = Math.max(
    insights.readTimeBuckets.short,
    insights.readTimeBuckets.medium,
    insights.readTimeBuckets.long,
    1,
  );

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
            {LABEL_WRITING_INSIGHTS}
          </span>
          <span className="font-body font-medium text-sm text-text-muted">
            {isExpanded ? LABEL_HIDE : LABEL_SHOW}
          </span>
        </button>

        {/* Collapsible body */}
        <div ref={contentRef}>
          {mounted && (
            <>
              {/* Row 1 — Topic frequency + Read time */}
              <div
                ref={barContainerRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-7"
              >
                {/* Cell 1 — Tag frequency (spans 2 cols) */}
                <div className="md:col-span-2" style={cellStyle}>
                  <p className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] mb-1">
                    {LABEL_TOPIC_FREQUENCY}
                  </p>
                  <p className="font-body font-normal text-sm text-text-muted mb-4">
                    {LABEL_TOPIC_FREQUENCY_SUB}
                  </p>
                  <div className="flex flex-col gap-3">
                    {insights.tagFrequency.length === 0 ? (
                      <p className="font-body font-normal text-sm text-text-muted">
                        {LABEL_NO_TAGS}
                      </p>
                    ) : (
                      insights.tagFrequency.map(([tag, count]) => {
                        const pct = `${Math.round((count / maxTagCount) * 100)}%`;
                        return (
                          <div key={tag}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-body font-normal text-sm text-text-primary">
                                {tag}
                              </span>
                              <span className="font-body font-medium text-xs text-accent">
                                {count}
                              </span>
                            </div>
                            <div className="relative w-full h-2 bg-border">
                              <div
                                className="bar-fill absolute left-0 top-0 h-full bg-accent"
                                data-width={pct}
                                style={{ width: 0 }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Cell 2 — Read time distribution + avg (col 3) */}
                <div style={cellStyle}>
                  {/* Part A — Distribution bars */}
                  <p className="font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] mb-1">
                    {LABEL_READ_TIME}
                  </p>
                  <p className="font-body font-normal text-sm text-text-muted mb-4">
                    {LABEL_READ_TIME_SUB}
                  </p>
                  <div className="flex flex-col gap-3">
                    {READ_TIME_BUCKETS.map(({ label, key }) => {
                      const count = insights.readTimeBuckets[key];
                      const pct = `${Math.round((count / maxBucketCount) * 100)}%`;
                      return (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-body font-medium text-xs text-text-muted uppercase tracking-[0.05em]">
                              {label}
                            </span>
                            <span className="font-body font-medium text-xs text-accent">
                              {count}
                            </span>
                          </div>
                          <div className="relative w-full h-2 bg-border">
                            <div
                              className="bar-fill absolute left-0 top-0 h-full bg-accent"
                              data-width={pct}
                              style={{ width: 0 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Part B — Average read time stat */}
                  <div style={avgSeparatorStyle}>
                    <p className="font-body font-medium text-xs text-text-muted uppercase tracking-[0.1em] mb-2">
                      {LABEL_AVG_READ_TIME}
                    </p>
                    {insights.avgReadTime !== null ? (
                      <div className="flex items-baseline gap-2">
                        <span style={avgValueStyle}>{insights.avgReadTime}</span>
                        <span className="font-body font-normal text-sm text-text-muted">
                          {LABEL_MIN_READ}
                        </span>
                      </div>
                    ) : (
                      <span className="font-body font-normal text-sm text-text-muted">
                        —
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2 — Streamgraph (full width) */}
              <div className="mt-6">
                <WritingStreamgraph articles={articles} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
