import Link from "next/link";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const TOP_QUESTIONS = [
  {
    q: "Magkano magpa-notaryo?",
    lang: "tl" as const,
    a: (
      <>
        Nagkakaiba-iba. Ang walk-in affidavit ay madalas ₱100–₱500 depende sa lungsod. May
        isang online platform na naglalathala ng ₱488 kada dokumento kasama ang VAT. Wala pang
        opisyal na fee schedule ang Korte Suprema para sa e-notarization.{" "}
        <Link href="/tools/cost-estimator">Tingnan ang cost estimator →</Link>
      </>
    ),
  },
  {
    q: "Pwede bang online na lang? Legit ba ang online notary?",
    lang: "tl" as const,
    a: (
      <>
        Legit kung sumusunod sa Rules on Electronic Notarization. Kailangan may hiwalay na
        e-notary commission ang abogado, at accredited ang platform. May tatlo nang accredited
        na platform: Twala, QLegal at NotarizeIT.{" "}
        <Link href="/learn/what-is-e-notarization">Basahin ang buong paliwanag →</Link>
      </>
    ),
  },
  {
    q: "Nasa abroad ako — paano ang SPA ko?",
    lang: "tl" as const,
    a: (
      <>
        Hindi ka pwedeng mag-e-notaryo mula sa bahay mo sa abroad. Kailangan nasa Pilipinas ang
        lahat, maliban kung nasa loob ka mismo ng Philippine embassy o consulate. May tatlong
        totoong ruta ka. <Link href="/guides/ofw">Basahin ang OFW guide →</Link>
      </>
    ),
  },
  {
    q: "Lahat ba ng abogado pwedeng mag-notaryo?",
    lang: "tl" as const,
    a: (
      <>
        Hindi. Kailangan ng commission — at para sa electronic notarization, hiwalay pang
        commission ito. <Link href="/learn/glossary">Tingnan ang glossary →</Link>
      </>
    ),
  },
  {
    q: "Tatanggapin ba ng LTO, bangko o Pag-IBIG ang e-notarized?",
    a: (
      <>
        Legally it has the same force as traditional notarization. In practice, most agencies
        have not announced a position yet. We track every announcement as it happens.{" "}
        <Link href="/tracker">See the acceptance tracker →</Link>
      </>
    ),
  },
];

/** 04 — the questions, kept to the reading measure of the text column. */
export function TopQuestions() {
  return (
    <section className="border-y border-line bg-sunken py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="broadsheet reveal">
          <div className="broadsheet-rail">
            <LedgerNumber value={4} className="block" />
          </div>

          <div className="broadsheet-text">
            <h2>Top questions</h2>
            <BrassRule className="mt-5" />
            <p className="lede mt-5">
              The questions Filipinos actually ask, answered in the language they ask them in.
            </p>
          </div>

          <div className="broadsheet-text mt-10 lg:mt-12">
            <FaqAccordion items={TOP_QUESTIONS} />
            <p className="mt-7">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center text-[0.8125rem] uppercase tracking-[0.12em] text-accent-text no-underline hover:underline"
              >
                All 40 questions →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
