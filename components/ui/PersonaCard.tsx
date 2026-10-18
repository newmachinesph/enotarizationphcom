import Link from "next/link";
import { cn } from "@/lib/utils";

export type Persona = {
  href: string;
  label: string;
  sub: string;
  icon: string;
};

/**
 * SIGNATURE COMPONENT — persona doorway.
 *
 * The homepage's job is routing, not teaching. Each entry names a situation in
 * the visitor's own words ("May SPA problem from abroad") so they self-select
 * in one glance.
 *
 * Weightier than a LinkCard on purpose: a 2px ink rule across the head, the
 * situation set large in Instrument Serif. The rule fills brass on hover.
 */
export function PersonaCard({
  persona,
  className,
}: {
  persona: Persona;
  className?: string;
}) {
  return (
    <Link
      href={persona.href}
      className={cn(
        "pressable group relative flex h-full flex-col border-t-2 border-ink pt-4 pb-1 no-underline",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute -top-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent",
          "transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)]",
          "group-hover:scale-x-100",
        )}
      />
      <span aria-hidden className="text-2xl leading-none">
        {persona.icon}
      </span>
      <span className="mt-3 font-display text-[1.5rem] leading-[1.1] text-ink">
        {persona.label}
      </span>
      <span className="mt-2 text-fine text-muted">{persona.sub}</span>
      <span
        aria-hidden
        className={cn(
          "dateline mt-auto pt-5 text-accent-text",
          "transition-transform duration-[var(--dur-base)] [transition-timing-function:var(--ease-standard)]",
          "group-hover:translate-x-0.5",
        )}
      >
        Open →
      </span>
    </Link>
  );
}
