import { cn } from "@/lib/utils";

/**
 * SIGNATURE COMPONENT — verification status.
 *
 * Editorial rule baked into the design: no state of this chip may read as an
 * endorsement. The strongest label available is "Reported as accredited",
 * which is a statement about what dated reporting said — not our opinion, and
 * not a claim that we have seen a government list, because none is published.
 *
 * Design note: the pill is one of only two things in this system allowed a
 * radius, because a capsule reads as a live state where a box reads as a label.
 * Every colour below is a semantic token, never a raw ramp value — the night
 * edition re-points the semantics, so hardcoding a swatch here would silently
 * break contrast in one of the two editions.
 */
export type VerificationStatus =
  | "official"
  | "self-reported"
  | "unverified"
  | "not-applicable";

const STATUS: Record<
  VerificationStatus,
  { label: string; hint: string; className: string; icon: string }
> = {
  // NOTE: the key is historical. It does NOT mean we saw an official list —
  // the Supreme Court has published no directory of accredited ENFs as of
  // 6 August 2026. It means dated, attributable reporting named the provider
  // as accredited. That is the strongest evidence we have, and the label says so.
  official: {
    label: "Reported as accredited",
    hint: "Named as an accredited ENF provider in reporting of 5 August 2026. The Supreme Court has published no directory we can check against, so ask the provider for its accreditation document.",
    className: "border-success/40 bg-success-soft text-success",
    icon: "✓",
  },
  "self-reported": {
    label: "Self-reported",
    hint: "The provider says so itself, and no reporting we have seen names it as accredited. Ask for the accreditation document before you pay.",
    className: "border-warning/45 bg-warning-soft text-warning",
    icon: "◐",
  },
  unverified: {
    label: "Unverified",
    hint: "We found no evidence either way. Treat with caution.",
    // No fill at all: absence of evidence should look like absence, not like a
    // fourth colour of judgement.
    className: "border-line-strong bg-transparent text-muted",
    icon: "?",
  },
  "not-applicable": {
    label: "Not for PH notarization",
    hint: "This service does not perform Philippine notarization at all.",
    className: "border-danger/40 bg-danger-soft text-danger",
    icon: "—",
  },
};

export function VerificationChip({
  status,
  className,
  showHint = false,
}: {
  status: VerificationStatus;
  className?: string;
  showHint?: boolean;
}) {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          // A pill that wraps reads as broken, so the label stays on one line
          // and the surrounding table scrolls instead.
          "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1",
          // Mono: a status is a stamped machine state, not a sentence.
          "font-mono text-[0.75rem] tracking-[0.01em]",
          s.className,
        )}
      >
        <span aria-hidden>{s.icon}</span>
        {s.label}
      </span>
      {showHint && <span className="text-fine text-muted">{s.hint}</span>}
    </span>
  );
}

export const VERIFICATION_STATUSES = Object.keys(STATUS) as VerificationStatus[];
export const VERIFICATION_HINTS = STATUS;
