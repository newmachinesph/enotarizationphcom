import type { Metadata } from "next";
import { Dateline } from "@/components/marks/Dateline";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { TrackerEntry, type TrackerItem } from "@/components/tracker/TrackerEntry";
import { Callout, Disclaimer } from "@/components/ui/Callout";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { asOf, officialSources } from "@/lib/brand";
import { cn } from "@/lib/utils";
import tracker from "@/content/data/tracker.json";

export const metadata: Metadata = {
  title: "Ano na ang nangyari sa rollout ng e-notaryo",
  description:
    "May petsa ang bawat hakbang ng rollout ng e-notaryo, at may matrix kung aling ahensiya ang may sinabi na — at kung saan walang anunsyo.",
  alternates: { canonical: "/tracker" },
};

/**
 * Status chips read as evidence, not as brand colour — so they use the
 * semantic ramp, which is deliberately unclaimed by the palette. Chips are one
 * of only two places the radius is allowed above zero: a pill reads as a label.
 */
const ACCEPTANCE_STYLES: Record<string, { label: string; className: string }> = {
  announced: {
    label: "Announced",
    className: "bg-success-soft text-success border-success/40",
  },
  "case-by-case": {
    label: "Case by case",
    className: "bg-warning-soft text-warning border-warning/40",
  },
  silent: {
    label: "No announcement yet",
    className: "bg-sunken text-muted border-line-strong",
  },
};

export default function TrackerPage() {
  return (
    <div className="shell py-10 sm:py-14">
      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <Breadcrumbs trail={[{ label: "Tracker", href: "/tracker" }]} />
          <p className="dateline mt-8 text-accent-text">Rollout tracker</p>
          <h1 className="mt-4 max-w-[16ch]">What has actually happened, and when</h1>
          <BrassRule width="w-28" animate={false} className="mt-7" />
          <p className="lede mt-6 max-w-[46rem]">
            The rollout is staged and changes month to month. This page is the dated record —
            including, deliberately, the things that have <em>not</em> happened.
          </p>
          <Dateline className="mt-6" />
        </header>

        {/* Rail first in the DOM — it inlines above the record below lg. */}
        <aside
          aria-label="Record details"
          className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start"
        >
          <p className="dateline">Entries</p>
          <p className="mt-1.5 font-mono tabular-nums text-ink">
            {tracker.entries.length} dated
          </p>

          <div aria-hidden className="hair-rule my-5" />

          <LastReviewed date={asOf.iso} />

          <div aria-hidden className="hair-rule my-5" />

          <SourceList
            sources={officialSources}
            className="border-0 bg-transparent p-0 text-left"
          />
        </aside>

        <div className="broadsheet-text">
          <StatusBanner className="mb-12" />

          <section aria-labelledby="changelog">
            <div className="mb-2 flex items-baseline gap-3">
              <LedgerNumber value={1} />
              <h2 id="changelog" className="text-[1.75rem] sm:text-[2rem]">
                Changelog
              </h2>
            </div>
            <p className="mb-6 text-muted">Newest first. Every entry carries its source.</p>

            <ol className="border-b border-line">
              {(tracker.entries as TrackerItem[]).map((e) => (
                <TrackerEntry key={e.date + e.headline} entry={e} />
              ))}
            </ol>
          </section>
        </div>

        {/* The matrix earns the wide column: it is the widest thing on the site. */}
        <section aria-labelledby="acceptance" className="broadsheet-wide">
          <div className="mb-2 flex items-baseline gap-3">
            <LedgerNumber value={2} />
            <h2 id="acceptance" className="text-[1.75rem] sm:text-[2rem]">
              Agency acceptance matrix
            </h2>
          </div>
          <p className="mb-6 max-w-[46rem] text-muted">
            Will they take an e-notarized document? Mostly, nobody has said.
          </p>

          <Callout
            tone="warning"
            title="Read this row label carefully"
            className="mb-6 max-w-[46rem]"
          >
            <p>
              <strong>
                &ldquo;No announcement yet&rdquo; does not mean &ldquo;refuses&rdquo;.
              </strong>{" "}
              It means we have found no public statement either way. An e-notarized document
              has the same legal force as a traditionally notarized one — but whether a
              particular counter will accept it today is a practical question. Ask them before
              you pay for anything with a deadline attached.
            </p>
          </Callout>

          <ComparisonTable
            caption="Public positions on accepting e-notarized documents, as of the last review date."
            columns={[
              { key: "agency", label: "Agency" },
              { key: "useCase", label: "Typical documents" },
              // 1% plus the chip's whitespace-nowrap shrinks this column to fit
              // its widest label, so the prose columns keep the room instead.
              { key: "status", label: "Status", width: "1%" },
              { key: "note", label: "Note" },
            ]}
            rows={tracker.acceptance.map((a) => {
              const s = ACCEPTANCE_STYLES[a.status] ?? ACCEPTANCE_STYLES.silent;
              return {
                id: a.agency,
                agency: a.agency,
                useCase: a.useCase,
                status: (
                  <span
                    className={cn(
                      "inline-block whitespace-nowrap rounded-full border px-2.5 py-1",
                      "text-[0.75rem] font-semibold",
                      s.className,
                    )}
                  >
                    {s.label}
                  </span>
                ),
                note: a.note,
              };
            })}
          />
        </section>

        <div className="broadsheet-text">
          <Callout tone="info" title="Spotted something we have missed?">
            <p>
              If an agency has announced a position, or an official list has been published,
              tell us at hello@enotarizationph.com with a link and we will add it here with its
              date.
            </p>
          </Callout>

          {/* The disclaimer closes every page. Non-negotiable. */}
          <div className="mt-12">
            <div aria-hidden className="hair-rule mb-6" />
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
