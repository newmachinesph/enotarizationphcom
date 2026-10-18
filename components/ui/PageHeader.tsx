import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href: string };

/**
 * The filing path. Set in mono because it reads as a record locator, not as
 * navigation chrome.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  if (trail.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[0.75rem] tracking-[0.03em]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
        <li>
          <Link href="/" className="no-underline hover:underline">
            Home
          </Link>
        </li>
        {trail.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span aria-hidden className="text-line-strong">
              /
            </span>
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="no-underline hover:underline">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The masthead of every page: dateline, Instrument Serif title, brass rule,
 * lede. Structure comes from the rule and the space around it — there is no
 * box here and there should never be one.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  trail,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  trail?: Crumb[];
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("pb-8", className)}>
      {trail && <Breadcrumbs trail={trail} />}
      {eyebrow && <p className={cn("dateline text-accent-text", trail ? "mt-6" : "")}>{eyebrow}</p>}
      <h1 className={cn(eyebrow ? "mt-3" : "mt-6")}>{title}</h1>
      <div aria-hidden className="brass-rule rule-reveal mt-6 w-24" />
      {intro && <div className="lede mt-6 max-w-[42rem] [&>*+*]:mt-3">{intro}</div>}
      {children}
    </header>
  );
}

/** Section head: title, brass rule, optional lede. Mirrors the masthead. */
export function SectionHeading({
  title,
  sub,
  id,
  className,
}: {
  title: string;
  sub?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      <h2 id={id}>{title}</h2>
      <div aria-hidden className="brass-rule rule-reveal mt-4 w-16" />
      {sub && <p className="lede mt-4 max-w-[40rem]">{sub}</p>}
    </div>
  );
}
