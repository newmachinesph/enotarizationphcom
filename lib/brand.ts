/**
 * Brand + site constants.
 *
 * Change the brand name / domain in ONE place: here. Everything else
 * (metadata, OG images, JSON-LD, footer, header) reads from this file.
 */

export const brand = {
  name: "eNotarization PH",
  legalName: "eNotarization PH Civic Education Project",
  tagline: "Ang gabay mo sa e-notaryo.",
  /**
   * The line that rides behind the brand name in the root title, the home
   * title and the OG card. Taglish, like the rest of the voice — the field
   * name is historical, the string is not English.
   */
  taglineEn: "E-notaryo sa Pilipinas, paano at magkano",
  description:
    "Ano ang pwede at hindi pwede sa e-notaryo sa Pilipinas — may petsa at may source ang bawat sagot. Hindi kami notaryo, hindi law firm.",
  url: "https://enotarizationph.com",
  locale: "en_PH",
  contactEmail: "hello@enotarizationph.com",
} as const;

/**
 * The single "as of" date the whole site reports.
 * Update this whenever the rollout status is re-verified; the status banner,
 * every page footer and the tracker all read from it.
 */
export const asOf = {
  iso: "2026-08-07",
  label: "7 August 2026",
} as const;

/**
 * Google Analytics measurement ID.
 * Override per environment with NEXT_PUBLIC_GA_ID; a measurement ID is not a
 * secret, so the production value is checked in as the fallback.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-DLM0MFC20R";

/** Shown on every page. This site is easily mistaken for a notarization service. */
export const NOT_A_PROVIDER =
  "This is an independent educational website. We do not notarize documents, we are not an accredited Electronic Notarization Facility, and we are not affiliated with the Supreme Court or with any platform listed here. We cannot notarize, process or verify anything for you.";

export const DISCLAIMER =
  "General legal information only — not legal advice. For your specific case, consult a Philippine lawyer or notary public.";

export const ROLLOUT_STATUS =
  "Epektibo na ang Rules mula 24 Marso 2025, pero wala ka pang mababook na e-notaryo ngayon. Sa 10 Agosto 2026 pa bubuksan ang aplikasyon ng mga abogado para sa Electronic Notary Public commission, kasabay ng pagbukas ng eNotarization Portal — kaya sa tingin namin ay wala pa ring commissioned na e-notaryo, kahit hindi ito diretsong sinabi ng Korte Suprema. “AVAILABLE SOON” pa rin ang directory nila.";

/** Official sources we cite. Never link a provider here. */
export const officialSources = [
  {
    label: "Rules on Electronic Notarization (A.M. No. 24-10-14-SC) — full text PDF",
    href: "https://sc.judiciary.gov.ph/wp-content/uploads/2025/03/A.M.-No.-24-10-14-SC-Feb.-4-2025-published-3.9.25.pdf",
  },
  {
    label: "Supreme Court eNotary Services portal + FAQs",
    href: "https://sc.judiciary.gov.ph/enotary-services/",
  },
  {
    label: "Supreme Court e-Notarization information page",
    href: "https://sc.judiciary.gov.ph/enotarization/",
  },
] as const;

export const helpdesk = {
  office: "Office of the Bar Confidant — Electronic Notary Services (OBC-ENS)",
  phone: "(02) 8526-8119",
  email: "enotarizationconcerns@judiciary.gov.ph",
} as const;

/** Header nav — hard cap of 6 items. Labels name their contents, not umbrellas. */
export const primaryNav = [
  { label: "Learn", href: "/learn" },
  { label: "Guides", href: "/guides" },
  { label: "Tools", href: "/tools" },
  { label: "Platforms", href: "/platforms" },
  { label: "Tracker", href: "/tracker" },
  { label: "FAQ", href: "/faq" },
] as const;

export const footerNav = [
  {
    heading: "Learn the basics",
    links: [
      { label: "What is e-notarization?", href: "/learn/what-is-e-notarization" },
      { label: "IEN vs REN", href: "/learn/ien-vs-ren" },
      { label: "The Rules, explained", href: "/learn/the-rules-explained" },
      { label: "History and timeline", href: "/learn/history-and-timeline" },
      { label: "Glossary", href: "/learn/glossary" },
    ],
  },
  {
    heading: "Get it done",
    links: [
      { label: "Your first e-notarization", href: "/guides/first-e-notarization" },
      { label: "OFW guide", href: "/guides/ofw" },
      { label: "IDs and requirements", href: "/guides/ids-and-requirements" },
      { label: "Verify a document", href: "/guides/verify-a-document" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Can it be e-notarized?", href: "/tools/can-it-be-e-notarized" },
      { label: "OFW route finder", href: "/tools/ofw-route-finder" },
      { label: "Cost estimator", href: "/tools/cost-estimator" },
      { label: "Readiness checklist", href: "/tools/readiness-checklist" },
    ],
  },
  {
    heading: "About this site",
    links: [
      { label: "Platforms list", href: "/platforms" },
      { label: "Rollout tracker", href: "/tracker" },
      { label: "For lawyers", href: "/for-lawyers" },
      { label: "Safety and scams", href: "/safety" },
      { label: "Resources", href: "/resources" },
      { label: "Mission and editorial policy", href: "/about" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
] as const;
