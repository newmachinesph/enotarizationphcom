import type { Metadata } from "next";

import { Dateline } from "@/components/marks/Dateline";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { Seal } from "@/components/marks/Seal";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Callout, Disclaimer } from "@/components/ui/Callout";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { CardGrid, LinkCard } from "@/components/ui/LinkCard";
import { Breadcrumbs, PageHeader, SectionHeading } from "@/components/ui/PageHeader";
import { PersonaCard } from "@/components/ui/PersonaCard";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { RuleCite, RuleGloss, RuleQuote } from "@/components/ui/RuleCite";
import { RelatedLinks, SourceList } from "@/components/ui/SourceList";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { StepList } from "@/components/ui/StepList";
import {
  VerificationChip,
  VERIFICATION_HINTS,
  VERIFICATION_STATUSES,
} from "@/components/ui/VerificationChip";
import tokens from "@/content/data/tokens.json";
import { asOf, officialSources } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The specimen sheet for "The Record".
 *
 * Two jobs, in this order:
 *
 *  1. It is the page a designer opens to learn the system — the ramps, the
 *     four faces, the five signature devices, the verified contrast figures.
 *  2. It is the best smoke test in the repository. Every primitive in
 *     components/ui and components/marks renders here, live, with real props.
 *     A component that breaks breaks visibly on this page first.
 *
 * Two rules for anyone editing it:
 *
 *  - Colour classes are written out in full (`bg-navy-700`, never
 *    `` bg-navy-${step} ``). Tailwind scans source text for candidates, so an
 *    interpolated class name produces no CSS and the swatch renders
 *    transparent — silently, which is the worst possible failure on a page
 *    whose whole job is showing colour.
 *  - Contrast figures are READ, never typed from memory. The core table below
 *    imports content/data/tokens.json directly so it cannot drift. The
 *    semantic figures are the output of `npm run check:contrast`
 *    (scripts/check-contrast.mjs) and each row is labelled with the exact
 *    assertion it comes from.
 */

export const metadata: Metadata = {
  title: "Design system",
  description:
    "The Record — every token, face and primitive in the eNotarizationPH design system, rendered live. Bone paper, midnight-navy ink, antique brass. WCAG 2.2 AA, 49 asserted contrast pairs.",
  alternates: { canonical: "/styleguide" },
  robots: { index: false, follow: true },
};

/* ==========================================================================
   Data read from the repository
   ========================================================================== */

const paper = tokens.color.paper;
const navy = tokens.color.navy;
const brass = tokens.color.brass;
const civic = tokens.color.civic;

/** Verified ratios, imported from the palette mirror. Never hand-typed. */
const C = tokens.contrast;

function ratio(value: number): string {
  return `${value.toFixed(2)}:1`;
}

type Swatch = { step: string; cls: string; hex: string; role?: string };

const PAPER_RAMP: Swatch[] = [
  { step: "50", cls: "bg-paper-50", hex: paper["50"], role: "surface" },
  { step: "100", cls: "bg-paper-100", hex: paper["100"], role: "page bg" },
  { step: "200", cls: "bg-paper-200", hex: paper["200"], role: "sunken" },
  { step: "300", cls: "bg-paper-300", hex: paper["300"], role: "line" },
  { step: "400", cls: "bg-paper-400", hex: paper["400"] },
  { step: "500", cls: "bg-paper-500", hex: paper["500"], role: "line-strong" },
];

const NAVY_RAMP: Swatch[] = [
  { step: "50", cls: "bg-navy-50", hex: navy["50"], role: "on-inverse" },
  { step: "100", cls: "bg-navy-100", hex: navy["100"] },
  { step: "200", cls: "bg-navy-200", hex: navy["200"], role: "on-inverse-muted" },
  { step: "300", cls: "bg-navy-300", hex: navy["300"] },
  { step: "400", cls: "bg-navy-400", hex: navy["400"], role: "night line-strong" },
  { step: "500", cls: "bg-navy-500", hex: navy["500"], role: "muted" },
  { step: "600", cls: "bg-navy-600", hex: navy["600"] },
  { step: "700", cls: "bg-navy-700", hex: navy["700"], role: "night line" },
  { step: "800", cls: "bg-navy-800", hex: navy["800"], role: "ink" },
  { step: "900", cls: "bg-navy-900", hex: navy["900"], role: "inverse / seal" },
  { step: "950", cls: "bg-navy-950", hex: navy["950"], role: "night sunken" },
];

const BRASS_RAMP: Swatch[] = [
  { step: "50", cls: "bg-brass-50", hex: brass["50"] },
  { step: "100", cls: "bg-brass-100", hex: brass["100"] },
  { step: "200", cls: "bg-brass-200", hex: brass["200"], role: "selection" },
  { step: "300", cls: "bg-brass-300", hex: brass["300"], role: "accent on navy" },
  { step: "400", cls: "bg-brass-400", hex: brass["400"] },
  { step: "500", cls: "bg-brass-500", hex: brass["500"], role: "accent" },
  { step: "600", cls: "bg-brass-600", hex: brass["600"] },
  { step: "700", cls: "bg-brass-700", hex: brass["700"], role: "accent-text" },
  { step: "800", cls: "bg-brass-800", hex: brass["800"] },
  { step: "900", cls: "bg-brass-900", hex: brass["900"] },
];

const CIVIC_RAMP: Swatch[] = [
  { step: "300", cls: "bg-civic-300", hex: civic["300"], role: "night link" },
  { step: "600", cls: "bg-civic-600", hex: civic["600"], role: "link / focus" },
];

/** Pairs that actually carry text, shown on their real background. */
type Pair = {
  id: string;
  text: string;
  surface: string;
  fg: string;
  bg: string;
  value: number;
};

