import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrassRule } from "@/components/marks/Ledger";

/**
 * SIGNATURE COMPONENT — the Quick Answer box.
 *
 * Sixty words or fewer, at the very top of an explainer. Someone who reads
 * only this box should still leave with the correct answer.
 *
 * Which is why it is set like a standfirst, not like a callout: the brass rule
 * runs the full top edge as a masthead, the label is a mono dateline, and the
 * answer itself sets in Newsreader at `.lede` size. Type does the emphasising —
 * there is no shadow, no tint and no radius anywhere in it.
 */
export function QuickAnswer({
  children,
  label = "Quick answer",
  className,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <section
      data-quick-answer
      aria-label={label}
      className={cn("border border-line bg-surface", className)}
    >
      <BrassRule width="w-full" />
      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <p className="dateline text-accent-text">{label}</p>
        {/* `.lede` sets Newsreader at an optical size for intros; the colour is
            pulled back up to full ink because this paragraph IS the answer. */}
        <div className="lede mt-3 text-ink [&>*+*]:mt-3">{children}</div>
      </div>
    </section>
  );
}
