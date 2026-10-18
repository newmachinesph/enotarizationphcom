"use client";

import { useMemo, useState } from "react";
import {
  composeChecklist,
  type ChecklistAnswers,
  type ChecklistDoc,
  type Party,
  type SessionMode,
} from "@/content/logic/readiness";
import { BrassRule } from "@/components/marks/Ledger";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { PRIMARY_ACTION, ToolFrame } from "./ToolShell";

const MODES: { v: SessionMode; l: string; h: string }[] = [
  { v: "ren", l: "By video (REN)", h: "Remote electronic notarization" },
  { v: "ien", l: "In person (IEN)", h: "You appear, document is electronic" },
];

const DOCS: { v: ChecklistDoc; l: string; h: string }[] = [
  { v: "jurat", l: "Jurat", h: "Swearing the contents are true" },
  { v: "acknowledgment", l: "Acknowledgment", h: "Confirming the signature is yours" },
  /* The fourth notarial act, Rule IV Sec. 4. Like a jurat it needs a live
     signature in the e-notary's view, so omitting it here sent anyone who
     needed it to "acknowledgment" — and told them a pre-signed document was
     fine, which is exactly the mistake that ends a session. */
  {
    v: "signature-witnessing",
    l: "Signature witnessing",
    h: "The notary just watches you sign — no oath",
  },
  { v: "unsure", l: "Not sure yet", h: "We'll give you the safe version" },
];

const PARTIES: { v: Party; l: string; h: string }[] = [
  { v: "just-me", l: "Just me", h: "One signatory" },
  { v: "with-witnesses", l: "Me plus witnesses", h: "Witnesses join the session" },
  { v: "multiple-signatories", l: "Several signatories", h: "More than one person signs" },
];

export function ReadinessChecklist() {
  const [a, setA] = useState<ChecklistAnswers>({
    mode: "ren",
    doc: "unsure",
    party: "just-me",
  });
  const [done, setDone] = useState<Record<string, boolean>>({});

  const items = useMemo(() => composeChecklist(a), [a]);
  const completed = items.filter((i) => done[i.id]).length;

  function update<K extends keyof ChecklistAnswers>(key: K, value: ChecklistAnswers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
    setDone({});
  }

  return (
    <div className="space-y-6">
      <ToolFrame>
        <div className="space-y-7">
          <Choice
            label="How will the session happen?"
            options={MODES}
            value={a.mode}
            onChange={(v) => update("mode", v)}
          />
          <Choice
            label="What does the document need?"
            options={DOCS}
            value={a.doc}
            onChange={(v) => update("doc", v)}
          />
          <Choice
            label="Who is joining?"
            options={PARTIES}
            value={a.party}
            onChange={(v) => update("party", v)}
          />
        </div>
      </ToolFrame>

      <section className="border border-line bg-surface">
        <div aria-hidden className="h-[3px] w-full bg-accent" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[1.5rem] leading-tight">Your checklist</h2>
            <p aria-live="polite" className="dateline">
              {completed} of {items.length} ready
            </p>
          </div>
          <BrassRule width="w-16" animate={false} className="mt-4" />

          {/* The register: a ledger numeral in the margin, one ruled row per item. */}
          <ul className="mt-6 border-t border-line">
            {items.map((item, i) => (
              <li
                key={item.id}
                className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line py-3 sm:grid-cols-[2.5rem_1fr]"
              >
                <span aria-hidden className="ledger-num pt-2.5 text-right">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1">
                    <input
                      type="checkbox"
                      checked={Boolean(done[item.id])}
                      onChange={(e) =>
                        setDone((d) => ({ ...d, [item.id]: e.target.checked }))
                      }
                      className="mt-0.5 size-5 shrink-0 accent-[var(--civic-600)]"
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block font-medium text-ink",
                          done[item.id] && "text-muted line-through",
                        )}
                      >
                        {item.line}
                      </span>
                      {item.critical && (
                        <span className="mt-1.5 inline-block rounded-full bg-warning-soft px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-warning">
                          Most people get this wrong
                        </span>
                      )}
                    </span>
                  </label>
                  <details className="mt-1 pl-8">
                    <summary className="cursor-pointer text-fine text-link">
                      Why this matters
                    </summary>
                    <p className="mt-1.5 border-l-[3px] border-accent pl-3 text-fine leading-relaxed text-muted">
                      {item.why}
                    </p>
                  </details>
                </div>
              </li>
            ))}
          </ul>

          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                track("checklist_printed", { mode: a.mode, party: a.party });
                window.print();
              }}
              className={PRIMARY_ACTION}
            >
              Print this checklist
            </button>
            <button
              type="button"
              onClick={() => setDone({})}
              className="pressable inline-flex min-h-11 items-center border border-line-strong bg-surface px-4 text-[0.9375rem] text-ink hover:bg-sunken"
            >
              Clear ticks
            </button>
          </div>

          <p className="mt-6 border-t border-line pt-4 text-fine text-muted">
            Send this to anyone else joining your session — every person needs their own ID
            and their own account. General legal information only — not legal advice.
          </p>
        </div>
      </section>
    </div>
  );
}

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { v: T; l: string; h: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="text-[0.9375rem] font-medium text-ink">{label}</legend>
      <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
        {options.map((o) => {
          const on = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(o.v)}
              className={cn(
                "pressable min-h-11 border p-3 text-left",
                on
                  ? "border-inverse bg-inverse"
                  : "border-line-strong bg-surface hover:bg-sunken",
              )}
            >
              <span
                className={cn(
                  "block font-medium",
                  on ? "text-on-inverse" : "text-ink",
                )}
              >
                {o.l}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-fine",
                  on ? "text-on-inverse-muted" : "text-muted",
                )}
              >
                {o.h}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
