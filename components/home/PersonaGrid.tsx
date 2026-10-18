import Link from "next/link";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { type Persona } from "@/components/ui/PersonaCard";

const PERSONAS: Persona[] = [
  {
    href: "/guides/ofw",
    label: "May SPA problem from abroad",
    sub: "The honest guide for OFWs — and why you can't notarize from your sofa",
    icon: "✈️",
  },
  {
    href: "/guides/first-e-notarization",
    label: "First time magpa-notaryo",
    sub: "Every step, from PDF to sealed document",
    icon: "🧭",
  },
  {
    href: "/tools/cost-estimator",
    label: "Comparing costs",
    sub: "Walk-in vs online vs consular — including the hidden costs",
    icon: "₱",
  },
  {
    href: "/guides/verify-a-document",
    label: "Just received an e-notarized document?",
    sub: "How to check the QR seal and the notarial book entry",
    icon: "🔍",
  },
  {
    href: "/safety",
    label: "Checking if a notary is legit",
    sub: "Seven red flags, and the one question that filters out most scams",
    icon: "🛡️",
  },
  {
    href: "/for-lawyers",
    label: "Lawyer? Become an e-notary",
    sub: "Eligibility under Rule VI, the application, and the virtual hearing",
    icon: "⚖️",
  },
];

/**
 * 02 — the index of routes.
 *
 * A ruled table of contents rather than a card grid: each situation is a row,
 * numbered in the margin, and the brass mark rides in from the left edge on
 * hover so the whole row reads as one target.
 */
export function PersonaGrid() {
  return (
    <section className="border-y border-line bg-sunken py-16 sm:py-20 lg:py-24">
      <div className="shell">
        <div className="broadsheet reveal">
          <div className="broadsheet-rail">
            <LedgerNumber value={2} className="block" />
          </div>

          <div className="broadsheet-text">
            <h2>Find your path</h2>
            <BrassRule className="mt-5" />
            <p className="lede mt-5">Pick the one that sounds like your situation.</p>
          </div>

          <ul className="broadsheet-wide mt-12 border-t border-line lg:mt-14">
            {PERSONAS.map((p, i) => (
              <li key={p.href} className="border-b border-line">
                <Link
                  href={p.href}
                  className="pressable group relative grid items-baseline gap-x-8 gap-y-1.5 py-6 pl-5 pr-2 no-underline transition-colors duration-[var(--dur-base)] hover:bg-bg sm:grid-cols-12 sm:py-7"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-accent transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)] group-hover:scale-y-100"
                  />
                  <span className="ledger-num sm:col-span-2 sm:text-right">
                    <span aria-hidden className="mr-2">
                      {p.icon}
                    </span>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[1.5rem] leading-[1.1] tracking-[-0.015em] text-ink sm:col-span-5 sm:text-[1.75rem]">
                    {p.label}
                  </span>
                  <span className="article text-[1rem] text-muted sm:col-span-4">{p.sub}</span>
                  <span
                    aria-hidden
                    className="text-accent-text transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)] group-hover:translate-x-1 sm:col-span-1 sm:text-right"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
