import Link from "next/link";
import type { ReactNode } from "react";
import { Seal } from "@/components/marks/Seal";
import { asOf, ROLLOUT_STATUS } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * SIGNATURE COMPONENT — the honest "as of [date]" rollout strip.
 *
 * It appears on every page that makes a claim about what you can do today.
 * It exists because the single biggest way this site could mislead someone
 * is by implying the system is fully live when it is still staged.
 *
 * Visually it is a stamped notice, not an alert box: a brass rule across the
 * head, hairlines top and bottom, a ghosted seal in the corner, and the date
 * carried in the mono dateline where every other date on the site lives.
 */
export function StatusBanner({
  children,
  className,
  compact = false,
}: {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <aside
      aria-label="Rollout status"
      className={cn(
        "relative overflow-hidden border-y border-line bg-surface",
        compact ? "px-4 py-3.5" : "px-4 py-5 sm:px-6 sm:py-6",
        className,
      )}
    >
      {/* The brass rule = official / time-sensitive. Consistent across the site. */}
      <span aria-hidden className="brass-rule rule-reveal absolute inset-x-0 top-0" />
      {/* Ghosted seal — the notice reads as stamped rather than boxed. */}
      <Seal
        size={compact ? 96 : 148}
        className="pointer-events-none absolute -right-8 -top-8 opacity-[0.09]"
      />
      <div className="relative">
        <p className="dateline text-accent-text">
          <span aria-hidden className="mr-1.5 text-[0.8125rem] align-[-0.1em]">
            ⚠️
          </span>
          Status as of {asOf.label}
        </p>
        <p
          className={cn(
            "article mt-2 text-ink",
            compact ? "text-[0.9375rem] leading-[1.5]" : "text-[1.0625rem]",
          )}
        >
          {children ?? ROLLOUT_STATUS}
        </p>
        {!compact && (
          <p className="mt-4">
            <Link
              href="/tracker"
              className="dateline inline-flex min-h-11 items-center text-accent-text no-underline hover:underline"
            >
              See what changed and when →
            </Link>
          </p>
        )}
      </div>
    </aside>
  );
}
