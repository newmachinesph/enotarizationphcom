import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "gold";
type Size = "md" | "lg";

/**
 * Controls in this system are squared blocks of ink, not soft capsules. Every
 * variant carries a border of the same weight so the four of them sit on one
 * baseline and swapping a variant never shifts the layout by a pixel.
 *
 * `rounded-none` is explicit rather than inherited: the UA stylesheet rounds a
 * native <button> on some platforms, and a record has edges.
 */
const base =
  "pressable inline-flex items-center justify-center gap-2 rounded-none border " +
  "font-medium leading-none tracking-[0.01em] text-center no-underline " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // The one civic-blue object on the page.
  //
  // Every value here is a THEME-AWARE token, deliberately. The first cut of
  // this pinned `bg-civic-600 text-white`, which does not move with the theme:
  // against the night background that border measured 2.19:1, failing WCAG
  // 1.4.11's 3:1 for a control boundary. `--link` carries civic-600 by day and
  // civic-300 at night, and `--text-inverse` carries the matching label, so
  // both editions clear AA with no `dark:` override.
  //
  // Hover resolves to ink in both editions — darker by day, lighter at night.
  // The record does not glow.
  primary: "border-link bg-link text-on-inverse hover:border-ink hover:bg-ink hover:text-bg",
  // Quiet, but unmistakably a control: `line-strong` is the 4.17:1 boundary
  // WCAG 1.4.11 asks for when the border IS the edge of the control.
  secondary: "border-line-strong bg-surface text-ink hover:border-ink hover:bg-sunken",
  // No box until you reach for it.
  ghost: "border-transparent bg-transparent text-link hover:border-line hover:bg-sunken",
  // Brass. The union member is named `gold` for callers that predate the
  // rebrand; the fill is brass-300 with navy ink, 10.07:1 in both editions
  // because neither value moves with the theme.
  //
  // The BORDER does move, and has to. Brass-300 against bone paper is 1.70:1,
  // so a self-coloured border left this button with no discernible edge in the
  // day edition — a 1.4.11 failure hiding behind a fill that only contrasts at
  // night. `--accent-text` is brass-700 by day (6.50:1 on paper) and brass-300
  // at night, where the fill already clears 10.07:1 against the background.
  gold: "border-accent-text bg-brass-300 text-navy-900 hover:border-brass-800 hover:bg-brass-200",
};

// Both sizes clear the 44px minimum target.
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-[0.9375rem]",
  lg: "min-h-13 px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
