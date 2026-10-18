import type { Metadata } from "next";
import Link from "next/link";
import { LedgerNumber } from "@/components/marks/Ledger";
import { Callout } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Apat na tools, walang sign-up",
  description:
    "Check kung pwedeng i-notaryo online ang dokumento mo, hanapin ang ruta kung nasa abroad ka, tantiyahin ang gastos, at gumawa ng checklist. Sa browser mo lang.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/can-it-be-e-notarized",
    title: "Can it be e-notarized?",
    sub: "Four questions about your document, your location and the act you need. One clear answer with your next steps.",
  },
  {
    href: "/tools/ofw-route-finder",
    title: "OFW route finder",
    sub: "You are abroad and need a document notarized. This finds the route that actually works — with costs, timelines and scam warnings.",
  },
  {
    href: "/tools/cost-estimator",
    title: "Cost estimator",
    sub: "Ranges, not fake precision — including the effective cost once travel and time off work are counted.",
  },
  {
    href: "/tools/readiness-checklist",
    title: "Readiness checklist",
    sub: "A printable checklist composed for your mode, your document and who is joining.",
  },
];

export default function ToolsHub() {
  return (
    <div className="shell py-10 sm:py-14">
      <PageHeader
        eyebrow="Tools"
        title="Four tools, no sign-up, nothing sent anywhere"
        intro={
          <p>
            Everything runs in your browser. We do not collect your answers, and every tool
            shows you the rule it used to reach its answer.
          </p>
        }
        trail={[{ label: "Tools", href: "/tools" }]}
      />

      {/* The index of tools, set as a ruled register rather than a card stack. */}
      <ol className="mt-4 border-t border-line-strong">
        {TOOLS.map((t, i) => (
          <li key={t.href} className="border-b border-line">
            <Link
              href={t.href}
              className="pressable grid gap-x-6 gap-y-1 py-6 no-underline sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-baseline"
            >
              {/* The <ol> already conveys order to assistive tech, so the
                  stamped numeral is decorative here. */}
              <span aria-hidden>
                <LedgerNumber value={i + 1} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.625rem] leading-[1.1] text-ink">
                  {t.title}
                </span>
                <span className="mt-2 block max-w-[46rem] text-[0.9375rem] leading-relaxed text-muted">
                  {t.sub}
                </span>
              </span>
              <span
                aria-hidden
                className="mt-2 block text-fine font-medium text-link sm:mt-0"
              >
                Open →
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Callout tone="neutral" title="How these tools decide" className="mt-10">
        <p>
          None of these tools is a black box, and none of them guesses. Each one runs a fixed
          set of rules taken from the Rules on Electronic Notarization, and each result tells
          you which rule produced it — the eligibility checker names the Section, the route
          finder prints the matrix row it matched.
        </p>
        <p>
          What each tool actually checks:
        </p>
        <ul className="list-disc space-y-1 pl-5 marker:text-accent-text">
          <li>
            <strong>Can it be e-notarized?</strong> — document type against the exclusions in
            Rule I, Sec. 5; where the signatories are, against Rule III, Sec. 2(c) and Rule IV,
            Sec. 5; and whether the act is a jurat, under Rule IV, Sec. 3.
          </li>
          <li>
            <strong>OFW route finder</strong> — how reachable a Philippine post is, and where
            the document will be used. The full matrix is published on the{" "}
            <Link href="/guides/ofw">OFW guide</Link>.
          </li>
          <li>
            <strong>Cost estimator</strong> — observed market ranges by document, mode and city
            tier. Ranges only, because no Supreme Court fee guide has been published.
          </li>
          <li>
            <strong>Readiness checklist</strong> — composed from your mode, your notarial act
            and who is joining, against the requirements in Rule VII, Sec. 2.
          </li>
        </ul>
        <p>
          Found a rule we got wrong? Email hello@enotarizationph.com and we will fix it and date
          the change.
        </p>
      </Callout>
    </div>
  );
}
