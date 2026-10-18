import { cn } from "@/lib/utils";
import rules from "@/content/data/rules-citations.json";

type Citation = {
  id: string;
  rule: string;
  section: string;
  title: string;
  verbatim: string;
  gloss: string;
};

const BY_ID = new Map<string, Citation>(
  (rules.citations as Citation[]).map((c) => [c.id, c]),
);

/**
 * The `guidelines` entries in rules-citations.json are deliberately NOT citable
 * through these components. They carry a `finding` — our summary — where the
 * Rules entries carry `verbatim`. Rendering a second-hand summary in the same
 * quoted, brass-ruled frame as promulgated text would misrepresent it as law.
 * The ENF fee and performance bond are therefore attributed in prose, naming
 * the Guidelines as a separate document and carrying its provenance caveat.
 */
const GUIDELINE_IDS = new Set((rules.guidelines as { id: string }[]).map((g) => g.id));

function lookup(id: string): Citation | null {
  return BY_ID.get(id) ?? null;
}

/** "Rule IV, Sec. 5" — the label used everywhere. */
function label(c: Citation) {
  return `Rule ${c.rule}, Sec. ${c.section}`;
}

/**
 * Inline citation pin. `<RuleCite id="jurat" />`
 *
 * Renders as a small chip that expands to the verbatim text of the Section.
 * Two reasons it exists: a reader can check us without leaving the page, and
 * an answer engine gets a self-contained, attributed, quotable statement.
 *
 * The pin is set in mono because it is a reference, not prose — the eye should
 * catch it as an index mark inside the sentence and skip it when reading on.
 * It stays inline-sized on purpose: WCAG 2.5.8 exempts targets set in a line of
 * text, and forcing 44px here would tear the leading of the paragraph apart.
 *
 * MDX note: string attributes only. This pipeline drops expression attributes.
 */
export function RuleCite({ id, className }: { id: string; className?: string }) {
  const c = lookup(id);
  if (!c) {
    // Loud in development, invisible in production — a missing citation is a
    // content bug, never a crash.
    if (process.env.NODE_ENV !== "production") {
      return (
        <span className="border border-danger/40 bg-danger-soft px-1.5 py-0.5 font-mono text-[0.75rem] text-danger">
          {GUIDELINE_IDS.has(id)
            ? `[${id} is an ENF Guidelines entry, not a Rules Section — attribute it in prose]`
            : `[unknown rule citation: ${id}]`}
        </span>
      );
    }
    return null;
  }

  return (
    <details className={cn("inline-block align-baseline", className)}>
      <summary
        className={cn(
          "inline cursor-pointer list-none whitespace-nowrap rounded-none",
          "border border-line-strong bg-surface px-1.5 py-0.5",
          "font-mono text-[0.75rem] tracking-[0.01em] text-accent-text",
          "hover:border-ink hover:bg-sunken",
        )}
      >
        {label(c)}
      </summary>
      {/* Promulgated text always arrives behind a brass margin rule. */}
      <span className="mt-2.5 block border-l-[3px] border-accent bg-sunken px-4 py-3.5">
        <cite className="dateline block not-italic">
          {label(c)} — {c.title}
        </cite>
        <span className="article mt-2 block text-[1.0625rem] text-ink">“{c.verbatim}”</span>
      </span>
    </details>
  );
}

/**
 * Block quotation of a Section. `<RuleQuote id="extraterritorial" />`
 *
 * Use where the exact wording is the point — the location rule, the punishable
 * acts, anything a reader might otherwise assume we paraphrased loosely.
 *
 * The brass rule caps the frame the way a masthead caps a front page, and the
 * quoted text sets in Newsreader: it is law, so it reads as prose, not as UI.
 */
export function RuleQuote({ id, className }: { id: string; className?: string }) {
  const c = lookup(id);
  if (!c) return null;

  return (
    <figure className={cn("border border-line bg-surface", className)}>
      <div aria-hidden className="brass-rule rule-reveal w-full" />
      <blockquote className="px-5 py-5 sm:px-7">
        <p className="article text-ink">“{c.verbatim}”</p>
      </blockquote>
      <figcaption className="border-t border-line bg-sunken px-5 py-3 text-fine text-muted sm:px-7">
        <cite className="not-italic">
          <span className="font-mono text-ink">
            {label(c)} — {c.title}
          </span>
          , A.M. No. 24-10-14-SC (Rules on Electronic Notarization)
        </cite>
      </figcaption>
    </figure>
  );
}

/** Our own words about a Section, kept visually distinct from the Rules text. */
export function RuleGloss({ id, className }: { id: string; className?: string }) {
  const c = lookup(id);
  if (!c) return null;
  return (
    <p className={cn("text-[0.9375rem] leading-relaxed text-ink", className)}>{c.gloss}</p>
  );
}
