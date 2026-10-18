import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The entry used by every index page (/learn, /guides, /tools).
 *
 * Not a card: a column entry. A rule across the top, the title in Instrument
 * Serif, the summary in Newsreader, and the call to action in the mono
 * dateline. The rule runs brass on hover — the only motion in the unit.
 */
export function LinkCard({
  href,
  title,
  description,
  cta = "Read →",
  icon,
  className,
}: {
  href: string;
  title: string;
  description: ReactNode;
  cta?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "pressable group relative flex h-full flex-col border-t border-line-strong pt-4 pb-1 no-underline",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -top-px left-0 h-[3px] w-full origin-left scale-x-0 bg-accent",
          "transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)]",
          "group-hover:scale-x-100",
        )}
      />
      {icon && (
        <span aria-hidden className="mb-2 text-xl leading-none">
          {icon}
        </span>
      )}
      <span className="font-display text-[1.375rem] leading-[1.15] text-ink">{title}</span>
      <span className="article mt-2 text-[1rem] text-muted">{description}</span>
      <span
        aria-hidden
        className={cn(
          "dateline mt-auto pt-5 text-accent-text",
          "transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)]",
          "group-hover:translate-x-0.5",
        )}
      >
        {cta}
      </span>
    </Link>
  );
}

/** Two-up on tablet, three-up where there are enough items to warrant it. */
export function CardGrid({
  children,
  columns = 2,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-8 gap-y-9",
        columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
      )}
    >
      {children}
    </ul>
  );
}
