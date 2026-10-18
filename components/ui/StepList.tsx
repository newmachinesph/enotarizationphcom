import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Step = {
  title: string;
  body: ReactNode;
  /** Optional warning attached to this step — the thing people get wrong. */
  watchOut?: ReactNode;
};

/**
 * SIGNATURE COMPONENT — numbered procedure, set as a ledger.
 *
 * One action per step. The number hangs in a marginalia rail and a hairline
 * separates each entry, so a long guide reads as a countable record rather
 * than an endless stack of cards.
 */
export function StepList({
  steps,
  start = 1,
  className,
}: {
  steps: Step[];
  start?: number;
  className?: string;
}) {
  return (
    <ol className={cn("m-0 list-none p-0", className)} start={start}>
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "grid grid-cols-1 gap-x-6 border-t border-line py-7",
            "first:border-t-0 first:pt-0 last:pb-0",
            "sm:grid-cols-[4.5rem_minmax(0,1fr)]",
          )}
        >
          {/* Decorative — the ordered list carries the meaning. */}
          <span aria-hidden className="ledger-num pt-[0.4rem] sm:text-right">
            {String(start + i).padStart(2, "0")} —
          </span>
          <div className="mt-2 sm:mt-0">
            <h3 className="mb-2 text-[1.3125rem] leading-[1.2]">{step.title}</h3>
            <div className="article text-[1.0625rem] text-ink [&>*+*]:mt-3">{step.body}</div>
            {step.watchOut && (
              <p className="mt-4 border-l-[3px] border-accent pl-4 text-fine text-ink">
                <strong className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent-text">
                  Watch out:
                </strong>{" "}
                {step.watchOut}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
