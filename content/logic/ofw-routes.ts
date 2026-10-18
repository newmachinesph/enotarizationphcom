/**
 * DECISION LOGIC — OFW Route Finder.
 *
 * The honest core of this site. An OFW at home in Dubai cannot e-notarize
 * from the sofa; every route below is one that actually exists.
 * Editors: change routes and matrix rows here, never in the component.
 */

export type Reach = "yes" | "hard" | "no";
export type UsedWhere = "in-ph" | "abroad";
export type Urgency = "urgent" | "weeks" | "flexible";

export type OfwAnswers = {
  place: string;
  doc: "spa" | "affidavit" | "deed" | "consent-to-travel" | "other";
  urgency: Urgency;
  reach: Reach;
  usedWhere: UsedWhere;
};

export type RouteId = "consular" | "apostille" | "ren-at-post" | "family-spa";

export type Route = {
  id: RouteId;
  name: string;
  oneLiner: string;
  steps: string[];
  cost: string;
  timeline: string;
  bring: string[];
  scamWarning: string;
  caveat?: string;
};

export const ROUTES: Record<RouteId, Route> = {
  consular: {
    id: "consular",
    name: "Consular notarization at the Philippine post",
    oneLiner:
      "You appear in person at the Philippine embassy or consulate and a consular officer notarizes the document. It comes back ready for use in the Philippines.",
    steps: [
      "Find the Philippine embassy, consulate or Honorary Consul with jurisdiction over where you live.",
      "Book an appointment. Most posts require one; walk-ins are often turned away.",
      "Prepare the document — printed, complete, and unsigned unless the post tells you otherwise.",
      "Appear in person with your passport and any supporting IDs.",
      "Sign in front of the consular officer, pay the fee, and collect the notarized document.",
      "Send it home. No apostille is needed for a consularized document used in the Philippines.",
    ],
    cost: "Around US$25 per document, plus travel.",
    timeline:
      "Same day at many posts, once you have the appointment. Getting the appointment is usually the slow part.",
    bring: [
      "Your Philippine passport",
      "A second government ID if you have one",
      "The complete document, printed, usually unsigned",
      "Payment in the currency the post accepts",
    ],
    scamWarning:
      "Fixers outside embassies who offer to 'process' documents for you are not consular officers. Only pay at the official cashier and only take documents from official staff.",
  },
  apostille: {
    id: "apostille",
    name: "Local notary abroad, then apostille",
    oneLiner:
      "A notary in the country you live in notarizes the document, then that country's authority attaches an apostille certificate so the Philippines will recognise it.",
    steps: [
      "Check that the country you are in is party to the Apostille Convention. If it is not, this becomes legalisation instead and takes much longer.",
      "Have the document notarized by a local notary.",
      "Submit it to the designated apostille authority in that country.",
      "Receive the apostille certificate attached to the document.",
      "Send the apostilled document to the Philippines.",
    ],
    cost: "Varies widely by country — local notary fee plus an apostille fee. Often more than the consular route.",
    timeline: "Days to several weeks, depending on the apostille authority.",
    bring: ["Your passport", "The document", "Whatever ID the local notary requires"],
    scamWarning:
      "Some agencies charge a large markup to 'handle' an apostille you could file yourself. Check the official government fee before agreeing to anything.",
    caveat:
      "Confirm with the office that will receive the document in the Philippines that they accept an apostilled foreign-notarized document. Some prefer consularized documents.",
  },
  "ren-at-post": {
    id: "ren-at-post",
    name: "Remote electronic notarization from inside a Philippine post",
    oneLiner:
      "You join a video session with a Philippine e-notary while you are physically inside a Philippine embassy, consular office or Honorary Consul's office.",
    steps: [
      "Contact the post first and ask whether they support this. Do not travel on the assumption that they do.",
      "Book with an accredited platform and an Electronic Notary Public.",
      "Attend at the post at the agreed time, with the document already as a PDF.",
      "During the session, pan your camera to show that you are inside the post.",
      "An officer at the post confirms your presence to the e-notary.",
      "Listen to the e-notary explain the document, then confirm it is the one you uploaded.",
      "Sign live on camera if the act needs it — a jurat and signature witnessing both do — and take the oath the e-notary administers for a jurat or an affirmation.",
    ],
    cost: "Platform and e-notary fees, plus travel to the post. No official Supreme Court fee schedule has been published yet.",
    timeline: "Depends entirely on the post's availability.",
    bring: [
      "Valid unexpired government ID with photo and signature",
      "Your own platform account and login credentials, set up and tested before you travel",
      "A device with a working camera and microphone, unless the post provides one",
      "The document as a PDF, unsigned if the act needs you to sign live",
    ],
    scamWarning:
      "Any platform that says you can do this from your apartment is describing something the Rules do not allow. Using a VPN to fake your location is itself a punishable act.",
    caveat:
      "⚠️ Availability varies by post and may not exist where you are. Treat this as the route to ask about, not the route to count on.",
  },
  "family-spa": {
    id: "family-spa",
    name: "Have family in the Philippines act instead",
    oneLiner:
      "Rather than notarizing abroad, you give someone in the Philippines authority to act for you — then the work happens locally.",
    steps: [
      "Work out exactly what needs to be done in the Philippines and who could do it.",
      "Have an SPA drafted that covers precisely those acts. Vague SPAs get rejected.",
      "Execute the SPA by whichever route works for you — usually consular notarization.",
      "Send the executed SPA home.",
      "Your attorney-in-fact handles the transaction locally, including any notarization it needs.",
    ],
    cost: "One document's worth of consular or apostille cost, rather than several.",
    timeline: "Slower to set up, much faster afterwards if more documents follow.",
    bring: [
      "Full legal name and ID details of the person you are appointing",
      "A precise list of the acts they may perform",
    ],
    scamWarning:
      "An SPA is real authority over your affairs. Only appoint someone you trust completely, and limit it to specific acts with an end date.",
  },
};

