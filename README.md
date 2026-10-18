# eNotarizationPH — website

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A civic education site explaining **electronic notarization in the Philippines** under the
Supreme Court's Rules on Electronic Notarization (A.M. No. 24-10-14-SC). It is written for
the people who will actually use e-notarization — first-timers, OFWs, lawyers — in plain
Taglish, with every legal claim cited to the Rules and every page dated. Alongside the guides
it ships four small client-side tools (eligibility checker, OFW route finder, cost estimator,
readiness checklist), a rollout tracker and a neutral list of platforms.

- **Stack:** Next.js 16 (App Router, static-first), React 19, TypeScript, Tailwind CSS 4,
  MDX via `next-mdx-remote`, `motion`, `vanilla-cookieconsent`.
- **Design:** "The Record" — Court Navy (midnight / bone / brass), Instrument Serif,
  Newsreader, Instrument Sans and Geist Mono; WCAG 2.2 AA, mobile-first. The full spec is in
  [`docs/superpowers/specs/2026-08-07-the-record-design.md`](docs/superpowers/specs/2026-08-07-the-record-design.md);
  the house writing rules are in [`docs/WRITING.md`](docs/WRITING.md).
- **Not** a law firm, not a notary service, **not an accredited e-notarization provider**, and
  not affiliated with the Supreme Court or any platform. This site educates; it cannot notarize
  anything. That disclaimer is in `lib/brand.ts` as `NOT_A_PROVIDER` and renders on every page.

## Running it

Requires Node.js 20.9+ (Next.js 16).

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # static generation of every content page
npm run start            # serve the production build
npm run lint             # ESLint (eslint-config-next)
npm run check:contrast   # assert every colour pair in the palette meets WCAG contrast
```

There is no unit-test suite; `lint`, `check:contrast` and `build` are the checks.

---

# Editing the site — for non-developers

You do not need to write code to keep this site accurate. Everything below is a text file you
can edit in any editor.

## 1. Add or edit a page

Pages live in **`content/pages/`**. The folder structure *is* the URL:

| File | URL |
| --- | --- |
| `content/pages/learn/glossary.mdx` | `/learn/glossary` |
| `content/pages/safety.mdx` | `/safety` |

To add a page, create a new `.mdx` file in the right folder. It must start with a block like
this (this is the "frontmatter"):

```yaml
---
title: "The page title, shown as the big heading"
description: "One or two sentences. Used as the intro and as the Google description."
lastReviewed: "2026-08-06"      # always YYYY-MM-DD
persona: "who this page is for"
eyebrow: "Small label above the title"        # optional
keywords:
  - a search phrase
  - another search phrase
statusBanner: true               # true = show the "as of" rollout strip
priority: "P0"                   # P0 = full copy, P1/P2 = outline (shows a notice)
section: { label: "Learn", href: "/learn" }   # optional breadcrumb
---
```

Below the frontmatter, write ordinary Markdown. You can also drop in these ready-made blocks:

```mdx
<QuickAnswer>The short answer, 60 words or fewer.</QuickAnswer>

<Callout tone="warning" title="Read this carefully">
Tones: info, success, warning, danger, neutral.
</Callout>

<StatusBanner />

```

(FAQs are **not** written in MDX — see section 5.)

The page appears in the `/learn` or `/guides` list automatically. No other file needs changing.

## 2. Update the "last reviewed" date

Change `lastReviewed` in that page's frontmatter. That is all — the badge updates itself.

To record *what* changed, add a changelog to the frontmatter:

```yaml
changelog:
  - { date: "2026-09-01", note: "Updated the fee range after the SC guide was published." }
