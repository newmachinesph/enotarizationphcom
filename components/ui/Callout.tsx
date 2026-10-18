import type { ReactNode } from "react";
import { DISCLAIMER, NOT_A_PROVIDER } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger" | "neutral";

/**
 * An aside in a broadsheet is set off by a rule, not by a floating card. Each
 * tone is a 3px bar in the margin — the same weight as the brass rule — over a
 * barely-there tint, squared off, no shadow.
 *
 * The glyph is drawn IN the tone colour rather than reversed out of it: the
 * night edition lightens every semantic colour, so white-on-tone passes in one
 * edition and fails in the other. Tone-on-tint passes in both.
 */
const TONES: Record<Tone, { wrap: string; bar: string; mark: string; icon: string }> = {
  info: {
    wrap: "border-info/30 bg-info-soft",
    bar: "bg-info",
    mark: "text-info",
    icon: "i",
  },
  success: {
    wrap: "border-success/30 bg-success-soft",
    bar: "bg-success",
    mark: "text-success",
    icon: "✓",
  },
  warning: {
    wrap: "border-warning/35 bg-warning-soft",
    bar: "bg-warning",
    mark: "text-warning",
    icon: "!",
  },
  danger: {
    wrap: "border-danger/30 bg-danger-soft",
    bar: "bg-danger",
    mark: "text-danger",
    icon: "✕",
  },
  neutral: {
    wrap: "border-line bg-sunken",
    bar: "bg-line-strong",
    mark: "text-muted",
    icon: "•",
  },
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div
      className={cn(
        "relative border py-4 pl-5 pr-4 sm:pl-6 sm:pr-5",
        t.wrap,
        className,
      )}
    >
      {/* The margin bar sits at --rule-brass weight, on the border, not inside it. */}
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[3px]", t.bar)} />

      {title && (
        <p className="mb-2 flex items-baseline gap-2.5">
          <span
            aria-hidden
            className={cn(
              "shrink-0 font-mono text-[0.8125rem] leading-none",
              t.mark,
            )}
          >
            {t.icon}
          </span>
          {/* Instrument Serif ships weight 400 only — size carries the emphasis. */}
          <span className="font-display text-[1.1875rem] leading-tight text-ink">
            {title}
          </span>
        </p>
      )}

      <div className="text-[0.9375rem] leading-relaxed text-ink [&>*+*]:mt-2">
        {children}
      </div>
    </div>
  );
}

/**
 * The disclaimer that must close every page. One component, one wording.
 *
 * Set as a colophon: a brass rule, then the fine print. It is the last thing
 * on the page and it should read like the last thing on the page.
 */
export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn("border border-line bg-sunken px-4 py-4 text-fine text-muted", className)}
    >
      <div aria-hidden className="brass-rule w-12" />
      <p className="mt-3.5">
        <strong className="font-semibold text-ink">We are not a provider.</strong>{" "}
        {NOT_A_PROVIDER}
      </p>
      <p className="mt-2">
        <strong className="font-semibold text-ink">Not legal advice.</strong> {DISCLAIMER}
      </p>
    </div>
  );
}
