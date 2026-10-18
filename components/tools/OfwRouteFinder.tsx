"use client";

import Link from "next/link";
import { useState } from "react";
import {
  findRoute,
  type OfwAnswers,
  type OfwResult,
  type Route,
} from "@/content/logic/ofw-routes";
import { BrassRule } from "@/components/marks/Ledger";
import { track } from "@/lib/analytics";
import {
  BasisNote,
  OptionButton,
  PRIMARY_ACTION,
  QuestionCard,
  ResultHeading,
  ResultScreen,
  ToolFrame,
  ToolNav,
  ToolProgress,
} from "./ToolShell";

const STEPS = 5;

export function OfwRouteFinder() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Partial<OfwAnswers>>({});
  const [result, setResult] = useState<OfwResult | null>(null);

  function set<K extends keyof OfwAnswers>(key: K, value: OfwAnswers[K]) {
    const next = { ...a, [key]: value };
    setA(next);
    if (step === 0) track("tool_started", { tool: "ofw-route-finder" });
    if (step === STEPS - 1) {
      const r = findRoute(next as OfwAnswers);
      setResult(r);
      track("tool_completed", { tool: "ofw-route-finder", outcome: r.primary.id });
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setA({});
    setResult(null);
  }

  if (result) {
    return (
      <ResultScreen
        tone={result.primary.id === "ren-at-post" ? "caution" : "reroute"}
        title={`Your best route: ${result.primary.name}`}
        onRestart={restart}
      >
        <p className="article">{result.primary.oneLiner}</p>
        <RouteDetail route={result.primary} open />

        {result.alternates.length > 0 && (
          <div>
            <ResultHeading>Other routes worth knowing</ResultHeading>
            <div className="mt-3 space-y-3">
              {result.alternates.map((r) => (
                <RouteDetail key={r.id} route={r} />
              ))}
            </div>
          </div>
        )}

        <BasisNote>
          <strong className="font-semibold text-ink">Matrix row used:</strong>{" "}
          {result.matrixRow}. The full decision matrix is published on the{" "}
          <Link href="/guides/ofw">OFW guide</Link> so you can audit this recommendation.
        </BasisNote>

        <p className="text-fine text-muted">
          General legal information only — not legal advice. For your specific case, consult
          a Philippine lawyer or notary public.
        </p>
      </ResultScreen>
    );
  }

  return (
    <ToolFrame>
      <ToolProgress step={step + 1} total={STEPS} className="mb-7" />

      {step === 0 && (
        <div>
          <label
            htmlFor="ofw-place"
            className="block font-display text-[1.5rem] leading-[1.12] text-ink"
          >
            Where are you right now?
          </label>
          <p className="mt-2 text-[0.9375rem] text-muted">
            City and country. We use this only to shape the wording — nothing is sent
            anywhere.
          </p>
          <BrassRule width="w-16" animate={false} className="mt-4" />
          <input
            id="ofw-place"
            type="text"
            value={a.place ?? ""}
            onChange={(e) => setA({ ...a, place: e.target.value })}
            placeholder="e.g. Dubai, United Arab Emirates"
            className="mt-5 min-h-11 w-full border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted"
          />
          <ToolNav>
            <button
              type="button"
              onClick={() => set("place", a.place?.trim() || "abroad")}
              className={PRIMARY_ACTION}
            >
              Continue
            </button>
          </ToolNav>
        </div>
      )}

      {step === 1 && (
        <QuestionCard label="What document do you need?" help="Pick the closest match.">
          {[
            { v: "spa", l: "Special Power of Attorney (SPA)", h: "The most common OFW document" },
            { v: "affidavit", l: "Affidavit", h: "Loss, support, sworn statement" },
            {
              v: "consent-to-travel",
              l: "Affidavit of consent to travel",
              h: "For a child travelling without you",
            },
            { v: "deed", l: "Deed of sale", h: "Vehicle, land or other property" },
            { v: "other", l: "Something else", h: "We'll give general guidance" },
          ].map((o) => (
            <OptionButton
              key={o.v}
              label={o.l}
              hint={o.h}
              selected={a.doc === o.v}
              onClick={() => set("doc", o.v as OfwAnswers["doc"])}
            />
          ))}
        </QuestionCard>
      )}

      {step === 2 && (
        <QuestionCard
          label="How soon do you need it?"
          help="Be realistic — appointments take time."
        >
          {[
            { v: "urgent", l: "Within a week", h: "Something is waiting on it" },
            { v: "weeks", l: "Within a month", h: "There's a deadline but some room" },
            { v: "flexible", l: "No fixed deadline", h: "I want to do it properly" },
          ].map((o) => (
            <OptionButton
              key={o.v}
              label={o.l}
              hint={o.h}
              selected={a.urgency === o.v}
              onClick={() => set("urgency", o.v as OfwAnswers["urgency"])}
            />
          ))}
        </QuestionCard>
      )}

      {step === 3 && (
        <QuestionCard
          label="Can you get to a Philippine embassy or consulate?"
          help="Include Honorary Consuls. Think about distance, cost and whether you can get leave."
        >
          {[
            { v: "yes", l: "Yes, I can travel there", h: "It's reachable in a day" },
            { v: "hard", l: "It's hard but possible", h: "Far, expensive, or hard to get leave" },
            { v: "no", l: "No, not realistically", h: "Too far, or there is no post near me" },
          ].map((o) => (
            <OptionButton
              key={o.v}
              label={o.l}
              hint={o.h}
              selected={a.reach === o.v}
              onClick={() => set("reach", o.v as OfwAnswers["reach"])}
            />
          ))}
        </QuestionCard>
      )}

      {step === 4 && (
        <QuestionCard
          label="Where will the document be used?"
          help="This decides whether an apostille helps you or just costs you money."
        >
          {[
            {
              v: "in-ph",
              l: "In the Philippines",
              h: "A bank, agency, registry or family member back home",
            },
            {
              v: "abroad",
              l: "In the country I'm in now",
              h: "A local employer, school or authority",
            },
          ].map((o) => (
            <OptionButton
              key={o.v}
              label={o.l}
              hint={o.h}
              selected={a.usedWhere === o.v}
              onClick={() => set("usedWhere", o.v as OfwAnswers["usedWhere"])}
            />
          ))}
        </QuestionCard>
      )}

      {step > 0 && <ToolNav onBack={() => setStep(step - 1)} />}
    </ToolFrame>
  );
}

