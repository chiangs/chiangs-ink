type Props = {
  num: string;
  label: string;
  className: string;
};

const statNumStyle = {
  fontSize: "clamp(48px, 4.5vw, 64px)",
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  lineHeight: 1,
  background: "linear-gradient(135deg, #FFB77D 0%, #D97707 50%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

export function CredentialStatColumn({ num, label, className }: Props) {
  return (
    <div
      data-anim="cred-col"
      className={className}
    >
      <div className="flex items-end">
        <span style={statNumStyle}>{num}</span>
      </div>
      <div className="flex-1 items-start">
        <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.12em] md:tracking-[0.15em] text-text-muted mt-2 block">
          {label}
        </span>
      </div>
    </div>
  );
}
