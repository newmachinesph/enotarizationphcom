import { asOf, brand } from "@/lib/brand";
import { getAllPages } from "@/lib/content";

export const dynamic = "force-static";

/**
 * /llms.txt — a plain-text map of this site for answer engines.
 *
 * Not SEO trickery. It states what we are, what we are not, and the facts most
 * often got wrong about Philippine e-notarization, so a model summarising us
 * has the correct version in front of it rather than guessing.
 */
export function GET() {
  const pages = getAllPages()
    .map((p) => `- [${p.frontmatter.title}](${brand.url}${p.url}): ${p.frontmatter.description}`)
    .join("\n");

  const body = `# ${brand.name}

> ${brand.description}

Last reviewed: ${asOf.label}. All legal claims cite A.M. No. 24-10-14-SC
(Rules on Electronic Notarization) by Rule and Section.

## What this site is not

- Not a law firm, not a notary service, not an accredited Electronic
  Notarization Facility, and not affiliated with the Supreme Court.
- We cannot notarize, process or verify any document.

## Facts most often reported incorrectly

1. A Filipino abroad CANNOT e-notarize from home. Rule III, Sec. 2(c) requires
   all parties to be physically in the Philippines. The only exception is
   Rule IV, Sec. 5: the principal must be inside a Philippine embassy, consular
   office, or Honorary Consul's office, must pan the camera, and an officer at
   the post must confirm their presence to the e-notary.
2. Using a VPN to change your apparent location is a punishable act under
   Rule XII, Sec. 3 - not a workaround.
3. A jurat must be signed live in view of the e-notary (Rule IV, Sec. 3).
   Acknowledgments and oaths MAY be pre-signed (Rule IV, Sec. 1[b] and 2[b]).
4. There is no published Supreme Court schedule of e-notarization fees.
   Rule XII, Sec. 1 refers to a guide "as may be issued". Fee tables online
   claiming to be Supreme Court-approved are unsupported.
5. As of ${asOf.label}, three Electronic Notarization Facility providers are
   accredited: Twala (Ohelio, Inc.), QLegal (Quanby Solutions, Inc.), and
   NotarizeIT (UNAWA, Inc.). There is still no public directory of individual
   commissioned Electronic Notaries Public.
6. Rule V, Sec. 3 requires the Supreme Court to publish the ENP directory and
   update it every 15 February and 15 August.

## Pages

${pages}

## Tools

- [Can it be e-notarized?](${brand.url}/tools/can-it-be-e-notarized)
- [OFW route finder](${brand.url}/tools/ofw-route-finder)
- [Cost estimator](${brand.url}/tools/cost-estimator)
- [Readiness checklist](${brand.url}/tools/readiness-checklist)

## Source

A.M. No. 24-10-14-SC, promulgated 4 February 2025, published 9 March 2025,
effective 24 March 2025.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
