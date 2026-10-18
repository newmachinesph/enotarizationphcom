import Image from "next/image";
import Link from "next/link";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";

const POINTS = [
  "We are an educational website, not a notarization provider — we cannot notarize anything for you, and we never ask you for a document.",
  "Every legal claim traces to the Rules themselves or to an official Supreme Court page.",
  "No provider affiliations, no paid placement, no affiliate income — ever.",
  "A visible last-reviewed date on every page, and an honest status strip on anything time-sensitive.",
  "Where nobody has announced anything yet, we publish that absence rather than implying an answer.",
];

/** 03 — the standing declarations, numbered like clauses. */
export function TrustBand() {
  return (
    <section className="shell py-16 sm:py-20 lg:py-24">
      <div className="broadsheet reveal">
        <div className="broadsheet-rail">
          <LedgerNumber value={3} className="block" />
        </div>

        <div className="broadsheet-text">
          <h2>Why believe us</h2>
          <BrassRule className="mt-5" />
          <p className="lede mt-5">
            We are not selling you anything. Here is how to check that.
          </p>
        </div>

        <div className="broadsheet-wide mt-12 grid gap-x-12 gap-y-10 lg:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ul className="border-t border-line">
              {POINTS.map((t, i) => (
                <li
                  key={t}
                  className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line py-5 sm:grid-cols-[2.75rem_1fr] sm:gap-x-4"
                >
                  <span aria-hidden className="ledger-num pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="article text-[1.0625rem]">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7">
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center text-[0.8125rem] uppercase tracking-[0.12em] text-accent-text no-underline hover:underline"
              >
                Read our editorial policy →
              </Link>
            </p>
          </div>

          <div className="lg:col-span-5">
            <BrassRule width="w-full" />
            <Image
              src="/images/security-trust.png"
              alt="A digital document behind layered translucent shields, with fingerprint, padlock and QR-code motifs."
              width={1024}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="aspect-square w-full border-x border-b border-line bg-sunken object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