const TEXT_PAIRS: Pair[] = [
  { id: "ink-bg", text: "text-ink", surface: "bg-bg", fg: "text-ink", bg: "bg-bg", value: C.inkOnPaper },
  {
    id: "ink-surface",
    text: "text-ink",
    surface: "bg-surface",
    fg: "text-ink",
    bg: "bg-surface",
    value: C.inkOnSurface,
  },
  {
    id: "ink-sunken",
    text: "text-ink",
    surface: "bg-sunken",
    fg: "text-ink",
    bg: "bg-sunken",
    value: C.inkOnSunken,
  },
  { id: "muted-bg", text: "text-muted", surface: "bg-bg", fg: "text-muted", bg: "bg-bg", value: C.mutedOnPaper },
  { id: "link-bg", text: "text-link", surface: "bg-bg", fg: "text-link", bg: "bg-bg", value: C.linkOnPaper },
  {
    id: "accent-bg",
    text: "text-accent-text",
    surface: "bg-bg",
    fg: "text-accent-text",
    bg: "bg-bg",
    value: C.brass700OnPaper,
  },
  {
    id: "on-inverse",
    text: "text-on-inverse",
    surface: "bg-inverse",
    fg: "text-on-inverse",
    bg: "bg-inverse",
    value: C.onInverseTextOnNavy900,
  },
  {
    id: "on-inverse-muted",
    text: "text-on-inverse-muted",
    surface: "bg-inverse",
    fg: "text-on-inverse-muted",
    bg: "bg-inverse",
    value: C.onInverseMutedOnNavy900,
  },
  {
    id: "accent-on-inverse",
    text: "text-accent-on-inverse",
    surface: "bg-inverse",
    fg: "text-accent-on-inverse",
    bg: "bg-inverse",
    value: C.brass300OnNavy900,
  },
];

/** Sections, so the index and the ledger numerals cannot drift apart. */
const SECTIONS = [
  { id: "colour", title: "Colour" },
  { id: "type", title: "Typography" },
  { id: "devices", title: "Signature devices" },
  { id: "components", title: "Components" },
  { id: "motion", title: "Motion and accessibility" },
] as const;

function sectionNumber(id: string): number {
  return SECTIONS.findIndex((s) => s.id === id) + 1;
}

/* ==========================================================================
   Local presentation helpers — specimen furniture, not system components.
   ========================================================================== */

/** A token name, set as a ledger tag. */
function Tok({ children }: { children: string }) {
  return (
    <span className="whitespace-nowrap border border-line bg-sunken px-1.5 py-0.5 font-mono text-[0.8125rem] text-ink">
      {children}
    </span>
  );
}

function Spec({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-24 scroll-mt-28">
      <p className="mb-3">
        <LedgerNumber value={sectionNumber(id)} />
      </p>
      <SectionHeading title={title} sub={sub} />
      {children}
    </section>
  );
}

function Sub({ title, note }: { title: string; note?: React.ReactNode }) {
  return (
    <div className="mb-6 mt-14 first:mt-0">
      <h3>{title}</h3>
      {note && <p className="mt-2.5 max-w-[46rem] text-[0.9375rem] text-muted">{note}</p>}
      <div aria-hidden className="hair-rule mt-4" />
    </div>
  );
}

