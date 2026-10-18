import Link from "next/link";
import { cn } from "@/lib/utils";

export type Source = { label: string; href: string };

/**
 * Sources block — the footnote apparatus. Every legal claim on this site
 * traces back to one of these, so it is set like one: a rule to close the
 * article, a mono dateline heading, hanging ledger numerals, and the citations
 * themselves in Newsreader.
 *
 * Outbound links are marked so the analytics helper can count them.
 */
export function SourceList({
  sources,
  title = "Sources",
  className,
}: {
  sources: readonly Source[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={cn("border-t-2 border-ink pt-4", className)}>
      <h2 className="dateline">{title}</h2>
      <ul className="mt-3 font-article text-[0.9375rem]">
        {sources.map((s, i) => (
          <li
            key={s.href}
            className={cn(
              "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 border-b border-line py-2.5",
              "last:border-b-0",
            )}
          >
            <span aria-hidden className="ledger-num pt-[0.3rem]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-outbound="official"
              className="break-words"
            >
              {s.label}
              <span aria-hidden className="ml-1 align-[0.05em] text-accent-text">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export type RelatedLink = { label: string; href: string; note?: string };

/** Cross-linking rule made physical: every page ends with the next step. */
export function RelatedLinks({
  links,
  title = "Where to go next",
  className,
}: {
  links: readonly RelatedLink[];
  title?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="dateline">{title}</h2>
      <div aria-hidden className="brass-rule rule-reveal mt-3 w-16" />
      <ul className="mt-5 grid sm:grid-cols-2 sm:gap-x-8">
        {links.map((l) => (
          <li key={l.href} className="border-t border-line">
            <Link
              href={l.href}
              className="pressable group flex h-full min-h-11 flex-col gap-1 py-4 no-underline"
            >
              <span
                className={cn(
                  "font-display text-[1.125rem] leading-[1.2] text-ink",
                  "transition-colors duration-[var(--dur-fast)] group-hover:text-accent-text",
                )}
              >
                {l.label} →
              </span>
              {l.note && <span className="text-fine text-muted">{l.note}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
