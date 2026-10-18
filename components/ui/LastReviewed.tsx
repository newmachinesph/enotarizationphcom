import { cn, formatDate } from "@/lib/utils";

/**
 * SIGNATURE COMPONENT — the "last reviewed" badge.
 *
 * Trust on a legal-information site is mostly a function of recency you can
 * see. Every content page carries one, sourced from its frontmatter.
 *
 * It is no longer a badge. A record states its revision date on a dateline, so
 * this sets as one: a brass tick, then mono small caps, with the date itself
 * lifted to full ink because the date is the whole claim. The change log opens
 * underneath as a ruled ledger rather than a card.
 */
export function LastReviewed({
  date,
  className,
  changelog,
}: {
  date: string;
  className?: string;
  changelog?: { date: string; note: string }[];
}) {
  return (
    <div className={cn("text-fine", className)}>
      <p className="dateline flex flex-wrap items-center gap-x-2 gap-y-1">
        <span aria-hidden className="inline-block h-[3px] w-6 shrink-0 bg-accent" />
        Last reviewed{" "}
        <time dateTime={date} className="text-ink">
          {formatDate(date)}
        </time>
      </p>

      {changelog && changelog.length > 0 && (
        <details className="mt-4 border border-line bg-surface">
          <summary className="flex min-h-11 cursor-pointer list-none items-center px-4 py-2.5 font-medium text-link hover:bg-sunken">
            What changed on this page ({changelog.length})
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {changelog.map((c) => (
              <li key={`${c.date}-${c.note}`} className="flex gap-4 px-4 py-2.5">
                <time
                  dateTime={c.date}
                  className="shrink-0 font-mono tabular-nums text-muted"
                >
                  {c.date}
                </time>
                <span className="text-ink">{c.note}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
