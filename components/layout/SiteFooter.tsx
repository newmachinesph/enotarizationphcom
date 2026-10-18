import Link from "next/link";
import { Seal } from "@/components/marks/Seal";
import { asOf, brand, DISCLAIMER, footerNav, officialSources } from "@/lib/brand";

/**
 * The colophon.
 *
 * Set on the inverse surface — navy in the day edition, bone at night — as the
 * back page of the record: the seal, the imprint, a ruled index of every
 * section, the sources the whole site is built on, and the standing notice
 * that we are not a provider.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-inverse text-on-inverse">
      <div className="shell py-14 lg:py-20">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          {/* Imprint */}
          <div className="lg:col-span-4">
            <Seal size={68} color="var(--accent-on-inverse)" />
            <p className="mt-6 font-display text-[1.625rem] leading-none tracking-[-0.015em]">
              {brand.name}
            </p>
            <div aria-hidden className="brass-rule rule-reveal mt-4 w-20" />
            <p className="article mt-5 max-w-xs text-[1.0625rem] text-on-inverse-muted">
              {brand.description}
            </p>
          </div>

          {/* The index */}
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="dateline text-accent-on-inverse">{group.heading}</h2>
                <ul className="mt-3 border-t border-on-inverse/15">
                  {group.links.map((l) => (
                    <li key={l.href} className="border-b border-on-inverse/15">
                      <Link
                        href={l.href}
                        className="pressable flex min-h-11 items-center text-[0.875rem] text-on-inverse no-underline hover:text-accent-on-inverse"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-6 border-t border-on-inverse/20 pt-8 lg:grid-cols-12">
          <h2 className="dateline text-accent-on-inverse lg:col-span-3">Official sources</h2>
          {/* One source per row. These labels carry document numbers and long
              official titles, so columns broke them across lines and made two
              adjacent sources read as one. */}
          <ul className="border-t border-on-inverse/15 lg:col-span-9">
            {officialSources.map((s) => (
              <li key={s.href} className="border-b border-on-inverse/15">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-outbound="official"
                  className="pressable flex min-h-11 items-center py-2.5 text-[0.875rem] text-on-inverse-muted no-underline hover:text-accent-on-inverse"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-4 border-t border-on-inverse/20 pt-8 lg:grid-cols-12">
          <div aria-hidden className="brass-rule rule-reveal mt-1.5 hidden w-16 lg:col-span-3 lg:block" />
          <div className="space-y-3 text-[0.8125rem] leading-relaxed text-on-inverse-muted lg:col-span-9">
            <p>
              <strong className="font-semibold text-on-inverse">Disclaimer.</strong>{" "}
              {DISCLAIMER}
            </p>
            <p>
              {brand.name} is an independent civic education project. It is{" "}
              <strong className="font-semibold text-on-inverse">not</strong> a law firm, not a
              notary service, not an accredited e-notarization provider, and not affiliated with
              the Supreme Court of the Philippines or with any notarization platform. We cannot
              notarize a document for you.
            </p>
            <p className="pt-2 font-mono text-[0.75rem] tracking-[0.06em] tabular-nums">
              Facts on this site were last verified on{" "}
              <time dateTime={asOf.iso}>{asOf.label}</time>. ·{" "}
              <Link href="/about" className="text-accent-on-inverse">
                Editorial policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
