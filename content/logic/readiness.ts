/**
 * DECISION LOGIC — readiness checklist composer.
 * Editors: add or reword items here. Each item has a short line and a
 * "why" line that expands, so the checklist stays scannable.
 */

export type SessionMode = "ien" | "ren";
export type Party = "just-me" | "with-witnesses" | "multiple-signatories";
export type ChecklistDoc = "jurat" | "acknowledgment" | "signature-witnessing" | "unsure";

export type ChecklistAnswers = {
  mode: SessionMode;
  doc: ChecklistDoc;
  party: Party;
};

export type ChecklistItem = {
  id: string;
  line: string;
  why: string;
  /** Marked items are the ones people most often get wrong. */
  critical?: boolean;
};

export function composeChecklist(a: ChecklistAnswers): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const everyone = a.party === "just-me" ? "You" : "Every person joining the session";

  items.push({
    id: "id",
    line: `${everyone} has a valid, unexpired government ID showing both photo and signature`,
    why: "Competent evidence of identity means at least one current government-issued photo-and-signature ID: passport, driver's licence, PhilID, UMID, PRC, postal ID, OFW/OWWA ID, seaman's book, PWD ID or senior citizen ID. Expired IDs are rejected automatically by the platform, not by a person you can reason with.",
    critical: true,
  });

  items.push({
    id: "account",
    line: `${everyone} has their OWN account on the platform`,
    why: "For a remote session the Rules are explicit: each principal, and each witness who appears, uses their own ENF account. Two people signing from one login is the single most common reason a session fails. For an in-person session the platform may still require this — ask when you book.",
    critical: a.party !== "just-me",
  });

  items.push({
    id: "authority",
    line: "If you are signing for someone else or for a company, the document proving you may do so",
    why: "The e-notary must verify a representative's authority before the act, and the platform must accept proof of it. That means the SPA, board resolution or secretary's certificate has to be ready as a file before the session — not promised afterwards. If you are signing only for yourself, skip this one. This one traces to a compliance reference held in this project rather than to a Section we can quote, so treat it as good practice to confirm with your platform.",
    critical: a.party !== "just-me",
  });

  // A jurat and signature witnessing both require signing live in the e-notary's
  // full view, so both fail on a pre-signed document. "unsure" gets the safe answer.
  if (a.doc === "jurat" || a.doc === "signature-witnessing" || a.doc === "unsure") {
    items.push({
      id: "unsigned",
      line: "The document is saved as a PDF and is NOT signed yet",
      why: "Two acts require you to sign live in the e-notary's full view: a jurat (where you also swear the contents are true) and signature witnessing (where you don't swear, but you still sign on camera). A pre-signed document cannot be used for either. If you are unsure which act you need, leaving it unsigned is the safe choice — you can always sign during the session.",
      critical: true,
    });
  } else {
    items.push({
      id: "pdf",
      line: "The document is saved as a PDF (PDF/A if your software offers it)",
      why: "Electronic notarization works on PDF or PDF/A files. For an acknowledgment, an existing electronic signature is fine. A scan of an unsigned paper document counts as an electronic document; a scan of paper already signed in ink is the unsettled case, because the Rules also exclude paper instruments bearing wet signatures — ask the platform before you rely on it.",
    });
  }

  if (a.mode === "ren") {
    items.push(
      {
        id: "device",
        line: "A device with a working camera and microphone",
        why: "Remote sessions are live video. Everyone stays on camera for the whole session — that is what replaces standing in front of the notary's desk.",
      },
      {
        id: "internet",
        line: "Internet fast enough for HD video — at least 2 Mbps per person",
        why: "The Rules require the platform to support 1280×720 video and to tell users that 2 Mbps per person is the minimum — those are exact figures, not rules of thumb. A weak connection is not itself a legal defect, but a session that drops fails the requirement that everyone appear synchronously and stay within camera view, so it has to be restarted or rescheduled.",
        critical: true,
      },
      {
        id: "room",
        line: "A quiet, private room where you can be seen clearly",
        why: "The e-notary has to confirm you are acting voluntarily and that nobody off-camera is pressuring you. A noisy or crowded space makes that impossible.",
      },
      {
        id: "location",
        line: `${everyone} is physically inside the Philippines`,
        why: "The e-notary must always be in the Philippines, and as a general rule so must everyone else. The only exception is a principal physically inside a Philippine embassy, consular office or Honorary Consul's office. Turn any VPN off — using one to fake a location is a punishable act.",
        critical: true,
      },
    );
  } else {
    items.push(
      {
        id: "appear",
        line: "You can travel to the e-notary and appear in person",
        why: "In-person electronic notarization means you physically appear before the Electronic Notary Public. Only the document is electronic.",
      },
      {
        id: "device-ien",
        line: "Know whether to bring your own device",
        why: "Some e-notaries will have everything set up; others expect you to bring a phone or laptop for your own platform account. Ask when you book.",
      },
    );
  }

  if (a.party === "with-witnesses") {
    items.push({
      id: "witnesses",
      line: "Each witness has their own valid ID, and in a remote session their own platform account",
      why: "Witnesses are participants too. They are identity-verified the same way you are. In a remote session the Rules have each witness appear through their own ENF account, so they cannot share yours or your device. In an in-person session witnesses are physically present — ask the platform whether they still need an account of their own.",
      critical: true,
    });
  }

  if (a.party === "multiple-signatories") {
    items.push({
      id: "coordination",
      line: "Every signatory has agreed on the same time slot",
      why: "The session is synchronous. Everyone has to be present at once — a signatory who joins later has not appeared before the e-notary.",
      critical: true,
    });
  }

  items.push(
    {
      id: "payment",
      line: "A digital payment method ready",
      why: "Accredited platforms take digital payments and issue e-receipts. Keep the receipt with your notarized document.",
    },
    {
      id: "recording",
      line: "Decide whether to ask for the session recording",
      why: "Recording is optional and exists for the principal's benefit. If you want a copy, ask before the session starts — not afterwards.",
    },
  );

  return items;
}