```

## 3. Add a rollout tracker entry

Edit **`content/data/tracker.json`**. Copy the top block in `entries` and edit it — newest first:

```json
{
  "date": "2026-09-15",
  "category": "commissioning",
  "headline": "One line, plain language",
  "detail": "Two or three sentences of context, including what it does NOT mean.",
  "sourceUrl": "https://sc.judiciary.gov.ph/..."
}
```

`category` is one of: `rules`, `accreditation`, `commissioning`, `enforcement`, `acceptance`,
`market`.

The three newest entries also appear on the homepage automatically.

### Agency acceptance matrix

Same file, `acceptance` array. `status` is `announced`, `case-by-case`, or `silent`
(= we found no public statement — **not** that they refuse).

## 4. Add or correct a platform

Edit **`content/data/platforms.json`**. Also update `lastChecked` at the top.

`verification` must be one of:

| Value | Means |
| --- | --- |
| `official` | Named among the providers the Supreme Court has accredited |
| `self-reported` | Claims accreditation but is **not** among those accredited |
| `unverified` | No evidence either way |
| `not-applicable` | Does not do Philippine notarization at all |

As of 7 August 2026 (the file's `lastChecked`) the accredited providers are **Twala**, **QLegal** and **NotarizeIT**.

**Neutrality rules, non-negotiable:** describe, never endorse. Use *claims*, *publishes*,
*states* for anything not accredited. No paid placement. Philippine providers stay
alphabetical; the US-platforms row stays last because it explains an absence.

## 5. Add an FAQ

**For the main `/faq` page** — edit `content/data/faq.json`, find the right group and add:

```json
{ "lang": "tl", "q": "Ang tanong?", "a": "Ang sagot.", "asOf": "2026-09-01" }
```

**For questions at the bottom of one particular page** — edit
`content/data/page-faqs.json`, keyed by that page's URL:

```json
"/guides/ofw": [
  { "lang": "tl", "q": "Ang tanong?", "a": "Ang sagot." }
]
```

In both files:

- `lang` is `en` or `tl` — **answer in the language of the question**.
- `asOf` (main FAQ only) is optional; add it to anything time-sensitive.

The Google FAQ rich-result markup regenerates itself from these files.

> **Why FAQs are not inside the `.mdx` files:** this MDX pipeline passes string
> attributes to components but drops JSX *expression* attributes, so a
> `<FaqAccordion items={[...]} />` written in MDX renders empty. Keeping the
> questions in a data file avoids the trap entirely — and is easier to edit.
> The same limit applies to any component needing array or object props.

## 6. Change the site-wide "as of" date

Edit `asOf` in **`lib/brand.ts`**. Every status banner and the tracker follow it.

The brand name, domain, tagline, navigation and official source links all live in that same
file — change them in one place.

## 7. Change what a tool says

Each tool's rules are a plain data file, deliberately separate from the interface code:

| Tool | Rules file |
| --- | --- |
| Can it be e-notarized? | `content/logic/eligibility.ts` |
| OFW route finder | `content/logic/ofw-routes.ts` |
| Cost estimator | `content/logic/cost.ts` |
| Readiness checklist | `content/logic/readiness.ts` |

You can change questions, options, prices and result text without touching a component.

---

# For developers

## Layout

```
app/                    routes; [...slug] is the catch-all MDX renderer
components/ui/          design-system primitives (see /styleguide)
components/tools/       the four client-side tools
components/layout/      header, footer, theme toggle
components/mdx/         MDX component map
content/pages/          the site's prose, as .mdx
content/data/           tracker, platforms, faq, tokens
content/logic/          tool decision rules
lib/                    brand config, content loader, analytics, utils
public/images/          editorial illustrations
scripts/                check-contrast.mjs (WCAG contrast assertions)
docs/                   writing rules and the design spec
```

## Design system

`app/globals.css` is the source of truth for tokens; `content/data/tokens.json` mirrors it for
non-web targets (e.g. a video project). **/styleguide** renders every component
live.

Motion follows Apple's fluid-interface guidance: feedback on pointer-down, critically damped
springs by default (`damping 1.0`), bounce only after a gesture with real momentum, and full
handling for `prefers-reduced-motion`, `prefers-reduced-transparency` and `prefers-contrast`.

## Analytics

Google Analytics (`G-DLM0MFC20R`) loads via `@next/third-parties/google` in
`app/layout.tsx`. Override the ID per environment with `NEXT_PUBLIC_GA_ID`.

`lib/analytics.ts` itself stays provider-agnostic — one `track()` helper that no-ops until a
sink is installed. **`components/analytics/AnalyticsBridge.tsx` is the only file that knows
about GA**; it forwards events with `sendGAEvent`. To switch providers, change that one file:

```ts
setAnalyticsSink((event, props) => window.plausible?.(event, { props }));
```

Events: `page_view`, `tool_started`, `tool_completed`, `outbound_official_link`,
`checklist_printed`.

## Deploying to Vercel

Zero configuration — import the repo (the app is at the repository root), deploy. Then:

1. Set the production domain.
2. Update `brand.url` in `lib/brand.ts` to match, so canonical URLs, the sitemap and OG images
   point at the right host.

## Editorial invariants (please keep these)

1. Every legal claim traces to the Rules or an official Supreme Court page.
2. Every page carries a visible `lastReviewed` date, and time-sensitive pages carry the status
   banner.
3. Never state that an OFW can e-notarize from home abroad. The embassy carve-out is the only
   exception, and it always ships with its availability caveat.
4. The disclaimer closes every page.
5. No endorsement of any provider, ever.

## License

The code is released under the [MIT License](LICENSE). MIT covers the code; the
eNotarization PH name and marks identify the project.
