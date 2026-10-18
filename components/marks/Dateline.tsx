import { asOf as siteAsOf } from "@/lib/brand";
import { cn, formatDate } from "@/lib/utils";

/**
 * The Dateline — a gazette masthead line.
 *
 *   MANILA · AS OF 6 AUGUST 2026 · REVIEWED
 *
 * A newspaper dateline states where a report was filed and when. This site is
 * a record of one legal change, so it files from one place and reports one
 * "as of" date: the moment the rollout status was last verified. The date
 * defaults to `asOf` in lib/brand.ts, which the banner, the tracker and every
 * page footer also read — there is exactly one date on this site, not many.
 *
 * Uppercasing, tracking and tabular numerals all come from `.dateline`, so the
 * DOM keeps the human-readable string and only the rendering is stamped.
 */

/** Where this record is filed from. Fixed, like a masthead. */
const ORIGIN = "Manila";

function Separator() {
  return (
    <span aria-hidden className="text-accent-text">
      ·
    </span>
  );
}

export function Dateline({
  asOf = siteAsOf.iso,
  label = "Reviewed",
  className,
}: {
  /** ISO date (YYYY-MM-DD). Defaults to the site-wide `asOf`. */
  asOf?: string;
  /** Trailing status word. Pass an empty string to drop it. */
  label?: string;
  className?: string;
}) {
  return (
    <p className={cn("dateline flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <span>{ORIGIN}</span>
      <Separator />
      <span>
        As of <time dateTime={asOf}>{formatDate(asOf)}</time>
      </span>
      {label ? (
        <>
          <Separator />
          <span>{label}</span>
        </>
      ) : null}
    </p>
  );
}