function Ramp({ label, swatches }: { label: string; swatches: Swatch[] }) {
  return (
    <div className="mb-10">
      <p className="dateline mb-3 text-accent-text">{label}</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {swatches.map((s) => (
          <li key={s.step}>
            <div aria-hidden className={cn("h-16 w-full border border-line-strong", s.cls)} />
            <p className="ledger-num mt-2 block">{s.step}</p>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted">
              {s.hex}
            </p>
            {s.role && <p className="text-fine text-muted">{s.role}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A live foreground/background pair with its asserted ratio beside it. */
function PairSpecimen({ pair }: { pair: Pair }) {
  return (
    <li className={cn("border border-line-strong px-4 py-4", pair.bg)}>
      <p className={cn("font-display text-[1.375rem] leading-tight", pair.fg)}>
        The Record — 6 August 2026
      </p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cn("font-mono text-[0.75rem] tracking-[0.06em]", pair.fg)}>
          {pair.text} on {pair.surface}
        </span>
        <span
          className={cn(
            "font-mono text-[0.75rem] tabular-nums tracking-[0.06em]",
            pair.fg,
          )}
        >
          {ratio(pair.value)}
        </span>
      </p>
    </li>
  );
}

/* ==========================================================================
   Contrast tables
   ========================================================================== */

const CONTRAST_COLUMNS = [
  { key: "pair", label: "Pair", width: "34%" },
  { key: "measured", label: "Measured" },
  { key: "min", label: "WCAG min" },
  { key: "where", label: "Where it applies" },
];

const CORE_CONTRAST = [
  {
    id: "ink-paper",
    pair: <Tok>text-ink on bg-bg</Tok>,
    measured: ratio(C.inkOnPaper),
    min: "4.5:1",
    where: "Body copy, headings, table cells.",
  },
  {
    id: "ink-surface",
    pair: <Tok>text-ink on bg-surface</Tok>,
    measured: ratio(C.inkOnSurface),
    min: "4.5:1",
    where: "Panels, quick answers, banners.",
  },
  {
    id: "ink-sunken",
    pair: <Tok>text-ink on bg-sunken</Tok>,
    measured: ratio(C.inkOnSunken),
    min: "4.5:1",
    where: "Neutral callouts, code, colophon.",
  },
  {
    id: "muted-paper",
    pair: <Tok>text-muted on bg-bg</Tok>,
    measured: ratio(C.mutedOnPaper),
    min: "4.5:1",
    where: "Ledes, notes, datelines, fine print.",
  },
  {
    id: "link-paper",
    pair: <Tok>text-link on bg-bg</Tok>,
    measured: ratio(C.linkOnPaper),
    min: "4.5:1",
    where: "Links. Also the focus ring colour.",
  },
  {
    id: "brass-paper",
    pair: <Tok>text-accent-text on bg-bg</Tok>,
    measured: ratio(C.brass700OnPaper),
    min: "4.5:1",
    where: "The ONLY brass permitted to carry text on paper.",
  },
  {
    id: "brass-brass50",
    pair: <Tok>brass-700 on brass-50</Tok>,
    measured: ratio(C.brass700OnBrass50),
    min: "4.5:1",
    where: "Brass text on a brass tint.",
  },
  {
    id: "control-border",
    pair: <Tok>border-line-strong on bg-bg</Tok>,
    measured: ratio(C.controlBorderOnPaper),
    min: "3:1",
    where: "WCAG 1.4.11. Any border that IS the edge of a control.",
  },
  {
    id: "brass-navy900",
    pair: <Tok>text-accent-on-inverse on bg-inverse</Tok>,
    measured: ratio(C.brass300OnNavy900),
    min: "4.5:1",
    where: "Brass on navy: footer, seal panels, brass buttons.",
  },
  {
    id: "brass-navy800",
    pair: <Tok>brass-300 on navy-800</Tok>,
    measured: ratio(C.brass300OnNavy800),
    min: "4.5:1",
    where: "Brass on the night surface.",
  },
  {
    id: "on-inverse",
    pair: <Tok>text-on-inverse on bg-inverse</Tok>,
    measured: ratio(C.onInverseTextOnNavy900),
    min: "4.5:1",
    where: "Reversed copy on navy.",
  },
  {
    id: "on-inverse-muted",
    pair: <Tok>text-on-inverse-muted on bg-inverse</Tok>,
    measured: ratio(C.onInverseMutedOnNavy900),
    min: "4.5:1",
    where: "Secondary reversed copy.",
  },
  {
    id: "night-ink",
    pair: <Tok>night text-ink on bg-bg</Tok>,
    measured: ratio(C.nightInkOnNightBg),
    min: "4.5:1",
    where: "Night edition body copy.",
  },
  {
    id: "night-muted",
    pair: <Tok>night text-muted on bg-bg</Tok>,
    measured: ratio(C.nightMutedOnNightBg),
    min: "4.5:1",
    where: "Night edition secondary copy.",
  },
  {
    id: "night-link",
    pair: <Tok>night text-link on bg-bg</Tok>,
    measured: ratio(C.nightLinkOnNightBg),
    min: "4.5:1",
    where: "Night links and focus ring.",
  },
  {
    id: "night-border",
    pair: <Tok>night border-line-strong on bg-bg</Tok>,
    measured: ratio(C.nightControlBorderOnNightBg),
    min: "3:1",
    where: "Night control boundaries.",
  },
];

/**
 * Day-edition semantic figures, copied from the PASS lines printed by
 * `npm run check:contrast`. The `where` column names the assertion label so
 * a reader can grep the script for it.
 */
const SEMANTIC_CONTRAST = [
  {
    id: "success",
    pair: <Tok>text-success on bg-bg</Tok>,
    measured: "6.47:1",
    min: "4.5:1",
    where: "success on paper",
  },
  {
    id: "success-soft",
    pair: <Tok>text-success on bg-success-soft</Tok>,
    measured: "6.29:1",
    min: "4.5:1",
    where: "success on soft",
  },
  {
    id: "warning",
    pair: <Tok>text-warning on bg-bg</Tok>,
    measured: "5.76:1",
    min: "4.5:1",
    where: "warning on paper",
  },
  {
    id: "warning-soft",
    pair: <Tok>text-warning on bg-warning-soft</Tok>,
    measured: "5.71:1",
    min: "4.5:1",
    where: "warning on soft",
  },
  {
    id: "danger",
    pair: <Tok>text-danger on bg-bg</Tok>,
    measured: "6.83:1",
    min: "4.5:1",
    where: "danger on paper",
  },
  {
    id: "danger-soft",
    pair: <Tok>text-danger on bg-danger-soft</Tok>,
    measured: "6.54:1",
    min: "4.5:1",
    where: "danger on soft",
  },
  {
    id: "info",
    pair: <Tok>text-info on bg-bg</Tok>,
    measured: ratio(C.linkOnPaper),
    min: "4.5:1",
    where: "link on paper — info is civic-600, the same value.",
  },
];

const SEMANTIC_TONES = [
  { key: "info", fg: "text-info", soft: "bg-info-soft", label: "info" },
  { key: "success", fg: "text-success", soft: "bg-success-soft", label: "success" },
  { key: "warning", fg: "text-warning", soft: "bg-warning-soft", label: "warning" },
  { key: "danger", fg: "text-danger", soft: "bg-danger-soft", label: "danger" },
];

/* ==========================================================================
   Page
   ========================================================================== */

export default function StyleguidePage() {
  return (
    <div className="shell py-10 sm:py-14">
      <PageHeader
        eyebrow="Design system"
        title="The Record"
        intro={
          <>
            <p>
              Bone paper, midnight-navy ink, antique brass. An editorial broadsheet, not a
              product surface: structure comes from rules and space, never from shadows or
              rounded corners.
            </p>
            <p>
              Everything below is the live system. Every colour is a token, every primitive is
              the component the site actually ships, and every contrast figure is read from{" "}
              <Tok>content/data/tokens.json</Tok> or printed by{" "}
              <Tok>npm run check:contrast</Tok>. Nothing here is a mock-up.
            </p>
          </>
        }
        trail={[{ label: "Design system", href: "/styleguide" }]}
      />

      {/* INDEX */}
      <nav aria-label="Specimen sections" className="mb-20 border-t-2 border-ink pt-4">
        <p className="dateline">Contents</p>
        <ol className="mt-3 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s, i) => (
            <li key={s.id} className="border-b border-line">
              <a
                href={`#${s.id}`}
                className="flex min-h-11 items-center gap-3 no-underline hover:underline"
              >
                <LedgerNumber value={i + 1} />
                <span className="text-ink">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ================================================================ */}
      <Spec
        id="colour"
        title="Colour"
        sub="Three ramps and one link colour. Paper is the page, navy is the ink and the structure, brass is the single accent. Civic blue survives only as the link."
      >
        <Sub
          title="Ramps"
          note="Every step below is rendered by its Tailwind utility, not by an inline style — so a token removed from globals.css shows up here as a transparent box rather than as nothing at all."
        />
        <Ramp label="Paper — the page is bone, never white" swatches={PAPER_RAMP} />
        <Ramp label="Navy — ink and structure" swatches={NAVY_RAMP} />
        <Ramp label="Brass — the accent" swatches={BRASS_RAMP} />
        <Ramp label="Civic — links only, two stops by design" swatches={CIVIC_RAMP} />

        <Sub
          title="Pairs that carry text"
          note="Each specimen is drawn on its real background and prints its asserted ratio. Figures are the day edition; the night edition re-points every semantic token and is asserted separately — 49 pairs across both editions, all passing."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEXT_PAIRS.map((p) => (
            <PairSpecimen key={p.id} pair={p} />
          ))}
        </ul>

        <Callout tone="warning" title="brass-700 is the only brass that may carry text on paper">
          <p>
            <Tok>text-accent-text</Tok> resolves to brass-700 and clears{" "}
            {ratio(C.brass700OnPaper)} on the page background. brass-300 through brass-600 are
            accent and surface colours only: they fill a rule, a bar or a button, and they never
            set a word on a light surface. On navy the relationship inverts —{" "}
            <Tok>text-accent-on-inverse</Tok> is brass-300 at {ratio(C.brass300OnNavy900)}.
          </p>
        </Callout>

        <Sub
          title="Two line tokens, two different jobs"
          note="Getting these the wrong way round is the most common way to fail an audit on this system."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="border border-line bg-surface p-5">
            <p className="dateline text-accent-text">Decorative</p>
            <p className="mt-2">
              <Tok>border-line</Tok>
            </p>
            <div aria-hidden className="hair-rule my-4" />
            <p className="text-[0.9375rem] text-muted">
              paper-300. Section dividers, table rules, panel edges. WCAG 1.4.11 exempts purely
              decorative boundaries, so this one is allowed to be quiet.
            </p>
          </div>
          <div className="border-2 border-line-strong bg-surface p-5">
            <p className="dateline text-accent-text">Control boundary</p>
            <p className="mt-2">
              <Tok>border-line-strong</Tok>
            </p>
            <div aria-hidden className="hair-rule my-4" />
            <p className="text-[0.9375rem] text-muted">
              paper-500, {ratio(C.controlBorderOnPaper)} on paper. Required wherever the border
              is the sole indicator of a control&rsquo;s edge: inputs, checkboxes, outlined
              buttons, the secondary button variant.
            </p>
          </div>
        </div>

        <Sub
          title="Verified ratios"
          note={
            <>
              Read from <Tok>content/data/tokens.json</Tok>, which mirrors{" "}
              <Tok>app/globals.css</Tok>. Adding a colour pair to the system means adding its
              assertion to <Tok>scripts/check-contrast.mjs</Tok> — the palette is gated, never
              eyeballed.
            </>
          }
        />
        <ComparisonTable
          caption="Core surface and text pairs. Below md the table collapses to labelled entries."
          columns={CONTRAST_COLUMNS}
          rows={CORE_CONTRAST}
        />

        <Sub
          title="Semantic"
          note="Deliberately unclaimed by the brand — these four are meaning, not identity. Each has a soft tint for callout fills, and the glyph is drawn IN the tone rather than reversed out of it, because the night edition lightens every semantic value."
        />
        <ul className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SEMANTIC_TONES.map((t) => (
            <li key={t.key} className={cn("border border-line px-4 py-4", t.soft)}>
              <p className={cn("font-mono text-[0.8125rem] tracking-[0.08em]", t.fg)}>
                {t.label}
              </p>
              <p className={cn("mt-2 text-[0.9375rem]", t.fg)}>Tone on its own soft tint.</p>
            </li>
          ))}
        </ul>
        <ComparisonTable
          caption="Semantic ratios, day edition. Values are the PASS lines printed by npm run check:contrast."
          columns={CONTRAST_COLUMNS}
          rows={SEMANTIC_CONTRAST}
        />
        <p className="mt-4 max-w-[46rem] text-fine text-muted">
          One gap worth knowing about: the script asserts each semantic colour on paper and on
          its own soft tint, but <Tok>info</Tok> on <Tok>info-soft</Tok> has no assertion of its
          own in either edition — it inherits its confidence from the civic-600 link pair. If you
          touch the info tint, add the assertion first.
        </p>
      </Spec>

      {/* ================================================================ */}
      <Spec
        id="type"
        title="Typography"
        sub="Four faces, one job each. Display sets the headings, Newsreader sets the law, Instrument Sans runs the interface, Geist Mono carries every number and date."
      >
        <Callout tone="danger" title="Instrument Serif is weight 400 only">
          <p>
            The family ships nothing heavier. Google Fonts silently clamps a 600 or 700 request
            back to 400, and a browser asked for a weight the file does not have will synthesise
            a fake bold that smears the high-contrast strokes. Never put{" "}
            <Tok>font-bold</Tok>, <Tok>font-semibold</Tok> or <Tok>font-medium</Tok> on{" "}
            <Tok>font-display</Tok> or on an h1&ndash;h4. Size carries the emphasis.{" "}
            <Tok>font-synthesis-weight: none</Tok> on body is the belt to that braces.
          </p>
        </Callout>

        <Sub
          title="Instrument Serif — display"
          note={
            <>
              Headings, the masthead, the OG card title. The scale is fluid and set in{" "}
              <Tok>globals.css</Tok>; tracking runs negative and tightens as size grows.
            </>
          }
        />
        <div className="border border-line bg-surface p-6 sm:p-8">
          <p className="dateline text-accent-text">h1 · clamp 2.5&ndash;5.5rem · −0.03em</p>
          <h1 className="mt-2">The record of a legal change</h1>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">h2 · clamp 1.875&ndash;3.25rem · −0.024em</p>
          <h2 className="mt-2">What actually changed</h2>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">h3 · clamp 1.375&ndash;1.75rem · −0.016em</p>
          <h3 className="mt-2">Who may notarize electronically</h3>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">h4 · 1.125rem · −0.01em</p>
          <h4 className="mt-2">Ang gabay mo sa e-notaryo</h4>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">
            font-display, italic — the one variation the file supports
          </p>
          <p className="mt-2 font-display text-[2rem] italic leading-tight">
            A.M. No. 24-10-14-SC
          </p>
        </div>

        <Sub
          title="Newsreader — the law"
          note={
            <>
              Long-form legal copy sets in Newsreader, never in the UI sans. It is variable on
              the optical-size axis, which is the entire reason for a second serif:{" "}
              <Tok>.lede</Tok> binds opsz 28 and <Tok>.article</Tok> binds opsz 16, so an intro
              and a paragraph are drawn as different masters of the same face.
            </>
          }
        />
        <div className="border border-line bg-surface p-6 sm:p-8">
          <p className="dateline text-accent-text">.lede · opsz 28 · clamp 1.25&ndash;1.5rem</p>
          <p className="lede mt-2">
            Electronic notarization is notarization where the document is a PDF instead of paper.
            The legal force is identical; what changes is where you have to stand.
          </p>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">.article · opsz 16 · 1.1875rem / 1.62</p>
          <div className="article mt-2 [&>*+*]:mt-4">
            <p>
              A commissioned electronic notary verifies who you are, watches you sign, and
              applies a QR-coded electronic seal. The Rules took effect on 24 March 2025 and
              carry the same evidentiary weight as a wet-ink notarial act.
            </p>
            <p>
              Measure, not width, is what makes legal copy readable: the text column holds a
              46rem measure whatever the viewport does around it.
            </p>
          </div>
        </div>

        <Sub
          title="Instrument Sans — the interface"
          note="The body default. Navigation, buttons, labels, form controls, table cells. 16px minimum, never smaller, with generous leading because Filipino and English strings differ in length by up to a third and both have to breathe."
        />
        <div className="space-y-4 border border-line bg-surface p-6 sm:p-8">
          <p>
            Body copy at 16px with a 1.6 line height. Tracking sits at zero — the sans is the
            quiet face in this system and it should read as furniture, not as voice.
          </p>
          <p className="text-fine text-muted">
            <Tok>.text-fine</Tok> — 13px with slightly POSITIVE tracking (0.006em), because small
            text needs its letters further apart, not closer. This is the one place the system
            tracks outward.
          </p>
        </div>

        <Sub
          title="Geist Mono — data"
          note={
            <>
              Every number, date, amount and status. Tabular figures throughout, so columns of
              digits line up on their own. Two named classes wrap it: <Tok>.dateline</Tok> for
              micro-labels and <Tok>.ledger-num</Tok> for numerals.
            </>
          }
        />
        <div className="border border-line bg-surface p-6 sm:p-8">
          <p className="dateline text-accent-text">.dateline · 0.6875rem · 0.16em · uppercase</p>
          <p className="dateline mt-2">Manila · As of 6 August 2026 · Reviewed</p>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">.ledger-num · 0.75rem · 0.14em · brass</p>
          <p className="mt-2 flex flex-wrap gap-4">
            <LedgerNumber value={1} />
            <LedgerNumber value={7} />
            <LedgerNumber value={12} />
            <LedgerNumber value={4} pad={3} />
          </p>
          <div aria-hidden className="hair-rule my-7" />
          <p className="dateline text-accent-text">Tabular figures — the reason for the face</p>
          <table className="mt-3 w-full max-w-md border-collapse font-mono text-[0.9375rem] tabular-nums">
            <caption className="sr-only">Illustrative figures showing tabular alignment</caption>
            <tbody>
              {[
                ["2026-08-06", "1,180.00"],
                ["2026-04-02", "310.50"],
                ["2025-03-24", "12,000.00"],
              ].map(([d, v]) => (
                <tr key={d} className="border-b border-line last:border-b-0">
                  <td className="py-2 text-muted">{d}</td>
                  <td className="py-2 text-right text-ink">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Sub title="The utilities" />
        <ComparisonTable
          caption="Which face to reach for, and what it is called in code."
          columns={[
            { key: "face", label: "Face", width: "24%" },
            { key: "util", label: "Utility / class" },
            { key: "role", label: "Role" },
          ]}
          rows={[
            {
              id: "serif",
              face: "Instrument Serif",
              util: (
                <>
                  <Tok>font-display</Tok> · h1&ndash;h4
                </>
              ),
              role: "Headings and the masthead. Weight 400 only.",
            },
            {
              id: "news",
              face: "Newsreader",
              util: (
                <>
                  <Tok>.article</Tok> · <Tok>.lede</Tok> · <Tok>font-article</Tok>
                </>
              ),
              role: "Long-form legal copy and intros.",
            },
            {
              id: "sans",
              face: "Instrument Sans",
              util: <Tok>font-sans</Tok>,
              role: "The body default. Interface chrome.",
            },
            {
              id: "mono",
              face: "Geist Mono",
              util: (
                <>
                  <Tok>font-mono</Tok> · <Tok>.dateline</Tok> · <Tok>.ledger-num</Tok>
                </>
              ),
              role: "Numbers, dates, amounts, statuses.",
            },
          ]}
        />
      </Spec>

      {/* ================================================================ */}
      <Spec
        id="devices"
        title="Signature devices"
        sub="Five marks do the identity work. If you strip everything else out, these five still read as The Record."
      >
        <Sub
          title="01 — The Seal"
          note={
            <>
              Concentric rings, a milled outer edge of 48 teeth, a ruled centre. Pure SVG on a
              100×100 viewBox with no dependencies, because it also has to render inside{" "}
              <Tok>next/og</Tok> (Satori), which supports neither CSS animation nor{" "}
              <Tok>&lt;use&gt;</Tok>. Used as the favicon, the app icon, the OG mark, the hero
              device, the ghost behind the status banner, and the article reading-progress ring.
            </>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-wrap items-end gap-8 border border-line bg-surface p-6">
            <div>
              <Seal size={112} title="The eNotarizationPH seal" />
              <p className="dateline mt-3">112 · default accent</p>
            </div>
            <div>
              <Seal size={64} />
              <p className="dateline mt-3">64 · decorative</p>
            </div>
            <div>
              <Seal size={64} animate />
              <p className="dateline mt-3">64 · animate</p>
            </div>
          </div>
          <div className="flex items-center gap-8 border border-line bg-inverse p-6">
            <Seal size={112} color="var(--accent-on-inverse)" />
            <div>
              <p className="dateline text-accent-on-inverse">On navy</p>
              <p className="mt-2 text-[0.9375rem] text-on-inverse-muted">
                Pass <Tok>color=&quot;var(--accent-on-inverse)&quot;</Tok> on an inverse surface.
                The default <Tok>var(--accent)</Tok> is brass-500 and is a paper value.
              </p>
            </div>
          </div>
        </div>

        <Sub
          title="02 — The Brass Rule"
          note={
            <>
              Promoted from decoration to structure. A 3px gradient hairline that heads every
              section, masthead and dateline; brass-500 fading out to transparent. Always{" "}
              <Tok>aria-hidden</Tok>, because it is the one pure flourish the design permits.
              Animates by extending from the left on scroll-enter.
            </>
          }
        />
        <div className="space-y-5 border border-line bg-surface p-6">
          <div>
            <BrassRule />
            <p className="dateline mt-2">Default — w-24, animated</p>
          </div>
          <div>
            <BrassRule width="w-16" />
            <p className="dateline mt-2">w-16 — section heads</p>
          </div>
          <div>
            <BrassRule width="w-full" animate={false} />
            <p className="dateline mt-2">
              w-full, animate=false — panel heads and anything above the fold
            </p>
          </div>
        </div>

        <Sub
          title="03 — Ledger numerals"
          note="A zero-padded numeral the way a docket numbers its parts. A real, readable numeral — only the trailing dash is hidden from assistive tech. It numbers the sections of this page."
        />
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border border-line bg-surface p-6">
          <LedgerNumber value={1} />
          <LedgerNumber value={2} />
          <LedgerNumber value={13} />
          <LedgerNumber value={5} pad={3} />
          <p className="text-[0.9375rem] text-muted">
            Also used hanging in the marginalia rail of <Tok>StepList</Tok> and{" "}
            <Tok>SourceList</Tok>.
          </p>
        </div>

        <Sub
          title="04 — The marginalia rail"
          note={
            <>
              The structural signature: <Tok>.broadsheet</Tok> is a three-track grid whose narrow
              left rail carries the section number, the date and the citations, while the text
              column holds a 46rem measure. Below lg the rail contents inline above the text in
              source order, so the reading sequence is identical with or without the grid.
            </>
          }
        />
        <div className="broadsheet border border-line bg-surface p-6">
          <div className="broadsheet-rail">
            <LedgerNumber value={4} />
            <p className="dateline mt-2">.broadsheet-rail</p>
          </div>
          <div className="broadsheet-text">
            <h4>.broadsheet-text</h4>
            <p className="article mt-2 text-[1.0625rem]">
              The reading column. Everything that is prose belongs here and nowhere else — the
              measure is the point, and widening it is the fastest way to make legal copy
              unreadable.
            </p>
          </div>
          <div className="broadsheet-wide mt-8">
            <div aria-hidden className="hair-rule mb-3" />
            <p className="text-[0.9375rem] text-muted">
              <Tok>.broadsheet-wide</Tok> — text column plus the right margin. Tables, figures
              and anything that needs to breathe past the measure.
            </p>
          </div>
          <div className="broadsheet-full mt-6">
            <div aria-hidden className="hair-rule mb-3" />
            <p className="text-[0.9375rem] text-muted">
              <Tok>.broadsheet-full</Tok> — rail edge to right edge. Full-bleed rules and
              section breaks.
            </p>
          </div>
        </div>

        <Sub
          title="05 — The Dateline"
          note={
            <>
              A gazette masthead line: where the record was filed and when. There is exactly one
              date on this site — <Tok>asOf</Tok> in <Tok>lib/brand.ts</Tok> — and the banner,
              the tracker, every page footer and this component all read it from there. The DOM
              keeps the human-readable string; only the rendering is stamped.
            </>
          }
        />
        <div className="space-y-4 border border-line bg-surface p-6">
          <Dateline />
          <div aria-hidden className="hair-rule" />
          <Dateline asOf={asOf.iso} label="Filed" />
          <div aria-hidden className="hair-rule" />
          <Dateline asOf="2025-03-24" label="" />
          <p className="text-fine text-muted">
            Default, custom label, and an empty label to drop the trailing status word.
          </p>
        </div>
      </Spec>

      {/* ================================================================ */}
      <Spec
        id="components"
        title="Components"
        sub="Every primitive in components/ui, rendered live with real props. This is the coverage that makes the page a smoke test: if a component regresses, it regresses here first."
      >
        <Sub
          title="Button, ButtonLink"
          note="Squared blocks of ink. Every variant carries a border of the same weight, so swapping one never shifts the layout by a pixel. Both sizes clear the 44px minimum target; feedback lands on pointer-down, not on release."
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Show my options</Button>
          <Button variant="secondary">Back</Button>
          <Button variant="gold">Read the Rules</Button>
          <Button variant="ghost">Skip this</Button>
          <Button disabled>Unavailable</Button>
          <ButtonLink href="/tools">Link button</ButtonLink>
          <ButtonLink href="/tools" size="lg">
            Large link button
          </ButtonLink>
          <ButtonLink href="https://sc.judiciary.gov.ph/enotarization/" variant="secondary">
            External link button
          </ButtonLink>
        </div>
        <p className="mt-4 max-w-[46rem] text-fine text-muted">
          The <Tok>gold</Tok> variant name predates the rebrand and is kept for callers; the
          colour is brass-300 on navy ink, {ratio(C.brass300OnNavy900)} in both editions because
          neither value moves with the theme. <Tok>secondary</Tok> is the variant that needs{" "}
          <Tok>border-line-strong</Tok> — its border is the edge of the control.
        </p>

        <Sub title="Breadcrumbs" note="The filing path, set in mono because it reads as a record locator rather than as navigation chrome. PageHeader renders it for you when given a trail." />
        <div className="border border-line bg-surface p-5">
          <Breadcrumbs
            trail={[
              { label: "Learn", href: "/learn" },
              { label: "The Rules explained", href: "/learn/the-rules-explained" },
            ]}
          />
        </div>

        <Sub
          title="PageHeader, SectionHeading"
          note={
            <>
              The masthead of every page and its section echo: dateline, Instrument Serif title,
              brass rule, lede. There is no box here and there should never be one.{" "}
              <Tok>PageHeader</Tok> is demonstrated by the top of this page rather than inline —
              it owns the <Tok>&lt;h1&gt;</Tok>, and a document gets one of those.{" "}
              <Tok>SectionHeading</Tok> heads all five sections below the index.
            </>
          }
        />
        <div className="border border-line bg-surface p-6 sm:p-8">
          <SectionHeading
            title="Before you start"
            sub="Three things to have ready, and one you can skip."
            className="mb-0"
          />
        </div>

        <Sub title="StatusBanner" note="The honest 'as of' rollout strip. It appears on every page that makes a claim about what you can do today, because the single biggest way this site could mislead someone is by implying the system is fully live when it is still staged." />
        <div className="space-y-6">
          <StatusBanner />
          <StatusBanner compact />
        </div>

        <Sub title="QuickAnswer" note="Sixty words or fewer, at the very top of an explainer. Someone who reads only this box should still leave with the correct answer — so it is set like a standfirst, with the brass rule running the full top edge." />
        <QuickAnswer>
          Electronic notarization is notarization where the document is a PDF instead of paper. A
          commissioned e-notary verifies who you are, watches you sign, and applies a QR-coded
          electronic seal. Same legal force as traditional notarization.
        </QuickAnswer>

        <Sub title="Callout, Disclaimer" note="Five tones, each a 3px bar in the margin over a barely-there tint. The glyph is drawn IN the tone colour rather than reversed out of it, because the night edition lightens every semantic value and white-on-tone would pass in one edition and fail in the other." />
        <div className="space-y-4">
          <Callout tone="info" title="Information">
            <p>Neutral context that helps the reader decide.</p>
          </Callout>
          <Callout tone="success" title="Confirmed">
            <p>Something verified against an official source.</p>
          </Callout>
          <Callout tone="warning" title="Read carefully">
            <p>A caveat that changes what you should do.</p>
          </Callout>
          <Callout tone="danger" title="Scam warning">
            <p>Something that could cost the reader money or their document.</p>
          </Callout>
          <Callout tone="neutral" title="Editorial note">
            <p>How we made a judgement call.</p>
          </Callout>
          <Callout tone="info">
            <p>Untitled — the component drops the head row entirely.</p>
          </Callout>
          <Disclaimer />
        </div>

        <Sub title="VerificationChip" note="No state may read as an endorsement. The strongest label available is a statement about what dated reporting said, not our opinion. The pill is one of only two things in this system allowed a radius, because a capsule reads as a live state where a box reads as a label." />
        <div className="grid gap-4 sm:grid-cols-2">
          {VERIFICATION_STATUSES.map((s) => (
            <div key={s} className="border border-line bg-surface p-4">
              <VerificationChip status={s} showHint />
              <p className="mt-3 text-fine text-muted">
                <Tok>{s}</Tok> — {VERIFICATION_HINTS[s].label}
              </p>
            </div>
          ))}
        </div>

        <Sub title="CategoryChip" note="Filing metadata on tracker entries. Squared on purpose: rounded-full in this system is reserved for live status, so a category sets as a ledger tag instead — the mono micro-label in brass, boxed by a hairline." />
        <div className="flex flex-wrap gap-3">
          <CategoryChip label="Rules" />
          <CategoryChip label="Accreditation" />
          <CategoryChip label="Enforcement" />
        </div>

        <Sub title="StepList" note="One action per step, set as a ledger. The numeral hangs in a marginalia rail and a hairline separates entries, so a long guide reads as a countable record rather than an endless stack of cards. The mistake is attached to the step where it happens." />
        <StepList
          steps={[
            {
              title: "Turn the document into a PDF",
              body: <p>PDF or PDF/A. A good scan of paper counts as an electronic document.</p>,
            },
            {
              title: "Work out which act you need",
              body: <p>Acknowledgment or jurat — they have different rules about signing.</p>,
              watchOut:
                "For a jurat, do not pre-sign. You must sign live in view of the e-notary.",
            },
            {
              title: "Create your own account",
              body: (
                <p>One account per person. Sharing a login means somebody was never verified.</p>
              ),
            },
          ]}
        />

        <Sub title="ComparisonTable" note="One semantic table in the DOM at every breakpoint, so screen readers and copy-paste both keep working. Below md the rows restyle into stacked entries and each cell grows its own label from data-label. Mono uppercase heads, a 2px rule under the header row, hairlines between rows, no zebra fill." />
        <ComparisonTable
          caption="Resize the window below 768px to see the card-collapse."
          columns={[
            { key: "mode", label: "Mode" },
            { key: "where", label: "Where you are" },
            { key: "force", label: "Legal force" },
          ]}
          rows={[
            { id: "ien", mode: "IEN", where: "In the room with the e-notary", force: "Same" },
            { id: "ren", mode: "REN", where: "Anywhere in the Philippines", force: "Same" },
          ]}
        />

        <Sub title="FaqAccordion" note="Native details/summary — keyboard-complete, screen-reader correct, and incapable of shifting layout on hydration because there is none. The only affordance is a bare crossbar that turns 45 degrees when the entry opens." />
        <FaqAccordion
          items={[
            {
              q: "An English question?",
              a: <p>Answered in English, in Newsreader, at reading size.</p>,
            },
            {
              q: "Isang tanong sa Filipino?",
              lang: "tl",
              a: <p>Sinasagot sa Filipino, at may tatak na wika sa tabi ng tanong.</p>,
            },
          ]}
        />

        <Sub title="LinkCard, CardGrid" note="The index entry used by listing pages. Not a card — a column entry: a rule across the top, the title in Instrument Serif, the summary in Newsreader, the call to action in the mono dateline. The rule fills brass on hover, the only motion in the unit." />
        <CardGrid columns={3}>
          <li>
            <LinkCard
              href="/learn/what-is-e-notarization"
              title="What is e-notarization"
              description="The plain-language version, with the Rules cited where it matters."
              icon="📄"
            />
          </li>
          <li>
            <LinkCard
              href="/guides/first-e-notarization"
              title="Your first e-notarization"
              description="The walkthrough, in order."
              cta="Open the guide →"
            />
          </li>
          <li>
            <LinkCard
              href="/tracker"
              title="What changed and when"
              description="Every dated change to the rollout, with its source."
            />
          </li>
        </CardGrid>
        <p className="mt-4 max-w-[46rem] text-fine text-muted">
          <Tok>CardGrid</Tok> renders a <Tok>&lt;ul&gt;</Tok> and <Tok>LinkCard</Tok> renders an
          anchor, so each card must be wrapped in a <Tok>&lt;li&gt;</Tok> by the caller — as
          above.
        </p>

        <Sub title="PersonaCard" note="The homepage's job is routing, not teaching. Each entry names a situation in the visitor's own words so they self-select in one glance. Weightier than a LinkCard on purpose: a 2px ink rule across the head, the situation set large." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PersonaCard
            persona={{
              href: "/guides/ofw",
              label: "May SPA problem from abroad",
              sub: "The honest guide for OFWs",
              icon: "✈️",
            }}
          />
          <PersonaCard
            persona={{
              href: "/safety",
              label: "Checking if a notary is legit",
              sub: "Seven red flags",
              icon: "🛡️",
            }}
          />
          <PersonaCard
            persona={{
              href: "/tools/cost-estimator",
              label: "Working out what it costs",
              sub: "Ranges, never false precision",
              icon: "🧮",
            }}
          />
        </div>

        <Sub title="RuleCite, RuleQuote, RuleGloss" note="The citation apparatus. Promulgated text always arrives behind a brass margin rule and sets in Newsreader, because it is law and should read as prose rather than as UI. The inline pin stays inline-sized on purpose — WCAG 2.5.8 exempts targets set in a line of text, and forcing 44px there would tear the leading apart." />
        <div className="space-y-6">
          <p className="article text-ink">
            A jurat requires you to sign in the live view of the e-notary{" "}
            <RuleCite id="jurat" /> — pre-signing and then joining the call does not satisfy it.
            Open the pin to read the Section verbatim.
          </p>
          <RuleQuote id="extraterritorial" />
          <div className="border border-line bg-sunken p-5">
            <p className="dateline mb-2 text-accent-text">RuleGloss — our words, not the law</p>
            <RuleGloss id="own-account" />
          </div>
        </div>

        <Sub title="LastReviewed" note="Trust on a legal-information site is mostly a function of recency you can see. Not a badge: a record states its revision date on a dateline, with the date lifted to full ink because the date is the whole claim. The change log opens underneath as a ruled ledger." />
        <LastReviewed
          date={asOf.iso}
          changelog={[
            { date: "2026-08-06", note: "Added the ENP application form update." },
            { date: "2026-04-02", note: "Added the NBI enforcement action." },
          ]}
        />

        <Sub title="SourceList, RelatedLinks" note="The footnote apparatus and the next step. Every page closes with both: hanging ledger numerals over the citations, then a ruled register of where to go next." />
        <div className="space-y-10">
          <SourceList sources={officialSources} />
          <RelatedLinks
            links={[
              {
                label: "Your first e-notarization",
                href: "/guides/first-e-notarization",
                note: "The walkthrough",
              },
              { label: "OFW guide", href: "/guides/ofw", note: "The honest version" },
            ]}
          />
        </div>
      </Spec>

      {/* ================================================================ */}
      <Spec
        id="motion"
        title="Motion and accessibility"
        sub="Every animation in this system is additive: the page is complete, readable and correct with all of it switched off. Nothing appears only after a scroll."
      >
        <Sub
          title="Scroll-driven reveals"
          note={
            <>
              <Tok>.reveal</Tok> and <Tok>.rule-reveal</Tok> are CSS scroll-driven animations —
              no JavaScript, no observer, no hydration cost. Their progress is bound to{" "}
              <Tok>animation-timeline: view()</Tok> over an entry range, not to a clock.
            </>
          }
        />
        <div className="space-y-5">
          <div className="reveal border border-line bg-surface p-5">
            <p className="dateline text-accent-text">.reveal</p>
            <p className="mt-2 text-[0.9375rem]">
              fade-rise: opacity 0 → 1 with a 0.75rem rise, over <Tok>--dur-slow</Tok> (400ms),
              across <Tok>entry 0%</Tok> to <Tok>entry 55%</Tok>. Scroll this block off and back
              on to replay it.
            </p>
          </div>
          <div className="border border-line bg-surface p-5">
            <p className="dateline text-accent-text">.rule-reveal</p>
            <div className="mt-3">
              <BrassRule width="w-full" />
            </div>
            <p className="mt-3 text-[0.9375rem]">
              rule-extend: scaleX 0 → 1 from a left origin, across <Tok>entry 10%</Tok> to{" "}
              <Tok>entry 60%</Tok>. This is what <Tok>BrassRule</Tok> applies when{" "}
              <Tok>animate</Tok> is left on.
            </p>
          </div>
        </div>

        <Callout tone="warning" title="prefers-reduced-motion detaches the timeline, not the duration">
          <p>
            A scroll-driven animation ignores <Tok>animation-duration</Tok> entirely — its
            progress comes from scroll position, so the usual{" "}
            <Tok>animation-duration: 0.01ms</Tok> reset does nothing to it. The reduced-motion
            block therefore sets <Tok>animation-timeline: none !important</Tok>, which is the only
            thing that actually stops it. That rule is deliberately unlayered so it beats every
            utility, always.
          </p>
        </Callout>

        <Sub title="The rest of the motion budget" />
        <ComparisonTable
          caption="Every animation the system ships."
          columns={[
            { key: "name", label: "Name", width: "24%" },
            { key: "what", label: "What it does" },
            { key: "when", label: "Timing" },
          ]}
          rows={[
            {
              id: "seal-draw",
              name: <Tok>.seal-draw</Tok>,
              what: "The seal strokes itself on, once, on load. The outer ring circumference (2·pi·38 = 238.8) seeds the dash offset exactly, so there is no visible gap or pause.",
              when: <span className="font-mono tabular-nums">--dur-draw · 1200ms</span>,
            },
            {
              id: "reveal",
              name: <Tok>.reveal</Tok>,
              what: "fade-rise on scroll entry.",
              when: <span className="font-mono tabular-nums">--dur-slow · 400ms</span>,
            },
            {
              id: "rule-reveal",
              name: <Tok>.rule-reveal</Tok>,
              what: "The brass rule extends from the left on scroll entry.",
              when: <span className="font-mono tabular-nums">--dur-slow · 400ms</span>,
            },
            {
              id: "pressable",
              name: <Tok>.pressable</Tok>,
              what: "scale(0.985) on :active — feedback lands on pointer-DOWN, instantly, not on release.",
              when: <span className="font-mono tabular-nums">--dur-fast · 120ms</span>,
            },
          ]}
        />
        <p className="mt-4 max-w-[46rem] text-fine text-muted">
          The house easing is <Tok>cubic-bezier(0.32, 0.72, 0, 1)</Tok> — critically damped.
          Bounce is permitted only after a real gesture, which on this site means never. The whole
          scroll-driven block is gated behind{" "}
          <Tok>@supports (animation-timeline: view())</Tok>, so a browser that parses the
          animation but has no view timeline gets the fully-visible static page rather than
          content stranded at opacity 0.
        </p>

        <Sub title="Accessibility commitments encoded in the system" />
        <Callout tone="neutral" title="What the tokens guarantee">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              Every interactive target is at least 44px tall. Both button sizes, every accordion
              summary and every index link on this page clear it.
            </li>
            <li>
              Focus is a 3px solid ring at 2px offset in the link colour ({ratio(C.linkOnPaper)}{" "}
              on paper), never removed, never radiused.
            </li>
            <li>
              Colour is never the only carrier of meaning — the verification chip pairs colour
              with a glyph and a word, and callouts pair tone with a mark and a title.
            </li>
            <li>
              <Tok>border-line-strong</Tok> ({ratio(C.controlBorderOnPaper)}) is used wherever a
              border is the sole indicator of a control, per WCAG 1.4.11.
            </li>
            <li>
              <Tok>prefers-reduced-motion</Tok>, <Tok>prefers-reduced-transparency</Tok> and{" "}
              <Tok>prefers-contrast</Tok> all have real handling — the last two swap the
              translucent chrome for a solid fill and darken the line and muted tokens, in both
              editions.
            </li>
            <li>
              All content renders without JavaScript. Only the four tools, the theme toggle and
              the mobile menu need it.
            </li>
            <li>
              Radius is 0 everywhere by design. The only exceptions are the status chip, where a
              capsule reads as a live state, and the seal, where a circle reads as a mark.
            </li>
          </ul>
        </Callout>
      </Spec>

      <footer className="border-t-2 border-ink pt-4">
        <Dateline label="Specimen" />
        <p className="mt-3 max-w-[46rem] text-fine text-muted">
          This page is <Tok>noindex</Tok>. It is maintained as documentation and as a smoke test:
          if you add a primitive to <Tok>components/ui</Tok>, render it here with real props, and
          if you add a colour pair, add its assertion to{" "}
          <Tok>scripts/check-contrast.mjs</Tok> before it appears above.
        </p>
      </footer>
    </div>
  );
}
