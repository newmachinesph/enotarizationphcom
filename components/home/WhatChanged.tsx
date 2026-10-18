import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";

const CARDS = [
  {
    k: "The old way",
    t: "Travel, queue, repeat",
    b: "Find a notary in the right city — traditional commissions are territorial — take time off work, queue, and come back if something is wrong.",
  },
  {
    k: "What the Supreme Court did",
    t: "A.M. No. 24-10-14-SC",
    b: "The Rules on Electronic Notarization took effect on 24 March 2025, creating a commissioned Electronic Notary Public who can serve principals anywhere in the Philippines, working on PDFs.",
  },
  {
    k: "What you can do now",
    t: "In person or on video",
    b: "Notarize a PDF by appearing in person (IEN) or by live video (REN) — with the honest caveat that the rollout is staged and no public list of e-notaries has been published yet.",
  },
];

/** 01 — the three-deck. Ruled columns, not cards: the rules do the dividing. */
export function WhatChanged() {
  return (
    <section className="shell py-16 sm:py-20 lg:py-24">
      <div className="broadsheet reveal">
        <div className="broadsheet-rail">
          <LedgerNumber value={1} className="block" />
        </div>

        <div className="broadsheet-text">
          <h2>What changed</h2>
          <BrassRule className="mt-5" />
          <p className="lede mt-5">Three things, in the order they matter to you.</p>
        </div>

        <div className="broadsheet-wide mt-12 lg:mt-14">
          <div aria-hidden className="hair-rule" />
          <div className="grid md:grid-cols-3">
            {CARDS.map((c) => (
              <article
                key={c.k}
                className="border-b border-line py-7 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:py-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <p className="dateline text-accent-text">{c.k}</p>
                <h3 className="mt-4">{c.t}</h3>
                <p className="article mt-3 text-[1.0625rem] text-muted">{c.b}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
