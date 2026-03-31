import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "~/components/common/PhoneFrame";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "ai";
  text: string;
  delay: number;
  hasActions?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MESSAGES: Message[] = [
  {
    role: "user",
    text: "Why did you group these three alerts together?",
    delay: 0,
  },
  {
    role: "ai",
    text: "All three degraded during the same shift handover window — between 22:30 and 02:17. Individually, none would have triggered a priority alert. Together, they indicate the evening shift closed without completing its handover obligations. The pit volume gain is the most time-critical, but the open permit and the incomplete POB list suggest the wider handover was disrupted, not just one item.",
    delay: 1000,
  },
  {
    role: "user",
    text: "What was the last shift report filed?",
    delay: 9200,
  },
  {
    role: "ai",
    text: "No shift report was filed by the evening toolpusher. The previous entry is from 18:45 — the start of the evening shift. This is consistent with the open permit-to-work: standard procedure requires permit closeout before the shift report can be submitted.",
    delay: 10200,
  },
  {
    role: "ai",
    text: "Given the incomplete handover, I'd recommend confirming the shut-in decision on Well 34/7-A before the 06:00 crew change. Do you want me to flag the incoming OIM?",
    delay: 13800,
    hasActions: true,
  },
];

const TYPING_DURATION = 1300;
// Chip pulse at: last message reveal + 2s
const CHIP_PULSE_DELAY = 13800 + TYPING_DURATION + 2000;
// Chip tap at: chip pulse + 1.5s
const CHIP_TAP_DELAY = CHIP_PULSE_DELAY + 1500;
// Confirmation at: chip tap + 0.6s
const CONFIRM_DELAY = CHIP_TAP_DELAY + 600;
// Loop reset: confirmation + 3s hold
const LOOP_RESET_DELAY = CONFIRM_DELAY + 3000;

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1" style={{ padding: "8px 12px" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#737371",
            animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BriefingConversation() {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingFor, setTypingFor] = useState<number | null>(null);
  const [chipState, setChipState] = useState<
    "idle" | "pulsing" | "tapped" | "confirmed"
  >("idle");
  const [runKey, setRunKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    const style = document.createElement("style");
    style.id = "conversation-styles";
    style.textContent = `
      @keyframes typing-dot {
        0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
        30% { opacity: 1; transform: translateY(-2px); }
      }
      @keyframes message-fade-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes chip-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255,183,125,0); }
        50% { box-shadow: 0 0 0 3px rgba(255,183,125,0.35); }
      }
    `;
    if (!document.getElementById("conversation-styles")) {
      document.head.appendChild(style);
    }
    return () => {
      setIsMounted(false);
      const el = document.getElementById("conversation-styles");
      if (el) el.remove();
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current || hasStarted.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasStarted.current = true;
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isMounted]);

  const runAnimation = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    setVisibleMessages([]);
    setTypingFor(null);
    setChipState("idle");

    MESSAGES.forEach((msg, i) => {
      if (msg.role === "ai") {
        const typingTimer = setTimeout(() => setTypingFor(i), msg.delay);
        timerRefs.current.push(typingTimer);

        const revealTimer = setTimeout(() => {
          setTypingFor(null);
          setVisibleMessages((prev) => [...prev, i]);
        }, msg.delay + TYPING_DURATION);
        timerRefs.current.push(revealTimer);
      } else {
        const revealTimer = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, i]);
        }, msg.delay);
        timerRefs.current.push(revealTimer);
      }
    });

    // Chip interaction sequence
    timerRefs.current.push(
      setTimeout(() => setChipState("pulsing"), CHIP_PULSE_DELAY),
    );
    timerRefs.current.push(
      setTimeout(() => setChipState("tapped"), CHIP_TAP_DELAY),
    );
    timerRefs.current.push(
      setTimeout(() => setChipState("confirmed"), CONFIRM_DELAY),
    );
    timerRefs.current.push(
      setTimeout(() => setRunKey((k) => k + 1), LOOP_RESET_DELAY),
    );
  };

  useEffect(() => {
    if (runKey === 0 || !hasStarted.current) return;
    runAnimation();
  }, [runKey]);

  if (!isMounted) return null;

  const content = (
    <div
      style={{
        background: "#131313",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #222220",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="font-body font-medium uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#737371" }}
        >
          OIM — BRIEFING ASSISTANT
        </span>
        <span
          className="font-body font-medium uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.12em", color: "#34D399" }}
        >
          ● LIVE
        </span>
      </div>

      {/* Message thread */}
      <div
        style={{
          flex: 1,
          overflowY: "hidden",
          overflowX: "hidden",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "flex-start",
          gap: 12,
        }}
      >
        {/* Typing indicator */}
        {typingFor !== null && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                background: "#1a1a1a",
                borderLeft: "2px solid #2a2a2a",
                maxWidth: "85%",
              }}
            >
              <TypingIndicator />
            </div>
          </div>
        )}

        {/* Visible messages — reversed so newest is at visual bottom */}
        {[...visibleMessages].reverse().map((i) => {
          const msg = MESSAGES[i];
          const isUser = msg.role === "user";

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                animation: "message-fade-in 0.4s ease",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  background: isUser ? "#1e1e1e" : "#1a1a1a",
                  borderLeft: isUser ? "none" : "2px solid #FFB77D",
                  borderRight: isUser ? "2px solid #2a2a2a" : "none",
                  padding: "10px 12px",
                }}
              >
                {!isUser && (
                  <p
                    className="font-body font-medium uppercase"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "#FFB77D",
                      margin: "0 0 6px",
                    }}
                  >
                    Briefing AI
                  </p>
                )}
                {isUser && (
                  <p
                    className="font-body font-medium uppercase"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "#737371",
                      margin: "0 0 6px",
                      textAlign: "right",
                    }}
                  >
                    OIM — Tor H.
                  </p>
                )}
                <p
                  className="font-body"
                  style={{
                    fontSize: "12px",
                    color: "#E5E2E1",
                    lineHeight: 1.65,
                    margin: 0,
                    textAlign: isUser ? "right" : "left",
                  }}
                >
                  {msg.text}
                </p>

                {/* Action chips — only on message 4 */}
                {msg.hasActions && chipState !== "confirmed" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginTop: 10,
                    }}
                  >
                    {/* Primary chip */}
                    <div
                      style={{
                        padding: "7px 10px",
                        background:
                          chipState === "tapped"
                            ? "linear-gradient(135deg, #FFB77D, #D97707)"
                            : "transparent",
                        border: "1px solid #FFB77D",
                        color: chipState === "tapped" ? "#131313" : "#FFB77D",
                        fontSize: "10px",
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        transition: "background 0.3s ease, color 0.3s ease",
                        animation:
                          chipState === "pulsing"
                            ? "chip-pulse 0.8s ease-in-out infinite"
                            : "none",
                        cursor: "default",
                      }}
                    >
                      → Flag incoming OIM
                    </div>
                    {/* Secondary chip */}
                    <div
                      style={{
                        padding: "7px 10px",
                        background: "transparent",
                        border: "1px solid #2a2a2a",
                        color: "#737371",
                        fontSize: "10px",
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: chipState === "tapped" ? 0.3 : 1,
                        transition: "opacity 0.3s ease",
                        cursor: "default",
                      }}
                    >
                      → I'll handle it
                    </div>
                  </div>
                )}

                {/* Confirmation state */}
                {msg.hasActions && chipState === "confirmed" && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "7px 10px",
                      background: "rgba(52,211,153,0.08)",
                      borderLeft: "2px solid #34D399",
                      animation: "message-fade-in 0.3s ease",
                    }}
                  >
                    <p
                      className="font-body font-medium uppercase"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        color: "#34D399",
                        margin: "0 0 2px",
                      }}
                    >
                      Done
                    </p>
                    <p
                      className="font-body"
                      style={{ fontSize: "11px", color: "#737371", margin: 0 }}
                    >
                      Incoming OIM flagged. Priority handover note sent to the
                      06:00 crew change manifest.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: "1px solid #222220",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            background: "#1a1a1a",
            border: "1px solid #222220",
            padding: "6px 10px",
          }}
        >
          <span
            className="font-body"
            style={{ fontSize: "11px", color: "#4a4a48" }}
          >
            Ask about the briefing...
          </span>
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #FFB77D, #D97707)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6h8M7 3l3 3-3 3"
              stroke="#131313"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full py-8">
      <p
        className="font-body font-medium uppercase text-center mb-6"
        style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#737371" }}
      >
        AI CONVERSATIONAL LAYER // LOOPING DEMO
      </p>

      <div className="hidden md:block">
        <PhoneFrame height={480}>{content}</PhoneFrame>
      </div>

      <div
        className="md:hidden max-w-[390px] mx-auto bg-bg border border-border"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        {content}
      </div>
    </div>
  );
}
