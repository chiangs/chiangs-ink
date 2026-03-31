import { useEffect, useRef, useState } from "react";

// ─── Time axis constants ───────────────────────────────────────────────────────

const T_START = 18 * 60; // 18:00
const T_END = 26 * 60 + 17; // 02:17 next day
const T_RANGE = T_END - T_START; // 497 min

const T_CONV_START = 22 * 60 + 30; // 22:30 — shift handover begins
const T_ALERT = 26 * 60 + 17; // 02:17 — alert triggered

// X position helper (0–1)
const tx = (minutes: number) => (minutes - T_START) / T_RANGE;

// Pit volume data — hourly readings (bbl), index 0 = 18:00
const PIT_DATA = [
  { t: 18 * 60, v: 141 },
  { t: 19 * 60, v: 141 },
  { t: 20 * 60, v: 142 },
  { t: 21 * 60, v: 141 },
  { t: 22 * 60, v: 142 },
  { t: 22 * 60 + 30, v: 142 },
  { t: 23 * 60, v: 143 },
  { t: 24 * 60, v: 144 },
  { t: 25 * 60, v: 147 },
  { t: 25 * 60 + 30, v: 150 },
  { t: 26 * 60, v: 153 },
  { t: 26 * 60 + 17, v: 154 },
];

const PIT_THRESHOLD = 143;
const PIT_MIN = 138;
const PIT_MAX = 157;

// X axis time labels
const X_LABELS = [
  { t: 18 * 60, label: "18:00" },
  { t: 20 * 60, label: "20:00" },
  { t: 22 * 60, label: "22:00" },
  { t: 24 * 60, label: "00:00" },
  { t: 26 * 60, label: "02:00" },
];

// ─── Layout constants ─────────────────────────────────────────────────────────

const W = 600;
const ROW_H = 48;
const MINOR_ROW_H = 40;
const AXIS_H = 24;
const PAD = { top: 12, right: 116, bottom: 0, left: 110 };
const chartW = W - PAD.left - PAD.right;
const totalH = ROW_H * 3 + MINOR_ROW_H * 2 + AXIS_H + PAD.top;

// X helpers in SVG coords
const sx = (t: number) => PAD.left + tx(t) * chartW;
const convStartX = sx(T_CONV_START);
const alertX = sx(T_ALERT);
const convW = alertX - convStartX;

// Pit volume chart
const pitYScale = (v: number) =>
  PAD.top + 6 + ((PIT_MAX - v) / (PIT_MAX - PIT_MIN)) * (ROW_H - 14);
const pitPath = PIT_DATA.map(
  (d, i) => `${i === 0 ? "M" : "L"} ${sx(d.t)} ${pitYScale(d.v)}`,
).join(" ");
const pitArea =
  pitPath +
  ` L ${sx(PIT_DATA[PIT_DATA.length - 1].t)} ${PAD.top + ROW_H - 8}` +
  ` L ${sx(PIT_DATA[0].t)} ${PAD.top + ROW_H - 8} Z`;
const thresholdY = pitYScale(PIT_THRESHOLD);
const PIT_PATH_LENGTH = 500; // approximate

// Row Y positions
const ptwY = PAD.top + ROW_H + 16;
const ptwH = 14;
const pobY = PAD.top + ROW_H * 2 + 16;
const pobBarH = 12;
const minorBaseY = PAD.top + ROW_H * 3;

// ─── Row data ────────────────────────────────────────────────────────────────

const ROW_LABELS = [
  { label: "PIT VOLUME", sub: "Well 34/7-A", color: "#E24B4A", row: 0 },
  { label: "PERMIT-TO-WORK", sub: "Deck C ventilation", color: "#FFB77D", row: 1 },
  { label: "POB LIST", sub: "Morning crew change", color: "#FFB77D", row: 2 },
];

// ─── Copy strings ─────────────────────────────────────────────────────────────

const LABEL_TITLE = "FIVE SIGNALS — CONTEXT & PATTERN";
const LABEL_SHIFT_HANDOVER = "SHIFT HANDOVER WINDOW";
const LABEL_LIMIT = "LIMIT";
const LABEL_PTW_NORMAL = "IN PROGRESS";
const LABEL_PTW_STALLED = "NOT CLOSED OUT";
const LABEL_POB_NORMAL = "36 / 36 CONFIRMED";
const LABEL_POB_DECLINING = "22 / 36 — DECLINING";
const LABEL_STANDBY_VESSEL = "STANDBY VESSEL";
const LABEL_STANDBY_SUB = "ETA updated";
const LABEL_STANDBY_BAR = "ETA UPDATED — INFORMATIONAL";
const LABEL_H2S = "H2S DETECTOR";
const LABEL_H2S_SUB = "Calibration due";
const LABEL_H2S_BAR = "CALIBRATION DUE 72 HRS — SCHEDULED";
const LABEL_AI_SYNTHESIS = "AI SYNTHESIS";
const LABEL_AI_LINE1 = "Shift handover";
const LABEL_AI_LINE2 = "failure — 3 signals";
const LABEL_AI_LINE3 = "2 signals monitored";

