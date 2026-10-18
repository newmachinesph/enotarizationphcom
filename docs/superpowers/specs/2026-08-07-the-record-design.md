# The Record — design spec

**Date:** 2026-08-07
**Scope:** Full visual rebrand of the eNotarizationPH website + package-based cookie consent
**Status:** Approved

---

## 1. Concept

The site stops presenting as a *website about* a legal change and starts presenting as
**the record of one**. Not a product, not a service — a public record, kept and dated.

This is not an arbitrary theme. It is the honest read of what the site already is: every
claim traced to the Rules, every page carrying a review date, no provider ever endorsed.
The existing editorial invariants (README, "Editorial invariants") describe a record. The
visual system now says so.

Coherence is also the award case. A jury rewards a site where type, colour, motion and
subject all argue for the same thing. "Record" gives all four a shared reason.

## 2. Decisions taken

| Decision | Choice |
|---|---|
| Art direction | Editorial Broadsheet |
| Branding | Full rebrand, new palette |
| Build scope | Design system + all templates (copy unchanged) |
| Palette | Court Navy — midnight / bone / brass |
| Type | Instrument Serif + Newsreader + Instrument Sans + Geist Mono |
| Motion | Restrained craft (CSS-driven) |
| Consent | `vanilla-cookieconsent@3.1.0` |

## 3. Signature devices

Five devices make a screenshot identifiable as this site and nothing else.

| Device | What it is | Where |
|---|---|---|
| **The Seal** | Concentric-ring notarial seal in SVG, drawn once via `stroke-dasharray` | Hero, favicon, app icon, OG card, article reading-progress ring |
| **The Brass Rule** | Today's `.gold-rule`, promoted from decoration to structure — a ledger hairline that extends on scroll-enter | Every section head, every dateline |
| **Ledger numerals** | `01 —`, `02 —` in Geist Mono, hung in the margin | Section heads, tracker entries, tool steps |
| **The Marginalia rail** | Narrow left column carrying section number, date and citations beside the text measure | Article template, tracker, platforms |
| **The Dateline** | `MANILA · AS OF 6 AUGUST 2026 · REVIEWED`, gazette-style | Every page header |

The Dateline and marginalia rail give editorial invariants #1 (every claim sourced) and #2
(every page dated) a visual home, instead of a badge bolted to the page foot.

## 4. Palette — Court Navy

Bone paper, midnight-navy ink, antique brass. Keeps the civic-blue-and-gold lineage but
matures it from "government website" to "court record".

```
PAPER   50 #FBFAF6  100 #F6F3EC  200 #EDE9DE  300 #DFD8C8  400 #C6BDA8
NAVY    50 #EFF2F8  100 #DBE2F0  200 #B8C5DF  300 #8B9CC4  400 #5C71A0
        500 #3A4E7C  600 #26375F  700 #1A2848  800 #10182B  900 #0A1020  950 #060A15
BRASS   50 #FBF7EF  100 #F4EAD4  200 #E8D3A8  300 #D9B978  400 #C99E4E
        500 #B8873A  600 #96692B  700 #745022  800 #573C1D  900 #3F2C17
CIVIC   600 #1B4A8F (links, day)   300 #8FA9D6 (links, night)
```

Role assignments:

- `navy-800` is ink. `navy-900` is the inverse surface and the seal.
- `brass-500` is the accent. `brass-300` is the accent **on navy**. `brass-700` is the only
  brass safe for text on paper.
- Semantic colours stay unclaimed by the brand so nothing fights it:
  `success #16643F`, `warning #8A5200`, `danger #A32017`, each with a soft companion.

**Night edition** (dark mode): paper inverts to `#0A1020`, brass holds at `#D9B978`, links
move to `civic-300`.

**Radius stays 0.** It is already the strongest thing about the current system and it is
exactly what "record" wants. The two documented exceptions — pill status chips, circular
seals — survive unchanged.

Every foreground/background pair is asserted by a check script (§9), not eyeballed.

## 5. Type

| Role | Face | Treatment |
|---|---|---|
| Display | Instrument Serif 400 | `clamp(2.5rem, 1.8rem + 4vw, 5.5rem)`, `-0.03em`, line-height 0.95 |
| Article | Newsreader variable, `opsz 6–72` | 46rem measure, optical size bound to type size |
| UI | Instrument Sans variable | Nav, buttons, labels, form controls |
| Data | Geist Mono | Dates, amounts, numerals, statuses |

All four self-hosted at build time via `next/font/google` — no runtime external requests.

