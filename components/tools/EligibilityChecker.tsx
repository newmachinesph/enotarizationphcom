"use client";

import Link from "next/link";
import { useState } from "react";
import {
  evaluate,
  QUESTIONS,
  type Answers,
  type Outcome,
} from "@/content/logic/eligibility";
import { track } from "@/lib/analytics";
import {
  BasisNote,
  OptionButton,
  QuestionCard,
  ResultHeading,
  ResultScreen,
  ToolFrame,
  ToolNav,
  ToolProgress,
} from "./ToolShell";

export function EligibilityChecker() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const question = QUESTIONS[step];

  function choose(value: string) {
    const next = { ...answers, [question.id]: value } as Partial<Answers>;
    setAnswers(next);

    if (step === 0) track("tool_started", { tool: "eligibility" });

    if (step === QUESTIONS.length - 1) {
      const result = evaluate(next as Answers);
      setOutcome(result);
      track("tool_completed", { tool: "eligibility", outcome: result.id });
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setOutcome(null);
  }

  if (outcome) {
    return (
      <ResultScreen tone={outcome.tone} title={outcome.title} onRestart={restart}>
        <p className="article">{outcome.summary}</p>

        <div>
          <ResultHeading>What to do next</ResultHeading>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-[0.9375rem] marker:font-mono marker:text-accent-text">
            {outcome.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <BasisNote>
          <strong className="font-semibold text-ink">Why:</strong> {outcome.basis}
        </BasisNote>

        <p>
          <Link href={outcome.deepLink.href} className="font-medium">
            {outcome.deepLink.label} →
          </Link>
        </p>

        <p className="text-fine text-muted">
          General legal information only — not legal advice. For your specific case, consult
          a Philippine lawyer or notary public.
        </p>
      </ResultScreen>
    );
  }

  return (
    <ToolFrame>
      <ToolProgress step={step + 1} total={QUESTIONS.length} className="mb-7" />
      <QuestionCard label={question.label} help={question.help}>
        {question.options.map((o) => (
          <OptionButton
            key={o.value}
            label={o.label}
            hint={o.hint}
            selected={answers[question.id] === o.value}
            onClick={() => choose(o.value)}
          />
        ))}
      </QuestionCard>
      {step > 0 && <ToolNav onBack={() => setStep(step - 1)} />}
    </ToolFrame>
  );
}
