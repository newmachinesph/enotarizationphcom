/**
 * DECISION LOGIC — cost estimator.
 *
 * HARD RULE: output ranges, never exact figures. There is no official
 * Supreme Court fee schedule for e-notarization services yet, IBP schedules
 * are advisory only, and deeds are commonly priced as a percentage of
 * property value rather than a flat fee.
 */

export type Mode = "walk-in" | "e-notarization" | "consular";
export type CityTier = "metro-manila" | "other-city" | "province";
export type CostDocKind = "affidavit" | "spa" | "deed" | "business";

export type CostAnswers = {
  doc: CostDocKind;
  count: number;
  signatories: number;
  mode: Mode;
  tier: CityTier;
};

type Band = { low: number; high: number };

/** Per-document bands in PHP, before tier and signatory adjustments. */
const BASE: Record<CostDocKind, Record<Mode, Band | null>> = {
  affidavit: {
    "walk-in": { low: 100, high: 500 },
    "e-notarization": { low: 300, high: 700 },
    consular: { low: 1400, high: 1600 },
  },
  spa: {
    "walk-in": { low: 200, high: 800 },
    "e-notarization": { low: 400, high: 900 },
    consular: { low: 1400, high: 1600 },
  },
  business: {
    "walk-in": { low: 300, high: 1500 },
    "e-notarization": { low: 500, high: 1500 },
    consular: { low: 1400, high: 1600 },
  },
  // Deeds are the honest exception — percentage pricing, so no band.
  deed: { "walk-in": null, "e-notarization": null, consular: null },
};

/**
 * Multipliers by city tier. These apply to walk-in notarization only, where
 * the notary's territorial limits make price a local fact. They are
 * deliberately NOT applied to e-notarization or consular fees.
 */
const TIER: Record<CityTier, number> = {
  "metro-manila": 1.15,
  "other-city": 1,
  province: 0.85,
};

/** Hidden costs the sticker price hides, in PHP. */
const HIDDEN: Record<Mode, { travel: Band; timeOffWork: Band; label: string }> = {
  "walk-in": {
    travel: { low: 60, high: 500 },
    timeOffWork: { low: 0, high: 1200 },
    label: "Travel to the notary, queuing, and often a repeat visit if something is wrong.",
  },
  "e-notarization": {
    travel: { low: 0, high: 0 },
    timeOffWork: { low: 0, high: 300 },
    label: "No travel. Data and a quiet hour are the real costs.",
  },
  consular: {
    travel: { low: 500, high: 6000 },
    timeOffWork: { low: 0, high: 4000 },
    label: "Travel to the post and usually a day of leave. This is where the real cost sits.",
  },
};

export type CostResult = {
  percentagePriced: boolean;
  headline: string;
  direct: Band | null;
  effective: Band | null;
  hiddenLabel: string;
  caveats: string[];
};

export function estimate(a: CostAnswers): CostResult {
  const caveats = [
    "These are ranges from observed market prices, not an official schedule. Confirm the exact fee before booking.",
    "No official Supreme Court fee schedule for e-notarization services has been published yet. E-notaries may also waive fees, and may pass on reasonable telecommunication or incidental costs.",
    "IBP fee schedules are advisory only. Individual notaries set their own prices.",
    ...(a.mode === "e-notarization"
      ? [
          "Your city does not change this estimate. An Electronic Notary Public may serve a principal anywhere in the Philippines, so there is no province-versus-Metro-Manila premium to apply — unlike walk-in notarization, where the notary's territorial limits make price a local fact.",
        ]
      : []),
  ];

  if (a.doc === "deed") {
    return {
      percentagePriced: true,
      headline: "Deeds of sale are usually priced as a percentage, not a flat fee",
      direct: null,
      effective: null,
      hiddenLabel: HIDDEN[a.mode].label,
      caveats: [
        "Notarial fees for a deed of sale are commonly quoted as a percentage of the property value, so a flat estimate would mislead you.",
        "Ask for the percentage and the value it will be applied to, in writing, before you commit.",
        "Notarial fees are only part of the cost of a property transfer. Transfer taxes, registration fees and documentary stamp tax are separate and usually much larger.",
        ...caveats.slice(1),
      ],
    };
  }

  const band = BASE[a.doc][a.mode];
  if (!band) {
    return {
      percentagePriced: true,
      headline: "We can't put a reliable range on this combination",
      direct: null,
      effective: null,
      hiddenLabel: HIDDEN[a.mode].label,
      caveats,
    };
  }

  // Walk-in prices track local geography. E-notarization does not: an ENP may
  // serve a principal anywhere in the Philippines, so the client's city should
  // not move the price. Consular fees are set centrally in US dollars.
  const tier = a.mode === "walk-in" ? TIER[a.tier] : 1;
  const perExtraSignatory =
    a.mode === "consular" ? 1 : 1 + 0.1 * Math.max(0, a.signatories - 1);
  const qty = Math.max(1, a.count);

  const direct: Band = {
    low: Math.round((band.low * tier * perExtraSignatory * qty) / 10) * 10,
    high: Math.round((band.high * tier * perExtraSignatory * qty) / 10) * 10,
  };

  const hidden = HIDDEN[a.mode];
  const effective: Band = {
    low: direct.low + hidden.travel.low + hidden.timeOffWork.low,
    high: direct.high + hidden.travel.high + hidden.timeOffWork.high,
  };

  return {
    percentagePriced: false,
    headline:
      a.mode === "consular"
        ? "Consular notarization is priced in US dollars — roughly US$25 per document"
        : "Here's the range to expect",
    direct,
    effective,
    hiddenLabel: hidden.label,
    caveats,
  };
}