**Constraint, verified:** Instrument Serif ships **weight 400 only**; Google Fonts silently
clamps a 700 request back to 400. Display headings are therefore set at 400 and rely on size
and contrast. The current `font-weight: 600` on `h1–h4` must be removed, or the browser
synthesises a fake bold and smears the high-contrast strokes.

The display/reading split is the point: one serif for headlines set enormous and tight, a
different serif engineered for long legal prose. It is why broadsheets do not look like
blogs with big text.

## 6. Structure

```
app/globals.css          token layer + .broadsheet grid, rewritten
components/marks/        NEW — Seal, BrassRule, LedgerNumber, Dateline
components/consent/      NEW — CookieConsent (vanilla-cookieconsent binding)
components/ui/           15 primitives rebuilt on new tokens
content/data/tokens.json regenerated to mirror the new palette
```

New grid:

```css
.broadsheet {
  display: grid;
  grid-template-columns: [rail] minmax(0, 14rem) [text] minmax(0, 46rem) [wide] 1fr;
}
```

Collapses to a single column below `lg`, with rail contents inlining above the text.

Templates revamped: homepage (6 sections), the `[...slug]` MDX template (covers all 12
content pages), 4 tools + 2 shells, tracker, platforms, FAQ, 3 index pages, styleguide,
404, header, footer, and the new `/privacy`.

Identity regenerated from the seal: `icon.tsx`, `apple-icon.tsx`, and `og/route.tsx`
redrawn as a broadsheet front page.

## 7. Motion — restrained craft

CSS `animation-timeline: view()` and `scroll()` carry the work; the already-installed
`motion` package stays only for what CSS cannot express.

- Reveals stagger on section enter
- Brass rules extend as their section enters
- Tracker numerals count up
- The seal draws itself once on load
- Primary actions take a subtle magnetic hover

`prefers-reduced-motion` collapses every one to nothing. The existing global rule covers
`animation-duration` and `transition-duration` but **not** scroll-driven timelines; it must
be extended with `animation-timeline: none`.

Budget: no new JS on the homepage critical path.

## 8. Cookie consent

`vanilla-cookieconsent@3.1.0` — MIT, zero runtime dependencies, ~15KB. Verified on npm.

- Two categories: **necessary** (locked on), **analytics** (opt-in, default off).
- **Google Consent Mode v2**: a `beforeInteractive` script sets `analytics_storage: denied`
  *before* `@next/third-parties` loads gtag; accepting fires `gtag('consent','update')`.
  Today GA fires unconditionally on load — this is a real compliance change, not decoration.
  Relevant to the Data Privacy Act of 2012 (RA 10173).
- Skinned through the library's own CSS custom properties mapped to our tokens
  (`--cc-btn-border-radius: 0`, brass primary, bone surface) so it reads as part of the site.
- Footer gains **Cookie preferences** (`data-cc="show-preferencesModal"`) beside **Privacy**.
- New `/privacy` MDX page: what GA collects, the legal basis, how to withdraw consent.
  Required — a consent banner that links nowhere is worse than no banner.

## 9. Verification

Baseline captured before any change: **33 static routes, clean build, TypeScript clean.**

1. `npm run build` and `npm run lint` clean, still 33+ routes.
2. Contrast script asserting every foreground/background token pair ≥ 4.5:1 (≥ 3:1 large),
   **both themes**. Runs as a script, not by eye.
3. Lighthouse via chrome-devtools on homepage, one article, one tool: accessibility 100,
   no performance regression against the baseline.
4. Keyboard-only pass over the consent modal, the FAQ accordion, and the four tools.
5. The five README editorial invariants re-verified: disclaimer on every page, visible
   review dates, the OFW carve-out never stated without its caveat, no provider endorsement.

## 10. Known consequences

1. **`content/data/tokens.json` desyncs downstream.** It mirrors the palette for the
   Remotion video project. It is regenerated here, but already-rendered video assets and
   the 60-day social calendar keep the old blue/gold until someone re-renders them. Outside
   this repo; not touched.
2. **~40 files change.** Sequenced token layer → primitives → templates so it is reviewable
   in stages rather than as one unreadable diff.
3. **Copy is preserved exactly.** Scope excludes copy changes; only typography and layout
   around the strings change.

## 11. Out of scope

- Rewriting page copy or replacing the hero image
- Re-rendering the Remotion video assets
- Changing tool decision logic in `content/logic/`
- Any change to the contents of the four editorial data files
