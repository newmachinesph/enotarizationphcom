"use client";

import { useMemo, useState } from "react";
import {
  estimate,
  type CityTier,
  type CostAnswers,
  type CostDocKind,
  type Mode,
} from "@/content/logic/cost";
import { BrassRule } from "@/components/marks/Ledger";
import { track } from "@/lib/analytics";
import { cn, pesoRange } from "@/lib/utils";
import { ToolFrame } from "./ToolShell";

const DOCS: { v: CostDocKind; l: string }[] = [
  { v: "affidavit", l: "Affidavit" },
  { v: "spa", l: "Special Power of Attorney" },
  { v: "deed", l: "Deed of sale" },
  { v: "business", l: "Business document" },
];

const MODES: { v: Mode; l: string }[] = [
  { v: "walk-in", l: "Walk-in notary" },
  { v: "e-notarization", l: "E-notarization" },
  { v: "consular", l: "Consular (abroad)" },
];

const TIERS: { v: CityTier; l: string }[] = [
  { v: "metro-manila", l: "Metro Manila" },
  { v: "other-city", l: "Other city" },
  { v: "province", l: "Province" },
];

/** Every figure on this tool sets in tabular mono — it is a ledger, not a headline. */
const FIGURE =
  "font-mono text-[2rem] leading-none tracking-[-0.02em] tabular-nums text-ink";

/**
 * Live estimator — no submit button. Every change updates the answer
 * immediately, so the tool feels like a dial rather than a form.
 */
export function CostEstimator() {
  const [a, setA] = useState<CostAnswers>({
    doc: "affidavit",
    count: 1,
    signatories: 1,
    mode: "e-notarization",
    tier: "metro-manila",
  });

  const result = useMemo(() => estimate(a), [a]);

  function update<K extends keyof CostAnswers>(key: K, value: CostAnswers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
    track("tool_completed", { tool: "cost-estimator", field: String(key) });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <ToolFrame>
        <div className="space-y-7">
          <Segmented
            label="What kind of document?"
            options={DOCS}
            value={a.doc}
            onChange={(v) => update("doc", v)}
          />
          <Segmented
            label="How will you notarize it?"
            options={MODES}
            value={a.mode}
            onChange={(v) => update("mode", v)}
          />
          {a.mode !== "consular" && (
            <Segmented
              label="Where are you?"
              options={TIERS}
              value={a.tier}
              onChange={(v) => update("tier", v)}
            />
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <Stepper
              label="Number of documents"
              value={a.count}
              min={1}
              max={20}
              onChange={(v) => update("count", v)}
            />
            <Stepper
              label="Number of signatories"
              value={a.signatories}
              min={1}
              max={10}
              onChange={(v) => update("signatories", v)}
            />
          </div>
        </div>
      </ToolFrame>

      <section aria-live="polite" className="border border-line bg-surface">
        <div aria-hidden className="h-[3px] w-full bg-accent" />
        <div className="p-5 sm:p-6">
          <h2 className="text-[1.5rem] leading-tight">{result.headline}</h2>
          <BrassRule width="w-16" animate={false} className="mt-4" />

          {result.direct && (
            <div className="mt-6 border-t border-line pt-4">
              <p className="dateline">The fee itself</p>
              <p className={cn("mt-2", FIGURE)}>
                {pesoRange(result.direct.low, result.direct.high)}
              </p>
            </div>
          )}

          {result.effective && (
            <div className="mt-5 border-l-[3px] border-accent bg-sunken px-4 py-4">
              <p className="dateline">
                Effective cost — what it really takes out of your pocket
              </p>
              <p className={cn("mt-2", FIGURE)}>
                {pesoRange(result.effective.low, result.effective.high)}
              </p>
              <p className="mt-2.5 text-fine text-muted">{result.hiddenLabel}</p>
            </div>
          )}

          <ul className="mt-6 space-y-2 border-t border-line pt-4 text-fine text-muted">
            {result.caveats.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span aria-hidden className="font-mono text-accent-text">
                  —
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-l-[3px] border-accent bg-warning-soft px-4 py-3 text-fine text-ink">
            <strong className="font-semibold">Rates vary — confirm before booking.</strong>{" "}
            Always ask for the total, including VAT and per-signatory charges, in writing.
          </p>
        </div>
      </section>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: T; l: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-[0.9375rem] font-medium text-ink">{label}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            aria-pressed={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              "pressable min-h-11 border px-4 text-[0.9375rem]",
              value === o.v
                ? "border-inverse bg-inverse font-medium text-on-inverse"
                : "border-line-strong bg-surface text-ink hover:bg-sunken",
            )}
          >
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div>
      <p className="text-[0.9375rem] font-medium text-ink" id={`lbl-${id}`}>
        {label}
      </p>
      <div className="mt-2.5 inline-flex items-stretch divide-x divide-line-strong border border-line-strong bg-surface">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="pressable grid size-11 place-items-center text-lg text-ink hover:bg-sunken disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span className="sr-only">Decrease {label}</span>
          <span aria-hidden>−</span>
        </button>
        <output
          aria-labelledby={`lbl-${id}`}
          className="grid w-14 place-items-center font-mono text-base tabular-nums text-ink"
        >
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="pressable grid size-11 place-items-center text-lg text-ink hover:bg-sunken disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span className="sr-only">Increase {label}</span>
          <span aria-hidden>+</span>
        </button>
      </div>
    </div>
  );
}
