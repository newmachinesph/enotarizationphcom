"use client";

import type { ReactNode } from "react";
import { BrassRule } from "@/components/marks/Ledger";
import { cn } from "@/lib/utils";

/**
 * Shared chrome for the four tools — "The Record" edition.
 *
 * A tool reads as a form on an official record: ruled rows rather than boxed
 * cards, ledger numerals in the margin, a brass rule separating the question
 * from the answer. No shadows, no radii (the selection mark and status chips
 * are the two deliberate exceptions).
 *
 * Interaction rules baked in here:
 * - Feedback lands on press, not on release (`.pressable`).
 * - Every control carries `border-line-strong` — the only border token that
 *   meets WCAG 1.4.11's 3:1 boundary requirement. `border-line` is decorative
 *   and is used only on containers.
 * - Back is always available. A tool must never trap you.
 * - Results are framed as a path, never as a rejection.
 */

/** Zero-padded so the counter sets as a ledger numeral: `01 / 04`. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function ToolProgress({
  step,
  total,
  className,
}: {
  step: number;
  total: number;
  className?: string;
}) {
  const current = Math.min(step, total);
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="ledger-num shrink-0">
        {pad(current)} / {pad(total)}
      </span>
      <div
        className="flex flex-1 gap-1"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} of ${total}`}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] flex-1 transition-colors duration-[var(--dur-base)]",
              "[transition-timing-function:var(--ease-standard)]",
              i < step ? "bg-accent" : "bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function QuestionCard({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="font-display text-[1.5rem] leading-[1.12] text-ink">
        {label}
      </legend>
      {help && <p className="mt-2 text-[0.9375rem] text-muted">{help}</p>}
      <BrassRule width="w-16" animate={false} className="mt-4" />
      {/* A ruled stack: adjacent control borders collapse into one hairline. */}
      <div className="mt-5 grid [&>*+*]:-mt-px">{children}</div>
    </fieldset>
  );
}

export function OptionButton({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "pressable relative flex min-h-11 w-full items-start gap-3.5 border p-4 text-left",
        "focus-visible:z-10",
        selected
          ? "z-10 border-ink bg-sunken"
          : "border-line-strong bg-surface hover:bg-sunken",
      )}
    >
      {/* A circle reads as single-select. The one radius exception a control
          gets — squaring it would read as a checkbox and mislead. */}
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2",
          selected ? "border-accent bg-accent" : "border-line-strong bg-surface",
        )}
      >
        {selected && <span className="size-1.5 rounded-full bg-navy-900" />}
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-fine text-muted">{hint}</span>}
      </span>
    </button>
  );
}

export function ToolNav({
  onBack,
  backLabel = "Back",
  children,
}: {
  onBack?: () => void;
  backLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="pressable inline-flex min-h-11 items-center gap-1.5 border border-line-strong bg-surface px-4 text-[0.9375rem] text-ink hover:bg-sunken"
        >
          <span aria-hidden>←</span> {backLabel}
        </button>
      )}
      {children}
    </div>
  );
}

/** The stamped primary action — navy plate, paper type. */
export const PRIMARY_ACTION =
  "pressable inline-flex min-h-11 items-center border border-inverse bg-inverse px-5 text-[0.9375rem] font-medium text-on-inverse";

/** The chip is a status label, so it keeps its pill — a pill reads as a label. */
const CHIP = "inline-block rounded-full px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em]";

const TONE_STYLES = {
  good: { bar: "bg-success", chip: "bg-success-soft text-success", word: "Good news" },
  caution: {
    bar: "bg-accent",
    chip: "bg-warning-soft text-warning",
    word: "Read this bit carefully",
  },
  reroute: { bar: "bg-civic-600", chip: "bg-info-soft text-info", word: "Here's your path" },
} as const;

export function ResultScreen({
  tone,
  title,
  children,
  onRestart,
}: {
  tone: keyof typeof TONE_STYLES;
  title: string;
  children: ReactNode;
  onRestart: () => void;
}) {
  const t = TONE_STYLES[tone];
  return (
    <section aria-live="polite" className="border border-line bg-surface">
      <div aria-hidden className={cn("h-[3px] w-full", t.bar)} />
      <div className="p-5 sm:p-6">
        <p className={cn(CHIP, t.chip)}>{t.word}</p>
        <h2 className="mt-4">{title}</h2>
        <BrassRule width="w-24" animate={false} className="mt-4" />
        <div className="mt-5 [&>*+*]:mt-5">{children}</div>
        <ToolNav>
          <button
            type="button"
            onClick={onRestart}
            className="pressable inline-flex min-h-11 items-center border border-line-strong bg-surface px-4 text-[0.9375rem] text-ink hover:bg-sunken"
          >
            Start over
          </button>
        </ToolNav>
      </div>
    </section>
  );
}

/** A micro-heading inside a result — the mono label of the record. */
export function ResultHeading({ children }: { children: ReactNode }) {
  return <h3 className="dateline border-t border-line pt-3">{children}</h3>;
}

/** The cited-basis note: a brass rule in the margin, never a rounded box. */
export function BasisNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l-[3px] border-accent bg-sunken px-4 py-3 text-fine text-muted">
      {children}
    </p>
  );
}

export function ToolFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border border-line bg-surface p-5 sm:p-6">{children}</div>
  );
}