function RouteDetail({ route, open = false }: { route: Route; open?: boolean }) {
  return (
    <details open={open} className="border border-line bg-sunken">
      <summary className="min-h-11 cursor-pointer px-4 py-3 font-medium text-ink">
        {route.name}
      </summary>
      <div className="space-y-4 border-t border-line px-4 py-4 text-[0.9375rem]">
        {!open && <p>{route.oneLiner}</p>}

        <div>
          <h4 className="dateline">Steps</h4>
          <ol className="mt-2 list-decimal space-y-1.5 pl-6 marker:font-mono marker:text-accent-text">
            {route.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3 border-y border-line py-3 sm:grid-cols-2">
          <p>
            <strong className="font-semibold">Typical cost:</strong>{" "}
            <span className="font-mono tabular-nums">{route.cost}</span>
          </p>
          <p>
            <strong className="font-semibold">Typical timeline:</strong>{" "}
            <span className="font-mono tabular-nums">{route.timeline}</span>
          </p>
        </div>

        <div>
          <h4 className="dateline">What to bring</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-6 marker:text-accent-text">
            {route.bring.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        {route.caveat && (
          <p className="border-l-[3px] border-accent bg-warning-soft px-3.5 py-2.5 text-ink">
            {route.caveat}
          </p>
        )}

        <p className="border-l-[3px] border-danger bg-danger-soft px-3.5 py-2.5 text-ink">
          <strong className="font-semibold">Scam warning:</strong> {route.scamWarning}
        </p>
      </div>
    </details>
  );
}
