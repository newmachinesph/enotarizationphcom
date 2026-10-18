import type { Metadata } from "next";
import Link from "next/link";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { RelatedLinks } from "@/components/ui/SourceList";
import { getPagesIn } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mga gabay para matapos ang papeles mo",
  description:
    "Step-by-step para sa unang e-notarization mo, sa mga OFW, sa tamang ID, at sa pag-verify ng dokumentong natanggap mo. Sundan habang bukas ang file.",
  alternates: { canonical: "/guides" },
};

export default function GuidesHub() {
  const pages = getPagesIn("guides");

  return (
    <div className="shell py-10 sm:py-14">
      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <Breadcrumbs trail={[{ label: "Guides", href: "/guides" }]} />
          <p className="dateline mt-8 text-accent-text">Guides</p>
          <h1 className="mt-4 max-w-[14ch]">Guides that finish the job</h1>
          <BrassRule width="w-28" animate={false} className="mt-7" />
          <p className="lede mt-6 max-w-[46rem]">
            Practical, step-by-step, written so you can follow along with the document open in
            another window.
          </p>
        </header>

        {/* Rail first in the DOM — it inlines above the list below lg. */}
        <aside
          aria-label="Section summary"
          className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start"
        >
          <p className="dateline">Contents</p>
          <p className="mt-1.5 font-mono tabular-nums text-ink">
            {pages.length} guides
          </p>
        </aside>

        <div className="broadsheet-text">
          {/* A table of contents in a record: ruled rows, hanging numerals. */}
          <ol className="border-t border-line-strong">
            {pages.map((p, i) => (
              <li key={p.url} className="border-b border-line">
                <Link
                  href={p.url}
                  className="pressable group grid grid-cols-[2rem_1fr] gap-x-3 py-6 no-underline sm:grid-cols-[4rem_1fr] sm:gap-x-6"
                >
                  <LedgerNumber value={i + 1} className="pt-2" />
                  <span className="min-w-0">
                    <span className="block font-display text-[1.5rem] leading-[1.1] text-ink group-hover:text-accent-text sm:text-[1.75rem]">
                      {p.frontmatter.title}
                    </span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted">
                      {p.frontmatter.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <RelatedLinks
            className="mt-14"
            title="Tools that go with these guides"
            links={[
              {
                label: "Readiness checklist",
                href: "/tools/readiness-checklist",
                note: "Printable, tailored to your session",
              },
              {
                label: "OFW route finder",
                href: "/tools/ofw-route-finder",
                note: "Five questions, one recommended route",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
