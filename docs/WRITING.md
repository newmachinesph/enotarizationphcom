# How we write

This is enforceable, not aspirational. If a sentence breaks a rule here, it gets cut.

## 1. The banned list

Never ship these. They are the fingerprints of machine-written filler:

**Openers:** "In today's digital age", "In an increasingly digital world", "In the
ever-evolving landscape of", "Gone are the days when", "Whether you're a … or a …".

**Connectives:** "It's important to note that", "It's worth mentioning", "That said",
"Moreover", "Furthermore", "In conclusion", "Ultimately", "At the end of the day".

**Adjectives:** seamless, robust, cutting-edge, game-changer, revolutionary, streamlined,
empower, unlock, leverage, navigate the complexities of, delve into, dive in.

**Shapes:** the rule-of-three for rhythm ("fast, simple, and secure"); a closing paragraph
that restates the opening; an H2 that repeats the H1 in other words.

## 2. Sentence discipline

- **Vary length.** Every paragraph needs at least one sentence under eight words. If four
  sentences in a row run over twenty, rewrite.
- **One em dash per paragraph, maximum.** Two is a tic.
- **No hedge stacks.** "May sometimes potentially" — pick one, or state the condition.
- **Cut any sentence that only restates the sentence before it.** This is the single most
  common failure. Read each paragraph and delete the second sentence if it adds no fact.

## 3. Every claim is sourced or flagged

Three categories, no fourth:

| Kind | How it appears |
| --- | --- |
| From the Rules | `<RuleCite id="jurat" />` — pins it to a real Section |
| From a dated outside source | Named, linked, with the date in the sentence |
| Our own observation | Says so: "Sa nakikita namin…", "We could not verify…" |

If a legal claim has no `id` in `content/data/rules-citations.json`, it does not ship. That
file is the only permitted basis for a statement about what the Rules require.

**Never invent a section number.** If we have not read it, we write "under the Rules" and
open an issue to go read it.

## 4. Taglish: how, exactly

**Body Taglish, English structure.** This is the split:

| English | Taglish |
| --- | --- |
| H1, H2, H3 | Body paragraphs |
| `title`, `description`, `keywords` | Callouts, examples |
| JSON-LD, breadcrumbs | FAQ answers |
| Legal terms of art (jurat, acknowledgment, ENP) | Everything around them |

**Write how people actually switch, not translated English.** The test: read it aloud. If it
sounds like a form, it fails.

- Good: "Hindi ka pwedeng mag-e-notaryo mula sa apartment mo sa Dubai. Bawal talaga."
- Bad: "Ikaw ay hindi pinapayagan na magsagawa ng elektronikong notaryo mula sa iyong tirahan."

**Keep the English term when that is what people say.** Nobody says "elektronikong notaryo
publiko". They say "e-notary" or "notaryo". Use those.

**Second person.** "Ikaw", "mo", "ka". Never "one", never "the user", never "ang mamamayan".

## 5. Structure that serves answers

- **First 60 words answer the question.** Someone who reads only the Quick Answer must leave
  with the correct answer, not a teaser.
- **H2s are questions people type**, in English, because that is what gets searched.
- **One idea per paragraph.** Three sentences is usually enough.
- **Tables beat prose** for anything with two or more dimensions.
- **Dates are absolute.** "As of 6 August 2026", never "recently" or "currently".

## 6. The honesty rules that outrank style

1. Never write that an OFW can e-notarize from home abroad. The `extraterritorial` carve-out
   always ships with its availability caveat.
2. Never state a peso figure as coming from the Rules unless it is in the Rules. It is not —
   see `application-fee`.
3. Where nobody has announced anything, publish the absence. "Walang anunsyo" is a fact.
4. Never call a provider accredited without an `official` verification status behind it.

## 7. Before you commit

Read the page aloud. Then check:

- [ ] Zero phrases from §1
- [ ] Every legal claim has a `RuleCite`
- [ ] Quick Answer works alone
- [ ] Taglish sounds spoken, not translated
- [ ] No paragraph restates the one above it
- [ ] Dates absolute, disclaimer present
