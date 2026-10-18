/**
 * DECISION LOGIC — "Can it be e-notarized?"
 *
 * Editors: this file is the rulebook. You can change the questions, the
 * options and the outcomes here without touching any component code. Every
 * outcome must carry `basis` (why the Rules say this) and a `deepLink`.
 *
 * Tone rule, enforced by review: no outcome may read as a rejection. Even
 * "no" outcomes are titled as a route ("here's your path"), never "DENIED".
 */

export type DocKind =
  | "spa"
  | "affidavit"
  | "deed"
  | "will"
  | "deposition"
  | "contract"
  | "board-resolution"
  | "other-sworn"
  | "unsure";

export type Form = "wet-ink-paper" | "can-redo-digitally" | "already-pdf";
export type Where = "all-in-ph" | "abroad-near-post" | "abroad-far";
export type Act = "jurat" | "acknowledgment" | "signature-witnessing" | "unsure";

export type Answers = {
  doc: DocKind;
  form: Form;
  where: Where;
  act: Act;
};

export type Outcome = {
  id: string;
  tone: "good" | "caution" | "reroute";
  title: string;
  summary: string;
  nextSteps: string[];
  basis: string;
  deepLink: { label: string; href: string };
};

export type Question = {
  id: keyof Answers;
  label: string;
  help: string;
  options: { value: string; label: string; hint: string }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "doc",
    label: "What kind of document is it?",
    help: "Pick the closest match. If nothing fits, choose the last option.",
    options: [
      { value: "spa", label: "Special Power of Attorney (SPA)", hint: "Letting someone act for you back home" },
      { value: "affidavit", label: "Affidavit", hint: "Affidavit of loss, support, consent to travel, sworn statement" },
      { value: "deed", label: "Deed of sale", hint: "Vehicle, land, or other property" },
      { value: "will", label: "A will", hint: "A notarial will disposing of your property after death" },
      { value: "deposition", label: "A deposition", hint: "Sworn testimony taken for a court case" },
      { value: "contract", label: "Contract or agreement", hint: "Lease, loan, service agreement" },
      { value: "board-resolution", label: "Business document", hint: "Board resolution, secretary's certificate" },
      { value: "other-sworn", label: "Another sworn statement", hint: "Anything where you swear the contents are true" },
      { value: "unsure", label: "I'm not sure", hint: "We'll give you the safe general answer" },
    ],
  },
  {
    id: "form",
    label: "What shape is the document in right now?",
    help: "This matters more than most people expect.",
    options: [
      { value: "already-pdf", label: "It's already a PDF", hint: "Typed and saved as a PDF" },
      { value: "can-redo-digitally", label: "It's on paper, but I can redo it digitally", hint: "Nothing is signed in ink yet" },
      { value: "wet-ink-paper", label: "It's on paper and already signed in ink", hint: "Someone has signed it with a pen" },
    ],
  },
  {
    id: "where",
    label: "Where is every person who has to sign?",
    help: "Every single signatory — not just you.",
    options: [
      { value: "all-in-ph", label: "Everyone is in the Philippines", hint: "Physically inside the country right now" },
      {
        value: "abroad-near-post",
        label: "Someone is abroad and can reach a PH embassy or consulate",
        hint: "Close enough to travel there in person",
      },
      {
        value: "abroad-far",
        label: "Someone is abroad and cannot reach a PH post",
        hint: "Too far, no leave from work, or no post nearby",
      },
    ],
  },
  {
    id: "act",
    label: "Which notarial act does the document need?",
    help: "Jurat = you swear the contents are true, and you must sign live in front of the notary. Acknowledgment = you confirm the signature is yours, and it can already be signed. Signature witnessing = no oath, but the e-notary must watch you sign. If you don't know, pick the last option.",
    options: [
      { value: "jurat", label: "Jurat — I'm swearing the contents are true", hint: "Affidavits usually need this" },
      {
        value: "acknowledgment",
        label: "Acknowledgment — I'm confirming I signed it",
        hint: "Deeds and SPAs usually need this. Not the same as signature witnessing, where you must still sign live.",
      },
      {
        value: "signature-witnessing",
        label: "Signature witnessing — the notary just watches me sign",
        hint: "No oath, but you still must sign live",
      },
      { value: "unsure", label: "Help me tell the difference", hint: "We'll explain and give you the safe answer" },
    ],
  },
];