// ─── Style objects ────────────────────────────────────────────────────────────

const containerStyle = { padding: "24px 0" };
const svgWrapperStyle = { width: "100%", background: "#131313", padding: "0 0 8px" };
const svgStyle = { display: "block", overflow: "visible" };

const transBandWidth = { transition: "width 0.6s ease" };
const transOpacity = { transition: "opacity 0.4s ease" };
const transOpacityD01 = { transition: "opacity 0.4s ease 0.1s" };
const transOpacityD02 = { transition: "opacity 0.4s ease 0.2s" };
const transOpacityD03 = { transition: "opacity 0.4s ease 0.3s" };
const transOpacityAreaD04 = { transition: "opacity 0.6s ease 0.4s" };
const transDashoffset = { transition: "stroke-dashoffset 0.9s ease 0.2s" };
const transPtwNormalWidth = { transition: "width 0.7s ease 0.3s" };
const transOpacityD06 = { transition: "opacity 0.4s ease 0.6s" };
const transPtwStalledWidth = { transition: "width 0.6s ease 0.9s" };
const transOpacityD11 = { transition: "opacity 0.4s ease 1.1s" };
const transPobFullWidth = { transition: "width 0.7s ease 0.4s" };
const transOpacityD07 = { transition: "opacity 0.4s ease 0.7s" };
const transPobDeclWidth = { transition: "width 0.6s ease 1.0s" };
const transOpacityD12 = { transition: "opacity 0.4s ease 1.2s" };
const transStandbyWidth = { transition: "width 0.5s ease 0.3s" };
const transOpacityD05 = { transition: "opacity 0.4s ease 0.5s" };
const transH2sWidth = { transition: "width 0.5s ease 0.4s" };
const transAnnotation = { transition: "opacity 0.5s ease 0.2s" };

const OBSERVER_OPTIONS = { threshold: 0.3 };

// ─── Component ────────────────────────────────────────────────────────────────