/** The audit matrix. Every combination resolves through these rules, in order. */
export const DECISION_MATRIX: {
  when: string;
  primary: RouteId;
  alternates: RouteId[];
}[] = [
  {
    when: "Cannot reach a Philippine post at all",
    primary: "apostille",
    alternates: ["family-spa"],
  },
  {
    when: "Hard to reach a post, and the document is for use in the Philippines",
    primary: "family-spa",
    alternates: ["consular", "apostille"],
  },
  {
    when: "Hard to reach a post, and the document is for use abroad",
    primary: "apostille",
    alternates: ["consular"],
  },
  {
    when: "Can reach a post, needed urgently",
    primary: "consular",
    alternates: ["ren-at-post"],
  },
  {
    when: "Can reach a post, not urgent",
    primary: "consular",
    alternates: ["ren-at-post", "family-spa"],
  },
];

export type OfwResult = {
  primary: Route;
  alternates: Route[];
  matrixRow: string;
};

/**
 * The location field is free text. The tool substitutes a placeholder when the
 * user skips it, so treat that as "not stated" rather than echoing it back.
 */
function statedPlace(place: string | undefined): string | null {
  const trimmed = place?.trim();
  if (!trimmed || trimmed.toLowerCase() === "abroad") return null;
  return trimmed;
}

/** Returns a copy of the route with the user's stated location written in. */
function withPlace(route: Route, place: string | null): Route {
  if (!place) return route;
  return {
    ...route,
    steps: route.steps.map((step) =>
      step
        .replace("with jurisdiction over where you live", `with jurisdiction over ${place}`)
        .replace("Check that the country you are in is", `Check that the country you are in (${place}) is`)
        .replace(
          "Contact the post first and ask",
          `Contact the Philippine post covering ${place} first and ask`,
        ),
    ),
  };
}

export function findRoute(a: OfwAnswers): OfwResult {
  let row = DECISION_MATRIX[4];

  if (a.reach === "no") {
    row = DECISION_MATRIX[0];
  } else if (a.reach === "hard") {
    row = a.usedWhere === "in-ph" ? DECISION_MATRIX[1] : DECISION_MATRIX[2];
  } else if (a.urgency === "urgent") {
    row = DECISION_MATRIX[3];
  }

  // The document type adjusts the routes we offer. "Have family act instead"
  // is executed through an SPA, so offering it as an alternative to notarizing
  // an SPA is circular — the SPA is the thing that still needs notarizing.
  const isSpa = a.doc === "spa";
  const alternateIds = isSpa
    ? row.alternates.filter((id) => id !== "family-spa")
    : row.alternates;

  const adjustments: string[] = [];
  if (alternateIds.length !== row.alternates.length) {
    adjustments.push(
      "the family-SPA route is not listed as an alternative, because the document you need notarized is itself the SPA",
    );
  }
  if (isSpa && row.primary === "family-spa") {
    adjustments.push(
      "your document is already an SPA, so this route comes down to executing that one SPA by whichever route you can reach — usually consular",
    );
  }

  const place = statedPlace(a.place);

  return {
    primary: withPlace(ROUTES[row.primary], place),
    alternates: alternateIds.map((id) => withPlace(ROUTES[id], place)),
    matrixRow: adjustments.length
      ? `${row.when} — adjusted for your document type: ${adjustments.join("; ")}`
      : row.when,
  };
}
