import type { Metadata } from "next";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { Disclaimer } from "@/components/ui/Callout";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { asOf, officialSources } from "@/lib/brand";
import { formatDate } from "@/lib/utils";
import faq from "@/content/data/faq.json";

export const metadata: Metadata = {
  title: "Mga tanong mo sa e-notaryo, sinagot",
  description:
    "Sagot sa mga tanong na madalas itanong sa e-notaryo — pwede ba ito, magkano, paano kung nasa abroad ka, at anong ID ang tanggap.",
  alternates: { canonical: "/faq" },
};

type FaqItem = { q: string; a: string; lang: string; asOf?: string };

const anchor = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function FaqPage() {
  const groups = faq.groups as { name: string; items: FaqItem[] }[];
  const all = groups.flatMap((g) => g.items);

  /** FAQPage structured data, generated from the same source as the page. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en-PH",
    mainEntity: all.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.asOf ? `As of ${formatDate(item.asOf)}: ${item.a}` : item.a,
      },
    })),
  };

  return (
    <div className="shell py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <Breadcrumbs trail={[{ label: "FAQ", href: "/faq" }]} />
          <p className="dateline mt-8 text-accent-text">FAQ</p>
          <h1 className="mt-4 max-w-[14ch]">Frequently asked questions</h1>
          <BrassRule width="w-28" animate={false} className="mt-7" />
          <p className="lede mt-6 max-w-[46rem]">
            {all.length} questions, grouped by theme, phrased the way people actually ask them.
            Answers are given in the language of the question.
          </p>
        </header>

        {/* The index lives in the margin — and inlines above the answers on mobile. */}
        <aside className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="FAQ sections">
            <p className="dateline">Sections</p>
            <ol className="mt-3 space-y-2.5">
              {groups.map((g, i) => (
                <li key={g.name}>
                  <a
                    href={`#${anchor(g.name)}`}
                    className="pressable inline-flex items-baseline gap-2 no-underline hover:underline"
                  >
                    <LedgerNumber value={i + 1} />
                    <span className="text-ink">{g.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div aria-hidden className="hair-rule my-5" />

          <LastReviewed date={asOf.iso} />

          <div aria-hidden className="hair-rule my-5" />

          <SourceList
            sources={officialSources}
            className="border-0 bg-transparent p-0 text-left"
          />
        </aside>

        <div className="broadsheet-text">
          <StatusBanner className="mb-12" compact />

          {groups.map((g, i) => (
            <section key={g.name} className={i === 0 ? undefined : "mt-16"}>
              <div aria-hidden className="hair-rule mb-5" />
              <div className="mb-6 flex items-baseline gap-3">
                <LedgerNumber value={i + 1} />
                <h2 id={anchor(g.name)} className="text-[1.75rem] sm:text-[2rem]">
                  {g.name}
                </h2>
              </div>
              <FaqAccordion
                items={g.items.map((item) => ({
                  q: item.q,
                  lang: item.lang === "tl" ? ("tl" as const) : ("en" as const),
                  a: (
                    <>
                      {item.asOf && (
                        <p className="dateline text-accent-text">
                          As of {formatDate(item.asOf)}
                        </p>
                      )}
                      <p>{item.a}</p>
                    </>
                  ),
                }))}
              />
            </section>
          ))}

          {/* The disclaimer closes every page. Non-negotiable. */}
          <div className="mt-16">
            <div aria-hidden className="hair-rule mb-6" />
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
