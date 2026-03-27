// ButtonCta.tsx
// Bordered CTA button — internal route (Link) or external anchor.
// Style: uppercase label, border, hover shifts to accent color.

import type { ReactNode } from "react";
import { Link } from "react-router";

type ButtonCtaProps = {
  /** Internal route path — renders a <Link> */
  to?: string;
  /** External URL — renders an <a> with rel="noopener noreferrer" */
  href?: string;
  children: ReactNode;
  className?: string;
};

const BASE_CLASS =
  "inline-block font-body text-sm font-medium uppercase tracking-[0.15em] text-text-primary border border-border px-6 py-3 transition-colors duration-200 hover:text-accent hover:border-accent";

export function ButtonCta({ to, href, children, className }: ButtonCtaProps) {
  const cls = className ? `${BASE_CLASS} ${className}` : BASE_CLASS;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cls} rel="noopener noreferrer">
      {children}
    </a>
  );
}