export function ShiftConvergencePattern() {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "signals" | "band" | "annotation"
  >("idle");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          observer.disconnect();
          timerRefs.current.push(setTimeout(() => setPhase("signals"), 300));
          timerRefs.current.push(setTimeout(() => setPhase("band"), 1200));
          timerRefs.current.push(
            setTimeout(() => setPhase("annotation"), 2000),
          );
        }
      },
      OBSERVER_OPTIONS,
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMounted]);

  if (!isMounted) return null;

  const signalsActive = phase !== "idle";
  const bandActive = phase === "band" || phase === "annotation";
  const annotationActive = phase === "annotation";

  return (
    <div ref={containerRef} className="w-full" style={containerStyle}>
      {/* Top label */}
      <p
        className="font-body font-medium uppercase text-center mb-8"
        style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#737371" }}
      >
        {LABEL_TITLE}
      </p>

      {/* SVG diagram — full width */}
      <div style={svgWrapperStyle}>
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${totalH}`}
          preserveAspectRatio="xMidYMid meet"
          style={svgStyle}
        >
          {/* ── Row dividers — primary ── */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={PAD.left}
              y1={PAD.top + i * ROW_H}
              x2={W - PAD.right + 8}
              y2={PAD.top + i * ROW_H}
              stroke="#1e1e1e"
              strokeWidth="1"
            />
          ))}
          {/* Minor row dividers */}
          <line
            x1={PAD.left}
            y1={minorBaseY + MINOR_ROW_H}
            x2={W - PAD.right + 8}
            y2={minorBaseY + MINOR_ROW_H}
            stroke="#222220"
            strokeWidth="1"
          />
          <line
            x1={PAD.left}
            y1={minorBaseY + MINOR_ROW_H * 2}
            x2={W - PAD.right + 8}
            y2={minorBaseY + MINOR_ROW_H * 2}
            stroke="#222220"
            strokeWidth="1"
          />

          {/* ── Convergence band — covers primary rows only ── */}
          <rect
            x={convStartX}
            y={PAD.top}
            width={bandActive ? convW : 0}
            height={ROW_H * 3}
            fill="rgba(255,183,125,0.05)"
            style={transBandWidth}
          />
          {/* Band left edge */}
          <line
            x1={convStartX}
            y1={PAD.top}
            x2={convStartX}
            y2={PAD.top + ROW_H * 3}
            stroke="rgba(255,183,125,0.25)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity={bandActive ? 1 : 0}
            style={transOpacity}
          />
          {/* Band label */}
          <text
            x={convStartX + 4}
            y={PAD.top + 11}
            fill="rgba(255,183,125,0.5)"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            letterSpacing="1"
            opacity={bandActive ? 1 : 0}
            style={transOpacityD02}
          >
            {LABEL_SHIFT_HANDOVER}
          </text>

          {/* ── Row labels ── */}
          {ROW_LABELS.map(({ label, sub, color, row }) => (
            <g key={label}>
              <text
                x={PAD.left - 8}
                y={PAD.top + row * ROW_H + 16}
                fill={color}
                fontSize="10"
                fontFamily="Manrope, sans-serif"
                fontWeight="500"
                letterSpacing="1"
                textAnchor="end"
                opacity={signalsActive ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${row * 150}ms` }}
              >
                {label}
              </text>
              <text
                x={PAD.left - 8}
                y={PAD.top + row * ROW_H + 29}
                fill="#606060"
                fontSize="9"
                fontFamily="Manrope, sans-serif"
                textAnchor="end"
                opacity={signalsActive ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${row * 150 + 100}ms` }}
              >
                {sub}
              </text>
            </g>
          ))}

          {/* ── ROW 1: Pit volume line chart ── */}
          {/* Threshold */}
          <line
            x1={PAD.left}
            y1={thresholdY}
            x2={W - PAD.right}
            y2={thresholdY}
            stroke="#E24B4A"
            strokeWidth="0.5"
            strokeDasharray="3 3"
            opacity={signalsActive ? 0.5 : 0}
            style={transOpacityD03}
          />
          <text
            x={W - PAD.right + 4}
            y={thresholdY + 3}
            fill="#E24B4A"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            opacity={signalsActive ? 0.6 : 0}
            style={transOpacity}
          >
            {LABEL_LIMIT}
          </text>
          {/* Area fill */}
          <path
            d={pitArea}
            fill="rgba(226,75,74,0.06)"
            opacity={signalsActive ? 1 : 0}
            style={transOpacityAreaD04}
          />
          {/* Line — draws in via dashoffset */}
          <path
            d={pitPath}
            fill="none"
            stroke="#E24B4A"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={PIT_PATH_LENGTH}
            strokeDashoffset={signalsActive ? 0 : PIT_PATH_LENGTH}
            style={transDashoffset}
          />

          {/* ── ROW 2: PTW status bar ── */}
          {/* Normal state bar */}
          <rect
            x={PAD.left}
            y={ptwY}
            width={signalsActive ? convStartX - PAD.left : 0}
            height={ptwH}
            fill="rgba(52,211,153,0.15)"
            rx="1"
            style={transPtwNormalWidth}
          />
          <text
            x={PAD.left + 6}
            y={ptwY + 11}
            fill="#34D399"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={signalsActive ? 0.8 : 0}
            style={transOpacityD06}
          >
            {LABEL_PTW_NORMAL}
          </text>
          {/* Stalled state bar */}
          <rect
            x={convStartX}
            y={ptwY}
            width={signalsActive ? alertX - convStartX : 0}
            height={ptwH}
            fill="rgba(226,75,74,0.15)"
            rx="1"
            style={transPtwStalledWidth}
          />
          <text
            x={convStartX + 6}
            y={ptwY + 11}
            fill="#E24B4A"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={signalsActive ? 0.8 : 0}
            style={transOpacityD11}
          >
            {LABEL_PTW_STALLED}
          </text>

          {/* ── ROW 3: POB declining count ── */}
          {/* Full bar (normal) */}
          <rect
            x={PAD.left}
            y={pobY}
            width={signalsActive ? convStartX - PAD.left : 0}
            height={pobBarH}
            fill="rgba(52,211,153,0.12)"
            rx="1"
            style={transPobFullWidth}
          />
          <text
            x={PAD.left + 6}
            y={pobY + 10}
            fill="#34D399"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={signalsActive ? 0.8 : 0}
            style={transOpacityD07}
          >
            {LABEL_POB_NORMAL}
          </text>
          {/* Declining bar */}
          <rect
            x={convStartX}
            y={pobY}
            width={signalsActive ? alertX - convStartX : 0}
            height={pobBarH}
            fill="rgba(255,183,125,0.12)"
            rx="1"
            style={transPobDeclWidth}
          />
          <text
            x={convStartX + 6}
            y={pobY + 10}
            fill="#FFB77D"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={signalsActive ? 0.8 : 0}
            style={transOpacityD12}
          >
            {LABEL_POB_DECLINING}
          </text>

          {/* ── MINOR ROW 1: Standby vessel ETA ── */}
          <text
            x={PAD.left - 8}
            y={minorBaseY + 16}
            fill="#8a8a88"
            fontSize="10"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            letterSpacing="1"
            textAnchor="end"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD01}
          >
            {LABEL_STANDBY_VESSEL}
          </text>
          <text
            x={PAD.left - 8}
            y={minorBaseY + 28}
            fill="#606060"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            textAnchor="end"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD02}
          >
            {LABEL_STANDBY_SUB}
          </text>
          {/* Flat informational bar */}
          <rect
            x={PAD.left}
            y={minorBaseY + 12}
            width={annotationActive ? chartW : 0}
            height={14}
            fill="rgba(115,115,113,0.18)"
            rx="1"
            style={transStandbyWidth}
          />
          <text
            x={PAD.left + 6}
            y={minorBaseY + 23}
            fill="#8a8a88"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD05}
          >
            {LABEL_STANDBY_BAR}
          </text>

          {/* ── MINOR ROW 2: H2S calibration ── */}
          <text
            x={PAD.left - 8}
            y={minorBaseY + MINOR_ROW_H + 16}
            fill="#8a8a88"
            fontSize="10"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            letterSpacing="1"
            textAnchor="end"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD02}
          >
            {LABEL_H2S}
          </text>
          <text
            x={PAD.left - 8}
            y={minorBaseY + MINOR_ROW_H + 28}
            fill="#606060"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            textAnchor="end"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD03}
          >
            {LABEL_H2S_SUB}
          </text>
          {/* Flat scheduled bar */}
          <rect
            x={PAD.left}
            y={minorBaseY + MINOR_ROW_H + 12}
            width={annotationActive ? chartW : 0}
            height={14}
            fill="rgba(115,115,113,0.18)"
            rx="1"
            style={transH2sWidth}
          />
          <text
            x={PAD.left + 6}
            y={minorBaseY + MINOR_ROW_H + 23}
            fill="#8a8a88"
            fontSize="9"
            fontFamily="Manrope, sans-serif"
            fontWeight="500"
            opacity={annotationActive ? 1 : 0}
            style={transOpacityD06}
          >
            {LABEL_H2S_BAR}
          </text>

          {/* ── X axis — below minor rows ── */}
          <line
            x1={PAD.left}
            y1={minorBaseY + MINOR_ROW_H * 2}
            x2={W - PAD.right}
            y2={minorBaseY + MINOR_ROW_H * 2}
            stroke="#3a3a38"
            strokeWidth="1"
          />
          {X_LABELS.map(({ t, label }) => (
            <g key={label}>
              <line
                x1={sx(t)}
                y1={minorBaseY + MINOR_ROW_H * 2}
                x2={sx(t)}
                y2={minorBaseY + MINOR_ROW_H * 2 + 4}
                stroke="#3a3a38"
                strokeWidth="1"
              />
              <text
                x={sx(t)}
                y={minorBaseY + MINOR_ROW_H * 2 + 15}
                fill="#737371"
                fontSize="10"
                fontFamily="Manrope, sans-serif"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          ))}

          {/* ── AI annotation ── */}
          {/* Vertical alert line — extends through all rows */}
          <line
            x1={alertX}
            y1={PAD.top}
            x2={alertX}
            y2={minorBaseY + MINOR_ROW_H * 2}
            stroke="#FFB77D"
            strokeWidth="1"
            opacity={annotationActive ? 0.6 : 0}
            style={transOpacity}
          />
          {/* Annotation box — spans all rows */}
          <g
            opacity={annotationActive ? 1 : 0}
            style={transAnnotation}
          >
            <rect
              x={alertX + 6}
              y={PAD.top + 50}
              width={104}
              height={66}
              fill="#1a1a1a"
              stroke="#FFB77D"
              strokeWidth="1"
            />
            <text
              x={alertX + 12}
              y={PAD.top + 63}
              fill="#FFB77D"
              fontSize="9"
              fontFamily="Manrope, sans-serif"
              fontWeight="500"
              letterSpacing="1"
            >
              {LABEL_AI_SYNTHESIS}
            </text>
            <text
              x={alertX + 12}
              y={PAD.top + 76}
              fill="#E5E2E1"
              fontSize="10"
              fontFamily="Manrope, sans-serif"
            >
              {LABEL_AI_LINE1}
            </text>
            <text
              x={alertX + 12}
              y={PAD.top + 89}
              fill="#E5E2E1"
              fontSize="10"
              fontFamily="Manrope, sans-serif"
            >
              {LABEL_AI_LINE2}
            </text>
            {/* Divider */}
            <line
              x1={alertX + 10}
              y1={PAD.top + 96}
              x2={alertX + 104}
              y2={PAD.top + 96}
              stroke="#2a2a2a"
              strokeWidth="0.5"
            />
            <text
              x={alertX + 12}
              y={PAD.top + 107}
              fill="#606060"
              fontSize="9"
              fontFamily="Manrope, sans-serif"
            >
              {LABEL_AI_LINE3}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
