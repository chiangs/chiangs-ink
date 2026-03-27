// ─── Style objects ────────────────────────────────────────────────────────────

const chevronStyle = { transition: "transform var(--transition-fast)" };
const buttonTransitionStyle = { transition: "color var(--transition-fast)" };
const optionTransitionStyle = { transition: "background var(--transition-fast)" };

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterDropdownProps = {
  label: string;
  defaultLabel: string;
  options: string[];
  selected: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleOption: (value: string) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function FilterDropdown({
  label,
  defaultLabel,
  options,
  selected,
  isOpen,
  onToggleOpen,
  onToggleOption,
}: FilterDropdownProps) {
  const buttonLabel =
    selected.length > 0 ? `${label} (${selected.length})` : defaultLabel;
  const chevronClass = `ml-auto pl-4 inline-block ${isOpen ? "rotate-180" : "rotate-0"}`;

  return (
    <div className="relative" data-dropdown>
      <button
        onClick={onToggleOpen}
        className="flex items-center justify-between w-full md:w-auto bg-bg border-b border-border font-body font-medium text-sm text-text-muted uppercase tracking-[0.1em] px-3 whitespace-nowrap h-10"
        style={buttonTransitionStyle}
      >
        {buttonLabel}
        <span className={chevronClass} style={chevronStyle}>
          ↓
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 z-50 bg-hover-surface border border-border w-full md:w-auto md:min-w-55 mt-1">
          {options.map((option) => {
            const isSelected = selected.includes(option);
            const optionClass = `flex items-center justify-between w-full text-left font-body font-normal text-sm px-4 py-2.5 ${
              isSelected ? "text-accent" : "text-text-primary"
            }`;
            return (
              <button
                key={option}
                onClick={() => onToggleOption(option)}
                className={optionClass}
                style={optionTransitionStyle}
              >
                {option}
                {isSelected && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
