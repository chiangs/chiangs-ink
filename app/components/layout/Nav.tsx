// Nav.tsx
// Sticky navigation — SC/S.CHIANG monogram, nav links, live Stavanger time
// Monogram: opens style guide (homepage) or navigates to / (other pages)
// Time: opens Currently drawer

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { NAV_LINKS, ITEM_STAGGER_S } from "~/lib/constants";
import { useScrolled, useStavTime } from "~/hooks";

// Copy constants
const MONOGRAM_DESKTOP = "S.CHIANG";
const MONOGRAM_MOBILE = "SC";
const ARIA_STYLEGUIDE = "Open style guide";
const ARIA_CURRENTLY = "Open currently";
const ARIA_OPEN_MENU = "Open menu";
const ARIA_CLOSE_MENU = "Close menu";

const MONOGRAM_CLASS =
  "font-display font-bold text-accent text-base tracking-[0.05em] transition-opacity duration-200 hover:opacity-70";

type NavProps = {
  onOpenStyleGuide?: () => void;
  onOpenCurrently?: () => void;
};

export function Nav({ onOpenStyleGuide, onOpenCurrently }: NavProps) {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const time = useStavTime();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navStyle = {
    background: scrolled ? "rgba(19,19,19,0.8)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
  };

  const navLinks = NAV_LINKS.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      label={link.label}
      active={location.pathname.startsWith(link.to)}
    />
  ));

  return (
    <>
      <nav
        data-anim="nav"
        className="fixed top-0 left-0 right-0 z-100 flex items-center justify-between h-16 px-margin-mob md:px-margin transition-[background,border-color] duration-300"
        style={navStyle}
      >
        <Monogram isHomepage={isHomepage} onOpenStyleGuide={onOpenStyleGuide} />

        {/* Desktop: nav links + time */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks}
          <button
            onClick={onOpenCurrently}
            aria-label={ARIA_CURRENTLY}
            className="bg-transparent border-0 font-body text-sm font-medium uppercase tracking-[0.15em] text-accent-deep cursor-pointer p-0 transition-colors duration-200 hover:text-accent"
          >
            {time}
          </button>
        </div>

        {/* Mobile: hamburger / X toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? ARIA_CLOSE_MENU : ARIA_OPEN_MENU}
          className="md:hidden flex items-center justify-center bg-transparent border-0 cursor-pointer p-2"
        >
          <span className="relative block w-5 h-2.75">
            <span
              className="absolute left-0 w-5 h-px bg-accent transition-all duration-300 origin-center"
              style={{
                top: mobileOpen ? "5px" : "0px",
                transform: mobileOpen ? "rotate(45deg)" : "none",
              }}
            />
            <span
              className="absolute left-0 w-5 h-px bg-accent transition-all duration-300"
              style={{
                top: "5px",
                opacity: mobileOpen ? 0 : 1,
                transform: mobileOpen ? "scaleX(0)" : "none",
              }}
            />
            <span
              className="absolute left-0 h-px bg-accent transition-all duration-300 origin-center"
              style={{
                top: mobileOpen ? "5px" : "10px",
                width: mobileOpen ? "20px" : "12px",
                transform: mobileOpen ? "rotate(-45deg)" : "none",
              }}
            />
          </span>
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={location.pathname}
        onOpenCurrently={onOpenCurrently}
        time={time}
      />
    </>
  );
}

// SC / S.CHIANG monogram — button on homepage, Link elsewhere
type MonogramProps = {
  isHomepage: boolean;
  onOpenStyleGuide?: () => void;
};

function Monogram({ isHomepage, onOpenStyleGuide }: MonogramProps) {
  const inner = (
    <>
      <span className="hidden md:inline">{MONOGRAM_DESKTOP}</span>
      <span className="md:hidden">{MONOGRAM_MOBILE}</span>
    </>
  );

  if (isHomepage) {
    return (
      <button
        onClick={() => onOpenStyleGuide?.()}
        aria-label={ARIA_STYLEGUIDE}
        className={`${MONOGRAM_CLASS} bg-transparent border-0 cursor-pointer p-0`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link to="/" viewTransition className={`${MONOGRAM_CLASS} no-underline`}>
      {inner}
    </Link>
  );
}

// Desktop nav link with slide-in underline
function NavLink({
  to,
  label,
  active,
}: {
  to: string;
  label: string;
  active: boolean;
}) {
  const colorClass = active
    ? "text-accent"
    : "text-text-primary hover:text-accent";

  const underlineClass = active
    ? "scale-x-100"
    : "scale-x-0 group-hover:scale-x-100";

  return (
    <Link
      to={to}
      viewTransition
      data-anim="nav-link"
      className={`group relative font-body text-sm font-medium uppercase tracking-[0.15em] no-underline pb-0.5 transition-colors duration-200 ${colorClass}`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 right-0 h-px bg-accent origin-left transition-transform duration-200 ${underlineClass}`}
      />
    </Link>
  );
}

// Manages the three-phase open/close animation for the mobile menu
function useMobileMenuAnimation(isOpen: boolean) {
  const [containerVisible, setContainerVisible] = useState(false);
  const [containerSlide, setContainerSlide] = useState(false);
  const [itemsIn, setItemsIn] = useState(false);

  useEffect(() => {
    let itemTimer: ReturnType<typeof setTimeout>;
    let slideTimer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      setContainerSlide(false);
      setContainerVisible(false);
      setItemsIn(false);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContainerSlide(true);
          setContainerVisible(true);
          itemTimer = setTimeout(() => setItemsIn(true), 160);
        });
      });
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(itemTimer);
      };
    } else {
      setItemsIn(false);
      setContainerVisible(false);
      slideTimer = setTimeout(() => setContainerSlide(false), 280);
      return () => clearTimeout(slideTimer);
    }
  }, [isOpen]);

  return { containerVisible, containerSlide, itemsIn };
}

// Mobile drop-down menu
type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  onOpenCurrently?: () => void;
  time: string;
};

function MobileMenu({
  isOpen,
  onClose,
  pathname,
  onOpenCurrently,
  time,
}: MobileMenuProps) {
  const { containerVisible, containerSlide, itemsIn } =
    useMobileMenuAnimation(isOpen);

  const handleCurrently = () => {
    onClose();
    onOpenCurrently?.();
  };

  const navLinks = NAV_LINKS.map((link, i) => {
    const isActive = pathname.startsWith(link.to);
    const linkColor = isActive
      ? "text-accent"
      : "text-text-primary hover:text-accent";
    const delay = `${i * ITEM_STAGGER_S}s`;
    return (
      <Link
        key={link.to}
        to={link.to}
        viewTransition
        onClick={onClose}
        className={`font-display font-bold text-[32px] no-underline transition-colors duration-200 ${linkColor}`}
        style={{
          opacity: itemsIn ? 1 : 0,
          transform: itemsIn ? "translateY(0)" : "translateY(-10px)",
          transition: itemsIn
            ? `opacity 0.3s ease ${delay}, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${delay}, color 0.2s ease`
            : "opacity 0.15s ease, transform 0.15s ease, color 0.2s ease",
        }}
      >
        {link.label}
      </Link>
    );
  });

  const timeDelay = `${NAV_LINKS.length * ITEM_STAGGER_S}s`;

  return (
    <div
      className="fixed top-16 left-0 right-0 bottom-0 z-99 bg-bg flex flex-col md:hidden"
      style={{
        transform: containerSlide ? "translateY(0)" : "translateY(-8px)",
        opacity: containerVisible ? 1 : 0,
        pointerEvents: containerVisible ? "auto" : "none",
        transition: containerSlide
          ? "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease"
          : "opacity 0.22s ease",
      }}
      aria-hidden={!isOpen}
    >
      {/* Nav links — staggered slide + fade */}
      <div className="flex flex-col px-margin-mob pt-12 gap-8">{navLinks}</div>

      {/* Time / Currently — pinned to bottom, follows last link in stagger */}
      <div
        className="mt-auto px-margin-mob pb-12"
        style={{
          opacity: itemsIn ? 1 : 0,
          transform: itemsIn ? "translateY(0)" : "translateY(-10px)",
          transition: itemsIn
            ? `opacity 0.3s ease ${timeDelay}, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${timeDelay}`
            : "opacity 0.15s ease, transform 0.15s ease",
        }}
      >
        <button
          onClick={handleCurrently}
          aria-label={ARIA_CURRENTLY}
          className="bg-transparent border-0 cursor-pointer font-body text-sm font-medium uppercase tracking-[0.15em] text-text-muted transition-colors duration-200 hover:text-text-primary p-0"
        >
          {time}
        </button>
      </div>
    </div>
  );
}
