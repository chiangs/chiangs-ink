import { memo, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type DemoState = "briefing" | "expanding" | "tapping" | "chart";
type SpotlightTarget = "item1" | "actions" | "drilldown" | "chart" | null;
type PulsedButton = "primary" | "secondary" | null;

// ─── Constants ───────────────────────────────────────────────────────────────

const GREETING = "Good morning, Tor.";
const TIMESTAMP = "02:17 — North Sea";
const NOMINAL_NOTE = "Platform Bravo is nominal.";

const ITEMS = [
  {
    id: 1,
    status: "CRITICAL",
    title: "Pit volume gain — Well 34/7-A",
    summary:
      "Mud logger flagged a 12-barrel gain over three hours. Flow check completed — well showing slow bleed.",
    detail: [
      { label: "Current pit volume", value: "+12 bbl above baseline" },
      { label: "Gain rate", value: "~4 bbl / hr sustained" },
      { label: "Flow check", value: "Slow bleed confirmed" },
    ],
    action: "View pit volume trend",
    primaryAction: "Initiate well shut-in",
    secondaryAction: "Escalate to drilling supervisor",
    hasChart: true,
  },
  {
    id: 2,
    status: "ACTION REQUIRED",
    title: "Open permit-to-work",
    summary:
      "Evening shift permit on Deck C ventilation work not closed out. Crew change handover blocked.",
    detail: [
      { label: "Permit ref", value: "PTW-2024-0317-C" },
      { label: "Issued to", value: "Maintenance — evening shift" },
      { label: "Status", value: "Not closed out" },
    ],
    action: "View permit details",
    primaryAction: "Close out permit",
    secondaryAction: "Contact shift supervisor",
    hasChart: false,
  },
  {
    id: 3,
    status: "TIME-SENSITIVE",
    title: "POB list incomplete",
    summary:
      "14 of 36 crew change departures unconfirmed. Helicopter window opens at 06:00.",
    detail: [
      { label: "Confirmed", value: "22 of 36" },
      { label: "Outstanding", value: "14 confirmations" },
      { label: "Window opens", value: "06:00 — 3 hrs 43 min" },
    ],
    action: "View manifest",
    primaryAction: "Send confirmation request",
    secondaryAction: "Contact logistics",
    hasChart: false,
  },
];

// Chart data — 24hr pit volume readings (barrels), one per hour
const CHART_DATA = [
  142, 141, 143, 142, 141, 142, 143, 142, 141, 142, 143, 142, 141, 142, 143,
  144, 145, 147, 149, 152, 154, 155, 154, 154,
];
const CHART_THRESHOLD = 143;
const CHART_HOURS = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`,
);

// ─── Status colour helper ─────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  CRITICAL: "text-[#E24B4A]",
  "ACTION REQUIRED": "text-text-muted",
  "TIME-SENSITIVE": "text-accent",
};

// ─── Smooth scroll helper ─────────────────────────────────────────────────────

function smoothScrollTo(
  container: HTMLElement,
  targetTop: number,
  duration = 400,
) {
  const start = container.scrollTop;
  const distance = targetTop - start;
  const startTime = performance.now();
  const animate = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    container.scrollTop = start + distance * ease;
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

// ─── Inline SVG chart ─────────────────────────────────────────────────────────

const PitVolumeChart = memo(function PitVolumeChart() {
  const W = 320;
  const H = 140;
  const PAD = { top: 12, right: 20, bottom: 28, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const minVal = 138;
  const maxVal = 158;
  const range = maxVal - minVal;
  const xStep = chartW / (CHART_DATA.length - 1);
  const yScale = (v: number) => chartH - ((v - minVal) / range) * chartH;
  const linePath = CHART_DATA.map(
    (v, i) =>
      `${i === 0 ? "M" : "L"} ${PAD.left + i * xStep} ${PAD.top + yScale(v)}`,
  ).join(" ");
  const areaPath =
    linePath +
    ` L ${PAD.left + (CHART_DATA.length - 1) * xStep} ${PAD.top + chartH}` +
    ` L ${PAD.left} ${PAD.top + chartH} Z`;
  const varStartX = PAD.left + 15 * xStep;
  const varEndX = PAD.left + (CHART_DATA.length - 1) * xStep;
  const thresholdY = PAD.top + yScale(CHART_THRESHOLD);
  const xLabels = [0, 6, 12, 18, 23];
  const yLabels = [140, 145, 150, 155];

  return (
    <div className="w-full">
      <p className="font-body text-[10px] uppercase tracking-[0.15em] text-text-muted mb-2">
        PIT VOLUME — LAST 24 HRS // WELL 34/7-A
      </p>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <rect
          x={varStartX}
          y={PAD.top}
          width={varEndX - varStartX}
          height={chartH}
          fill="rgba(226,75,74,0.10)"
        />
        <line
          x1={PAD.left}
          y1={thresholdY}
          x2={PAD.left + chartW}
          y2={thresholdY}
          stroke="#E24B4A"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.7"
        />
        <text
          x={PAD.left + chartW + 4}
          y={thresholdY + 4}
          fill="#E24B4A"
          fontSize="8"
          fontFamily="Manrope, sans-serif"
          opacity="0.7"
        >
          LIMIT
        </text>
        <path d={areaPath} fill="rgba(255,183,125,0.06)" />
        <path
          d={linePath}
          fill="none"
          stroke="#FFB77D"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {yLabels.map((v) => (
          <text
            key={v}
            x={PAD.left - 4}
            y={PAD.top + yScale(v) + 3}
            fill="#737371"
            fontSize="8"
            fontFamily="Manrope, sans-serif"
            textAnchor="end"
          >
            {v}
          </text>
        ))}
        {xLabels.map((i) => (
          <text
            key={i}
            x={PAD.left + i * xStep}
            y={H - 6}
            fill="#737371"
            fontSize="8"
            fontFamily="Manrope, sans-serif"
            textAnchor="middle"
          >
            {CHART_HOURS[i]}
          </text>
        ))}
        <text
          x={PAD.left - 28}
          y={PAD.top + chartH / 2}
          fill="#737371"
          fontSize="7"
          fontFamily="Manrope, sans-serif"
          textAnchor="middle"
          transform={`rotate(-90, ${PAD.left - 28}, ${PAD.top + chartH / 2})`}
        >
          BBL
        </text>
        <text
          x={varStartX + (varEndX - varStartX) / 2}
          y={PAD.top + 10}
          fill="#E24B4A"
          fontSize="7"
          fontFamily="Manrope, sans-serif"
          textAnchor="middle"
          opacity="0.8"
        >
          ANOMALOUS GAIN
        </text>
      </svg>
      <p className="font-body text-[10px] text-text-muted mt-1 italic">
        Normal operating threshold: 143 bbl. Gain rate sustained 3 hrs+.
      </p>
    </div>
  );
});

// ─── Phone frame wrapper ──────────────────────────────────────────────────────

function PhoneFrame({
  children,
  scrollRef,
}: {
  children: React.ReactNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      <div
        className="relative bg-[#0a0a0a] border border-[#2a2a2a]"
        style={{
          borderRadius: 36,
          padding: "12px 6px",
          boxShadow:
            "0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="mx-auto bg-[#0a0a0a] mb-2 relative z-10"
          style={{
            width: 80,
            height: 20,
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 1px 0 #2a2a2a",
          }}
        />
        <div
          ref={scrollRef}
          className="bg-bg relative"
          style={{
            borderRadius: 24,
            height: 520,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
        <div
          className="mx-auto mt-2 bg-[#3a3a3a]"
          style={{ width: 80, height: 4, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}

// ─── Briefing screen ──────────────────────────────────────────────────────────

function BriefingScreen({
  expandedId,
  showChart,
  showTap,
  spotlightTarget,
  pulsedButton,
  actionsRefGlobal,
  scrollRef,
  isPlaying,
  onToggleItem,
  onToggleChart,
}: {
  expandedId: number | null;
  showChart: boolean;
  showTap: boolean;
  spotlightTarget: SpotlightTarget;
  pulsedButton: PulsedButton;
  actionsRefGlobal: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  onToggleItem: (id: number) => void;
  onToggleChart: () => void;
}) {
  const item1Ref = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const drilldownRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  // Scroll to item 1 when it expands
  useEffect(() => {
    if (expandedId === 1 && scrollRef.current && item1Ref.current) {
      smoothScrollTo(
        scrollRef.current,
        Math.max(0, item1Ref.current.offsetTop - 16),
      );
    }
    if (expandedId === null && scrollRef.current) {
      smoothScrollTo(scrollRef.current, 0);
    }
  }, [expandedId, scrollRef]);

  // Scroll to chart when it reveals — scrollIntoView handles nested containers correctly
  useEffect(() => {
    if (!showChart) return;
    const id = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 800);
    return () => clearTimeout(id);
  }, [showChart]);

  // Spotlight helpers — which elements are active vs dimmed
  const guideActive = spotlightTarget !== null;
  const isActive = (target: SpotlightTarget) => spotlightTarget === target;
  const ringStyle = (target: SpotlightTarget): React.CSSProperties => ({
    transition: "box-shadow 0.4s ease, opacity 0.4s ease",
    boxShadow: isActive(target)
      ? "0 0 0 2px #FFB77D, 0 0 16px rgba(255,183,125,0.25)"
      : "none",
    opacity: guideActive && !isActive(target) ? 0.25 : 1,
  });

  return (
    <div className="bg-bg p-5">
      {/* Header — dims when guide is active */}
      <div
        className="mb-5"
        style={{
          transition: "opacity 0.4s ease",
          opacity: guideActive ? 0.25 : 1,
        }}
      >
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-text-muted mb-1">
          {TIMESTAMP}
        </p>
        <p className="font-display font-bold text-base text-text-primary leading-tight">
          {GREETING}
        </p>
        <p className="font-body text-[11px] text-text-muted mt-0.5">
          {NOMINAL_NOTE}
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {ITEMS.map((item) => {
          const isExpanded = expandedId === item.id;
          // During guide: dim non-item1 rows; outside guide: dim non-expanded rows as before
          const itemDimmed = guideActive
            ? item.id !== 1
            : expandedId !== null && !isExpanded;

          return (
            <div
              key={item.id}
              ref={item.id === 1 ? item1Ref : undefined}
              className="bg-surface border-l-2 p-3"
              style={{
                borderColor:
                  item.status === "CRITICAL"
                    ? "#E24B4A"
                    : item.status === "TIME-SENSITIVE"
                      ? "#FFB77D"
                      : "#737371",
                transition: "box-shadow 0.4s ease, opacity 0.4s ease",
                boxShadow:
                  isActive("item1") && item.id === 1
                    ? "0 0 0 2px #FFB77D, 0 0 16px rgba(255,183,125,0.25)"
                    : "none",
                opacity: itemDimmed ? 0.25 : 1,
                cursor: !isPlaying ? "pointer" : "default",
              }}
              onClick={!isPlaying ? () => onToggleItem(item.id) : undefined}
            >
              <span
                className={`font-body text-[9px] uppercase tracking-[0.12em] font-medium whitespace-nowrap ${STATUS_STYLES[item.status] ?? "text-text-muted"}`}
              >
                {item.status}
              </span>
              <p className="font-display font-bold text-[13px] text-text-primary leading-tight mt-1 mb-1">
                {item.title}
              </p>
              <p className="font-body text-[11px] text-text-muted leading-relaxed">
                {item.summary}
              </p>

              {/* Expanded detail */}
              <div
                className="overflow-hidden transition-all duration-500"
                style={{
                  maxHeight: isExpanded ? 700 : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="mt-3 pt-3 border-t border-border">
                  {/* Data rows */}
                  {item.detail.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-start gap-3 mb-1.5"
                    >
                      <span className="font-body text-[10px] text-text-muted uppercase tracking-[0.1em] flex-1">
                        {d.label}
                      </span>
                      <span
                        className="font-body text-[11px] text-text-primary font-medium text-right"
                        style={{ flexShrink: 0, maxWidth: "55%" }}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}

                  {/* Action buttons — pulse sequentially when spotlit */}
                  <div
                    ref={(el) => {
                      if (item.id === 1) {
                        (
                          actionsRef as React.MutableRefObject<HTMLDivElement | null>
                        ).current = el;
                        (
                          actionsRefGlobal as React.MutableRefObject<HTMLDivElement | null>
                        ).current = el;
                      }
                    }}
                    className="mt-4 pt-3 border-t border-border flex flex-col gap-2"
                  >
                    {/* Primary action — focused state: copper outline, full opacity */}
                    <div
                      className="w-full p-2.5 text-center font-body text-[11px] font-medium uppercase tracking-[0.1em]"
                      style={{
                        background: "linear-gradient(135deg, #FFB77D, #D97707)",
                        color: "#0c0c0c",
                        outline:
                          pulsedButton === "primary"
                            ? "2px solid #FFB77D"
                            : "2px solid transparent",
                        outlineOffset: "2px",
                        opacity: pulsedButton === "secondary" ? 0.25 : 1,
                        transition: "outline 0.3s ease, opacity 0.3s ease",
                      }}
                    >
                      {item.primaryAction}
                    </div>
                    {/* Secondary action — focused state: copper border + text, full opacity */}
                    <div
                      className="w-full p-2.5 text-center font-body text-[11px] font-medium uppercase tracking-[0.1em]"
                      style={{
                        border:
                          pulsedButton === "secondary"
                            ? "2px solid #FFB77D"
                            : "2px solid #737371",
                        color:
                          pulsedButton === "secondary" ? "#FFB77D" : "#737371",
                        opacity: pulsedButton === "primary" ? 0.25 : 1,
                        transition:
                          "border 0.3s ease, color 0.3s ease, opacity 0.3s ease",
                      }}
                    >
                      {item.secondaryAction}
                    </div>
                  </div>

                  {/* Drill-down link — pulses and grows when spotlit, tappable in interactive mode */}
                  {item.hasChart && (
                    <div
                      ref={drilldownRef}
                      className="mt-3 pt-2"
                      style={{
                        ...ringStyle("drilldown"),
                        cursor: !isPlaying ? "pointer" : "default",
                      }}
                      onClick={
                        !isPlaying
                          ? (e) => {
                              e.stopPropagation();
                              onToggleChart();
                            }
                          : undefined
                      }
                    >
                      <span
                        className="font-body font-medium transition-all duration-300"
                        style={{
                          color: showTap ? "#FFB77D" : "#737371",
                          fontSize: isActive("drilldown") ? "13px" : "11px",
                          display: "inline-block",
                          animation: isActive("drilldown")
                            ? "drilldown-pulse 1.2s ease-in-out infinite"
                            : "none",
                        }}
                      >
                        ↓ {item.action}
                      </span>
                    </div>
                  )}

                  {/* Chart — copper ring when spotlit */}
                  {item.hasChart && (
                    <div
                      className="overflow-hidden transition-all duration-700"
                      style={{
                        maxHeight: showChart ? 240 : 0,
                        opacity: showChart ? 1 : 0,
                      }}
                    >
                      <div
                        ref={chartRef}
                        className="mt-3 pt-3 border-t border-border"
                        style={ringStyle("chart")}
                      >
                        <PitVolumeChart />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsed action hint */}
              {!isExpanded && (
                <p className="font-body text-[10px] text-accent mt-1.5">
                  → {item.action}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MobileBriefingDemo() {
  const [demoState, setDemoState] = useState<DemoState>("briefing");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [showTap, setShowTap] = useState(false);
  const [spotlightTarget, setSpotlightTarget] = useState<SpotlightTarget>(null);
  const [pulsedButton, setPulsedButton] = useState<PulsedButton>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const actionsRefGlobal = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Inject keyframes for pulse animations
    const style = document.createElement("style");
    style.id = "briefing-demo-styles";
    style.textContent = `
      @keyframes drilldown-pulse {
        0%, 100% { color: #737371; opacity: 1; }
        50% { color: #FFB77D; opacity: 0.85; }
      }
    `;
    if (!document.getElementById("briefing-demo-styles")) {
      document.head.appendChild(style);
    }
    return () => {
      setIsMounted(false);
      const el = document.getElementById("briefing-demo-styles");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !isPlaying) return;

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        timerRefs.current.delete(id);
        fn();
      }, delay);
      timerRefs.current.add(id);
    };

    const runLoop = () => {
      // State 1 — full brightness, no spotlight, 4s scan time
      setDemoState("briefing");
      setExpandedId(null);
      setShowChart(false);
      setShowTap(false);
      setSpotlightTarget(null);
      setPulsedButton(null);

      // After 4s — spotlight item 1 for 2s
      schedule(() => {
        setSpotlightTarget("item1");

        schedule(() => {
          // State 2 — expand item 1, spotlight moves to actions after expand
          setDemoState("expanding");
          setExpandedId(1);
          schedule(() => setSpotlightTarget("actions"), 800);

          // Pulse primary button first
          schedule(() => {
            setPulsedButton("primary");
            // Then pulse secondary button
            schedule(() => {
              setPulsedButton("secondary");
              // Then clear and move to drilldown
              schedule(() => {
                setPulsedButton(null);
                // State 3 — spotlight moves to drill-down link, pulse for 2s
                setDemoState("tapping");
                setSpotlightTarget("drilldown");
                setShowTap(true);

                schedule(() => {
                  // State 4 — chart reveals, spotlight moves to chart after scroll
                  setDemoState("chart");
                  setShowTap(false);
                  setShowChart(true);
                  schedule(() => setSpotlightTarget("chart"), 1000);

                  schedule(() => {
                    // State 5 — return to actions: scroll back up, re-spotlight buttons
                    setSpotlightTarget("actions");
                    // Scroll back up to actions
                    if (scrollRef.current && actionsRefGlobal.current) {
                      actionsRefGlobal.current.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }

                    // Re-pulse primary then secondary
                    schedule(() => {
                      setPulsedButton("primary");
                      schedule(() => {
                        setPulsedButton("secondary");
                        schedule(() => {
                          // Reset instantly — no fade
                          runLoop();
                        }, 1200);
                      }, 1200);
                    }, 400);
                  }, 7000);
                }, 2000);
              }, 1000);
            }, 1000);
          }, 1200); // start pulsing buttons 1.2s after expand (gives expand animation time)
        }, 2000);
      }, 4000);
    };

    runLoop();

    return () => {
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current.clear();
    };
  }, [isMounted, isPlaying]);

  const handleToggle = () => {
    if (isPlaying) {
      // Pause — stop timers and reset to clean briefing state
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current.clear();
      setDemoState("briefing");
      setExpandedId(null);
      setShowChart(false);
      setShowTap(false);
      setSpotlightTarget(null);
      setPulsedButton(null);
      setIsPlaying(false);
    } else {
      // Resume — restart loop from beginning
      setIsPlaying(true);
    }
  };

  if (!isMounted) return null;

  const handleToggleItem = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (id !== 1) setShowChart(false);
  };

  const handleToggleChart = () => {
    setShowChart((prev) => !prev);
  };

  const screen = (
    <div>
      <BriefingScreen
        expandedId={expandedId}
        showChart={showChart}
        showTap={showTap}
        spotlightTarget={spotlightTarget}
        pulsedButton={pulsedButton}
        actionsRefGlobal={actionsRefGlobal}
        scrollRef={scrollRef}
        isPlaying={isPlaying}
        onToggleItem={handleToggleItem}
        onToggleChart={handleToggleChart}
      />
    </div>
  );

  return (
    <div className="w-full py-8">
      <p className="font-body text-[10px] uppercase tracking-[0.15em] text-text-muted mb-6 text-center">
        AI BRIEFING LAYER // LOOPING DEMO
      </p>

      {/* Desktop — phone frame */}
      <div className="hidden md:block">
        <PhoneFrame scrollRef={scrollRef}>{screen}</PhoneFrame>
      </div>

      {/* Mobile — UI only, fixed height scroll */}
      <div
        ref={scrollRef}
        className="md:hidden max-w-[390px] mx-auto bg-bg border border-border relative"
        style={{ height: 520, overflowY: "auto", overflowX: "hidden" }}
      >
        {screen}
      </div>

      {/* State indicator — hidden in interactive mode */}
      {isPlaying && (
        <div className="flex justify-center gap-2 mt-6">
          {(["briefing", "expanding", "tapping", "chart"] as const).map((s) => (
            <div
              key={s}
              className="transition-all duration-300"
              style={{
                width: demoState === s ? 20 : 6,
                height: 2,
                background: demoState === s ? "#FFB77D" : "#2a2a2a",
              }}
            />
          ))}
        </div>
      )}

      {/* Toggle button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleToggle}
          className="font-body font-medium uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: isPlaying ? "#737371" : "#FFB77D",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px 0",
            transition: "color 0.2s ease",
          }}
        >
          {isPlaying ? "▐▐  PAUSE & INTERACT" : "▶  START DEMO"}
        </button>
      </div>
    </div>
  );
}
