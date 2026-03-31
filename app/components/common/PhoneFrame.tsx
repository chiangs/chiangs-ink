// ─── PhoneFrame ───────────────────────────────────────────────────────────────
// Shared mobile phone frame wrapper used across article MDX components.
// scrollRef is optional — pass it when the parent needs to control scrolling.

export function PhoneFrame({
  children,
  scrollRef,
  height = 520,
}: {
  children: React.ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  height?: number;
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
        {/* Notch */}
        <div
          className="mx-auto bg-[#0a0a0a] mb-2 relative z-10"
          style={{
            width: 80,
            height: 20,
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 1px 0 #2a2a2a",
          }}
        />
        {/* Screen area */}
        <div
          ref={scrollRef}
          className="bg-bg"
          style={{
            borderRadius: 24,
            height,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </div>
        {/* Home indicator */}
        <div
          className="mx-auto mt-2 bg-[#3a3a3a]"
          style={{ width: 80, height: 4, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}
