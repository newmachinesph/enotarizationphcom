import { cn } from "@/lib/utils";

/**
 * The small uppercase tag on tracker entries. Was inlined in two routes.
 *
 * Squared on purpose: `rounded-full` in this system is reserved for status,
 * where a pill reads as a live state. A category is filing metadata, so it is
 * set as a ledger tag — the `.dateline` mono micro-label in brass, boxed by a
 * hairline.
 */
export function CategoryChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "dateline inline-flex items-center border border-line px-1.5 py-0.5 text-accent-text",
        className,
      )}
    >
      {label}
    </span>
  );
}
