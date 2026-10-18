import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Column = { key: string; label: string; width?: string };
export type Row = { id: string } & Record<string, ReactNode>;

/**
 * SIGNATURE COMPONENT — comparison table with a mobile card-collapse.
 *
 * One semantic <table> in the DOM at every breakpoint (screen readers and
 * copy-paste both keep working). Below md, rows restyle into stacked entries
 * and each cell grows its own label from `data-label`.
 *
 * Set as a broadsheet table: mono uppercase column heads, a 2px rule under the
 * header row, hairlines between rows, and no zebra fill — the alignment does
 * the work that a fill would otherwise be covering for.
 */
export function ComparisonTable({
  caption,
  columns,
  rows,
  className,
}: {
  caption: string;
  columns: Column[];
  rows: Row[];
  className?: string;
}) {
  return (
    <div className={cn("scroll-x -mx-1 px-1", className)}>
      <table className="w-full border-collapse text-[0.9375rem] tabular-nums max-md:block">
        <caption className="mb-4 text-left text-fine text-muted">{caption}</caption>
        <thead className="max-md:sr-only">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  "border-b-2 border-ink bg-transparent px-3 pb-2.5 text-left align-bottom",
                  "font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-ink",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-md:block">
          {rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "align-top",
                "max-md:mb-6 max-md:block max-md:border-t-2 max-md:border-line-strong",
                "max-md:pt-3 max-md:last:mb-0",
              )}
            >
              {columns.map((c, ci) => (
                <td
                  key={c.key}
                  data-label={c.label}
                  className={cn(
                    "border-b border-line px-3 py-3.5",
                    // Mobile: label grown from the column header, value beneath it.
                    "max-md:flex max-md:flex-col max-md:gap-1 max-md:border-0 max-md:px-0 max-md:py-2",
                    "max-md:before:content-[attr(data-label)] max-md:before:font-mono",
                    "max-md:before:text-[0.625rem] max-md:before:font-medium max-md:before:uppercase",
                    "max-md:before:tracking-[0.14em] max-md:before:text-muted",
                    ci === 0 &&
                      "font-medium text-ink max-md:pt-0 max-md:text-[1.0625rem] max-md:before:hidden",
                  )}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
