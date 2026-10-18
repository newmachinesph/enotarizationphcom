import Link from "next/link";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { Seal } from "@/components/marks/Seal";

/** The places people actually want when a link has gone stale. */
const DESTINATIONS = [
  { label: "Home", href: "/" },
  { label: "Your first e-notarization", href: "/guides/first-e-notarization" },
  { label: "OFW guide", href: "/guides/ofw" },
  { label: "FAQ", href: "/faq" },
];

export default function NotFound() {
  return (
    <div className="shell py-16 sm:py-24">
      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <div className="flex items-start gap-6 sm:gap-10">
            <div className="min-w-0 flex-1">
              <p className="dateline text-accent-text">Page not found</p>
              <h1 className="mt-4 max-w-[18ch]">
                {"That page isn't here — but your answer probably is"}
              </h1>
            </div>
            <Seal size={76} className="mt-2 hidden shrink-0 sm:block" />
          </div>

          <BrassRule width="w-28" animate={false} className="mt-7" />

          <p className="lede mt-6 max-w-[46rem]">
            The link may be old, or we may have moved something. Here are the places people
            usually want.
          </p>
        </header>

        <aside className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start">
          <p className="dateline">Error</p>
          <p className="mt-1.5 font-mono text-[1.75rem] leading-none tabular-nums text-ink">
            404
          </p>
        </aside>

        <div className="broadsheet-text">
          <ol className="border-t border-line-strong">
            {DESTINATIONS.map((d, i) => (
              <li key={d.href} className="border-b border-line">
                <Link
                  href={d.href}
                  className="pressable group grid grid-cols-[2rem_1fr] items-baseline gap-x-3 py-5 no-underline sm:grid-cols-[4rem_1fr] sm:gap-x-6"
                >
                  <LedgerNumber value={i + 1} />
                  <span className="font-display text-[1.375rem] leading-tight text-ink group-hover:text-accent-text sm:text-[1.5rem]">
                    {d.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-fine text-muted">
            If a link on this site is broken, please tell us at{" "}
            <Link href="/about">hello@enotarizationph.com</Link> so we can fix it.
          </p>
        </div>
      </div>
    </div>
  );
}
