import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: ReactNode;
  /** "tl" marks a Taglish/Filipino question so we can style + label it. */
  lang?: "en" | "tl";
};

/**
 * SIGNATURE COMPONENT — FAQ accordion.
 *
 * Built on native <details>/<summary>: keyboard-complete and screen-reader
 * correct with no JavaScript, and — the reason it's native — it cannot shift
 * layout on hydration, because there is no hydration.
 *
 * Set as a ruled register: hairlines between entries, questions in Instrument
 * Serif, answers in Newsreader. The only affordance is a bare crossbar that
 * turns 45° when the entry opens; no chip, no fill, no box.
 */
export function FaqAccordion({
  items = [],
  className,
}: {
  items?: FaqItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item) => (
        <details key={item.q} className="group border-b border-line">
          <summary
            className={cn(
              "flex min-h-11 cursor-pointer list-none items-start gap-4 py-5 pr-1",
              "text-ink transition-colors duration-[var(--dur-fast)] hover:text-accent-text",
              "[&::-webkit-details-marker]:hidden",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "mt-[0.45rem] grid size-4 shrink-0 place-items-center",
                "transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)]",
                "group-open:rotate-45",
              )}
            >
              <svg
                viewBox="0 0 12 12"
                className="size-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 1v10M1 6h10" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex-1 font-display text-[1.1875rem] leading-[1.25]">
              {item.q}
              {/* Squared: `rounded-full` in this system is reserved for
                  status. A language tag is filing metadata, not a state. */}
              {item.lang === "tl" && (
                <span className="ml-2 inline-block border border-line px-2 py-0.5 align-middle font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
                  Filipino
                </span>
              )}
            </span>
          </summary>
          <div className="article pb-6 pl-8 pr-1 text-[1.0625rem] text-ink [&>*+*]:mt-3">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