const EXCLUDED: Partial<Record<DocKind, { title: string; why: string }>> = {
  will: {
    title: "A will has to stay on paper — here's your path",
    why: "Notarial wills are expressly excluded from electronic notarization under the Rules.",
  },
  deposition: {
    title: "A deposition can't be e-notarized — here's your path",
    why: "Depositions are expressly excluded from electronic notarization under the Rules.",
  },
};

/**
 * Pure function. Given the four answers, returns exactly one outcome.
 * Order matters: hard exclusions first, then geography, then form, then act.
 * Because geography returns early, any outcome that returns before the form
 * and act checks must repeat the warnings those checks would have produced.
 */
export function evaluate(a: Answers): Outcome {
  // 1. Hard exclusions in the Rules. Nothing else can change these.
  const excluded = EXCLUDED[a.doc];
  if (excluded) {
    return {
      id: `excluded-${a.doc}`,
      tone: "reroute",
      title: excluded.title,
      summary: `${excluded.why} This is not a problem with your document — it is simply outside what electronic notarization covers. Traditional notarization under the 2004 Rules on Notarial Practice is the route.`,
      nextSteps: [
        "Prepare the document on paper in the usual way.",
        "Book a traditional notary public, in person.",
        "For a will, talk to a lawyer first — the formalities are strict and mistakes are expensive.",
      ],
      basis: "Rules on Electronic Notarization — excluded documents.",
      deepLink: { label: "What the Rules cover and exclude", href: "/learn/the-rules-explained" },
    };
  }

  // 2. Geography. The e-notary must be in the Philippines; so, generally, must everyone else.
  if (a.where === "abroad-far") {
    return {
      id: "abroad-far",
      tone: "reroute",
      title: "Someone abroad can't join from home — but you still have routes",
      summary:
        "Under the Rules, remote electronic notarization requires everyone to be physically in the Philippines. The only exception is a principal who is physically inside a Philippine embassy, consular office or Honorary Consul's office at the time. Sitting at home abroad does not qualify, and using a VPN to fake a location is itself a punishable act.",
      nextSteps: [
        "Read the OFW guide — it lays out the three routes that actually work.",
        "Consular notarization at a Philippine post is usually the most reliable route (roughly US$25 per document).",
        "A local foreign notary plus an apostille can work, depending on who will receive the document.",
        "If the person in the Philippines can act instead, a properly executed SPA may solve the whole problem.",
      ],
      basis: "Rules on Electronic Notarization — location requirements for remote sessions.",
      deepLink: { label: "The honest OFW guide", href: "/guides/ofw" },
    };
  }

  if (a.where === "abroad-near-post") {
    return {
      id: "abroad-near-post",
      tone: "caution",
      title: "Possible from inside a Philippine post — check availability first",
      summary:
        "A principal abroad may join a remote electronic notarization only while physically inside a Philippine embassy, consular office or Honorary Consul's office. They must pan the camera to show where they are, and an officer at the post must confirm their presence. Availability is not guaranteed at every post yet.",
      nextSteps: [
        "Contact the specific embassy or consulate and ask whether they support this. Do not assume.",
        "Ask about their alternative: straightforward consular notarization, which most posts already do.",
        "Have the document ready as a PDF before booking anything.",
        // Geography returns before the form and act checks below, so the two
        // warnings that would otherwise be missed have to be repeated here.
        ...(a.act === "jurat" || a.act === "signature-witnessing" || a.act === "unsure"
          ? [
              "Bring it UNSIGNED. This document needs you to sign live in the e-notary's view, and travelling to a post with a pre-signed copy wastes the whole trip.",
            ]
          : []),
        ...(a.form === "wet-ink-paper"
          ? [
              "Your copy is signed in ink on paper. The Rules exclude wet-signature paper instruments, so reproduce it as a clean PDF before you go — or just have the post notarize the paper the ordinary consular way.",
            ]
          : []),
      ],
      basis:
        "Rules on Electronic Notarization — limited exception for principals inside Philippine foreign-service posts.",
      deepLink: { label: "The honest OFW guide", href: "/guides/ofw" },
    };
  }

  // 3. Form of the document.
  if (a.form === "wet-ink-paper") {
    // A jurat and signature witnessing both require live signing in the ENP's
    // full view, so an ink-signed copy defeats either one.
    if (a.act === "jurat" || a.act === "signature-witnessing") {
      return {
        id: "wet-ink-jurat",
        tone: "caution",
        title: "Don't pre-sign it — redo this one digitally",
        summary:
          a.act === "jurat"
            ? "A jurat means you swear the contents are true, and the Rules require you to sign it live, in view of the e-notary. A document already signed in ink cannot satisfy that. The fix is easy: prepare a clean, unsigned PDF and sign it during the session."
            : "Signature witnessing means the e-notary watches you sign — there is no oath, but the signing itself has to happen in their full view. A document already signed in ink cannot satisfy that. The fix is easy: prepare a clean, unsigned PDF and sign it during the session.",
        nextSteps: [
          "Start from the unsigned text and save it as a PDF.",
          "Do not sign it. Bring it to the session unsigned.",
          "Sign live, on camera, when the e-notary asks you to.",
          "If you cannot redo it, a traditional notary can handle the paper original instead.",
        ],
        basis:
          "Rules on Electronic Notarization — a jurat must be signed in the presence of the e-notary (Rule IV, Sec. 3), and signature witnessing requires the principal to sign using the platform in the e-notary's full view (Rule IV, Sec. 4).",
        deepLink: {
          label: "Your first e-notarization, step by step",
          href: "/guides/first-e-notarization",
        },
      };
    }
    return {
      id: "wet-ink-acknowledgment",
      tone: "caution",
      title: "Redo it unsigned, or keep it on paper",
      summary:
        "Paper documents signed in ink stay under the 2004 Rules on Notarial Practice, so a traditional notary is the reliable route. A scanned document does count as an electronic document under the Rules — but the same Rules also exclude paper instruments bearing wet-ink signatures from electronic notarization altogether, and accredited platforms are expected to block them. Treat the scan route as something to ask the platform about, not something to count on. If you can reproduce the document unsigned as a PDF, that removes the question entirely.",
      nextSteps: [
        "Path A — cleanest: reproduce the document as an unsigned PDF and e-notarize it normally.",
        "Path B — traditional: bring the signed paper to a notary public in person. This always works.",
        "Path C — ask, don't assume: some platforms may accept a scan of an ink-signed document for an acknowledgment, but the Rules exclude wet-signature paper instruments and platforms are expected to refuse them. Confirm before you pay.",
        "Ask the office that will receive the document which form they prefer before you choose.",
      ],
      basis:
        "Rules on Electronic Notarization — Rule I, Sec. 4(d) treats scans as electronic documents, but Rule I, Sec. 5 excludes paper documents and instruments with wet signatures or marks. The two sit in tension; the safe reading is that ink-signed paper belongs to the 2004 Rules.",
      deepLink: { label: "IEN vs REN — which mode fits", href: "/learn/ien-vs-ren" },
    };
  }

  // 4. Everyone in PH, document is or can be a PDF: eligible.
  // Both a jurat and signature witnessing require signing live in the ENP's
  // full view, so a pre-signed document fails either way. "unsure" gets the
  // safe answer.
  const mustSignLive =
    a.act === "jurat" || a.act === "signature-witnessing" || a.act === "unsure";
  return {
    id: mustSignLive ? "eligible-jurat" : "eligible-acknowledgment",
    tone: "good",
    title: "Yes — this fits electronic notarization",
    summary: mustSignLive
      ? "Everyone is in the Philippines and the document is (or can be) a PDF, so both modes are open to you: in-person electronic notarization, where you appear before the e-notary but the document is electronic, or remote electronic notarization by video. Because this act needs you to sign in the e-notary's view — a jurat and signature witnessing both do — keep the document unsigned and sign it live during the session."
      : "Everyone is in the Philippines and the document is (or can be) a PDF, so both modes are open to you: in-person electronic notarization, where you appear before the e-notary but the document is electronic, or remote electronic notarization by video. For an acknowledgment, a document that is already signed is fine.",
    nextSteps: [
      "Save the document as a PDF (PDF/A is ideal).",
      mustSignLive
        ? "Leave it unsigned. You will sign it live, on camera."
        : "An existing signature is fine for an acknowledgment.",
      "Get a valid, unexpired government ID with your photo and signature.",
      "Create your own account on a platform — for a remote session the Rules require one account per person, no sharing.",
      "Check the current rollout status before you plan around a deadline.",
    ],
    basis:
      "Rules on Electronic Notarization — electronic documents in PDF or PDF/A, IEN and REN modes, all parties in the Philippines.",
    deepLink: {
      label: "Your first e-notarization, step by step",
      href: "/guides/first-e-notarization",
    },
  };
}
