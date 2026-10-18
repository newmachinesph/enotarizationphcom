import type { ReactNode } from "react";
import { BrassRule } from "@/components/marks/Ledger";
import { Seal } from "@/components/marks/Seal";
import { Disclaimer } from "@/components/ui/Callout";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Shared shell for the four tool routes: breadcrumb, header, optional
 * pre-tool notice, the tool, then the disclaimer.
 *
 * `wide` opts out of the reading column for tools that need the full
 * container (the cost estimator is a two-up layout).
 */
export function ToolPageLayout({
  title,
  intro,
  slug,
  crumb,
  notice,
  wide = false,
  disclaimerClassName,
  children,
}: {
  title: string;
  intro: ReactNode;
  slug: string;
  crumb: string;
  notice?: ReactNode;
  wide?: boolean;
  disclaimerClassName?: string;
  children: ReactNode;
}) {
  const body = (
    <>
      <PageHeader
        eyebrow="Tool"
        title={title}
        intro={intro}
        trail={[
          { label: "Tools", href: "/tools" },
          { label: crumb, href: slug },
        ]}
      />
      {notice}
      {children}
      {/* The record closes with its seal. Decorative, and never printed —
          a printed checklist should not spend ink on a mark. */}
      <div aria-hidden className="no-print mt-10 flex items-center gap-4">
        <Seal size={24} />
        <BrassRule width="flex-1" />
      </div>
      <Disclaimer className={disclaimerClassName ?? "mt-8"} />
    </>
  );

  return (
    <div className="shell py-10 sm:py-14">
      {wide ? body : <div className="prose-shell">{body}</div>}
    </div>
  );
}
