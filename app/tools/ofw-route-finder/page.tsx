import type { Metadata } from "next";
import { OfwRouteFinder } from "@/components/tools/OfwRouteFinder";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Nasa abroad ka? Hanapin ang ruta mo",
  description:
    "Limang tanong kung nasa ibang bansa ka — consular, apostille, REN sa loob ng post, o SPA sa pamilya. Hindi ka pwedeng mag-e-notaryo mula sa bahay mo.",
  alternates: { canonical: "/tools/ofw-route-finder" },
};

export default function Page() {
  return (
    <ToolPageLayout
      title="OFW route finder"
      crumb="OFW route finder"
      slug="/tools/ofw-route-finder"
      intro={
        <p className="lede">
          Five questions, then the route that actually works for your situation — with
          steps, costs, timelines and the scam warning relevant to that route.
        </p>
      }
      notice={
        <Callout tone="warning" title="Before you start" className="mb-8">
          <p>
            You cannot e-notarize from your home abroad. The Rules require everyone in a remote
            session to be physically in the Philippines, except a principal who is physically
            inside a Philippine embassy, consular office or Honorary Consul&apos;s office. This
            tool works within that reality.
          </p>
        </Callout>
      }
    >
      <OfwRouteFinder />
    </ToolPageLayout>
  );
}
