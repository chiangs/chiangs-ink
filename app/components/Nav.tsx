import { NavLink } from "react-router";

const LABEL_OPEN_MENU = "Open menu";

const NAV_LINKS = [
  { to: "/work", label: "Work" },
  { to: "/writing", label: "Writing" },
  { to: "/contact", label: "Contact" },
];

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "text-[11px] font-medium uppercase tracking-[0.15em] text-text-primary relative group transition-colors duration-200",
    isActive ? "text-accent" : "hover:text-accent",
  ].join(" ");
}

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="max-w-container mx-auto px-margin-mob md:px-margin flex items-center justify-between h-16">
        {/* Logo */}
        <NavLink
          to="/"
          className="font-display font-bold text-accent text-base tracking-tight"
        >
          SC
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={getNavLinkClass}>
                {label}
                {/* Underline slide-in */}
                <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] ease-out origin-left" />
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger — stub */}
        <button aria-label={LABEL_OPEN_MENU} className="md:hidden text-text-primary p-2">
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </div>
    </nav>
  );
}
