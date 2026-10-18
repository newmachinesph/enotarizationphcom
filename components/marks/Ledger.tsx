import { cn } from "@/lib/utils";

/**
 * Ledger marks — the two smallest structural devices in the system.
 *
 * `LedgerNumber` stamps a section with a zero-padded numeral (`01 —`), the way
 * a docket or a statute numbers its parts. It is a real, readable numeral, not
 * decoration: only the trailing dash is hidden from assistive tech.
 *
 * `BrassRule` is the 3px gradient hairline that heads every section. It is the
 * one flourish the design permits, so it is always decorative and always
 * `aria-hidden`.
 */

export function LedgerNumber({
  value,
  pad = 2,
  className,
}: {
  /** The section number. Rendered zero-padded. */
  value: number;
  /** Minimum digits. `01`, `001`, and so on. */
  pad?: number;
  className?: string;
}) {
  return (
    <span className={cn("ledger-num", className)}>
      {String(Math.trunc(value)).padStart(pad, "0")}
      <span aria-hidden>{" —"}</span>
    </span>
  );
}

export function BrassRule({
  width = "w-24",
  animate = true,
  className,
}: {
  /** Tailwind width utility. `w-24` by default; `w-full` heads a panel. */
  width?: string;
  /** Extend the rule on scroll-enter. Off for anything above the fold. */
  animate?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("brass-rule", animate && "rule-reveal", width, className)}
    />
  );
}
