const COPY_RIGHT = "STEPHEN CHIANG 2026";
const LABEL_LINKEDIN = "LINKEDIN";
const LABEL_X = "X";
const HREF_LINKEDIN = "https://linkedin.com/in/chiangs";
const HREF_X = "https://x.com/chiangs";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin flex items-center justify-between h-14">
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted">{COPY_RIGHT}</span>
        <div className="flex items-center gap-6">
          <a
            href={HREF_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-colors duration-200"
          >
            {LABEL_LINKEDIN}
          </a>
          <a
            href={HREF_X}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted hover:text-accent transition-colors duration-200"
          >
            {LABEL_X}
          </a>
        </div>
      </div>
    </footer>
  );
}
