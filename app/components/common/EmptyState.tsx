// ─── Style objects ────────────────────────────────────────────────────────────

const buttonStyle = { transition: "opacity var(--transition-fast)" };

// ─── Component ────────────────────────────────────────────────────────────────

export function EmptyState({
  noResultsLabel,
  clearFiltersLabel,
  onClear,
}: {
  noResultsLabel: string;
  clearFiltersLabel: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center my-20 mx-auto">
      <p className="font-display font-light text-2xl text-text-muted text-center">
        {noResultsLabel}
      </p>
      <button
        onClick={onClear}
        className="font-body font-medium text-sm text-accent mt-4"
        style={buttonStyle}
      >
        {clearFiltersLabel}
      </button>
    </div>
  );
}
