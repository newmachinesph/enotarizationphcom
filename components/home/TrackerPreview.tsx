import Link from "next/link";
import { Dateline } from "@/components/marks/Dateline";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { TrackerEntry, type TrackerItem } from "@/components/tracker/TrackerEntry";
import { Disclaimer } from "@/components/ui/Callout";
import { asOf } from "@/lib/brand";
import tracker from "@/content/data/tracker.json";

/** 05 — the dated record itself. The rail carries the review date. */
export function TrackerPreview() {
  const latest = (tracker.entries as TrackerItem[]).slice(0, 3);

  return (
    <section className="shell py-16 sm:py-20 lg:py-24">
      <div className="broadsheet reveal">
        <div className="broadsheet-rail">
          <LedgerNumber value={5} className="block" />
          <Dateline label="" className="mt-3 lg:justify-end" />
        </div>

        <div className="broadsheet-text">
          <h2>Latest from the tracker</h2>
          <BrassRule className="mt-5" />
          <p className="lede mt-5">
            {`What has actually changed in the rollout, dated. Last reviewed ${asOf.label}.`}
          </p>
        </div>

        <div className="broadsheet-wide mt-12 lg:mt-14">
          <ol className="space-y-4">
            {latest.map((e) => (
              <TrackerEntry key={e.date + e.headline} entry={e} variant="preview" />
            ))}
          </ol>
          <p className="mt-7">
            <Link
              href="/tracker"
              className="inline-flex min-h-11 items-center text-[0.8125rem] uppercase tracking-[0.12em] text-accent-text no-underline hover:underline"
            >
              Full rollout tracker and agency acceptance matrix →
            </Link>
          </p>

          <Disclaimer className="mt-12" />
        </div>
      </div>
    </section>
  );
}
