import { CategoryChip } from "@/components/ui/CategoryChip";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export type TrackerItem = {
  date: string;
  category: string;
  headline: string;
  detail: string;
  sourceUrl: string;
};

/**
 * One dated changelog entry — a ruled ledger row, not a card.
 *
 * "preview" is the homepage teaser; "full" is the tracker page, which adds the
 * brass rail and the source link. Both were previously duplicated markup.
 *
 * Structure here comes from the hairline above each row and from the 3px brass
 * rail down its left edge, so the entries stack into one continuous ledger
 * instead of reading as a row of floating boxes.
 */
export function TrackerEntry({
  entry,
  variant = "full",
}: {
  entry: TrackerItem;
  variant?: "preview" | "full";
}) {
  const full = variant === "full";
  return (
    <li
      className={cn(
        "relative border-t border-line",
        full ? "py-6 pl-5 sm:pl-6" : "py-5",
      )}
    >
      {full && (
        <span aria-hidden className="absolute inset-y-6 left-0 w-[3px] bg-accent" />
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <time dateTime={entry.date} className="dateline">
          {formatDate(entry.date)}
        </time>
        <CategoryChip label={entry.category} />
      </div>
      <h3 className="mt-3">{entry.headline}</h3>
      <p className="mt-2.5 max-w-[46rem] text-[0.9375rem] leading-relaxed text-muted">
        {entry.detail}
      </p>
      {full && (
        <p className="mt-3 text-fine">
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-outbound="official"
          >
            Source ↗
          </a>
        </p>
      )}
    </li>
  );
}
