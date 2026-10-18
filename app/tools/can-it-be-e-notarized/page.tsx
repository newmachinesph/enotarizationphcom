import type { Metadata } from "next";
import { EligibilityChecker } from "@/components/tools/EligibilityChecker";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { StatusBanner } from "@/components/ui/StatusBanner";

export const metadata: Metadata = {
  title: "Pwede bang i-notaryo online ito?",
  description:
    "Apat na tanong tungkol sa dokumento mo, nasaan ang mga pipirma, at anong akto ang kailangan — tapos malinaw na sagot at ang Section na basehan nito.",
  alternates: { canonical: "/tools/can-it-be-e-notarized" },
};

export default function Page() {
  return (
    <ToolPageLayout
      title="Can it be e-notarized?"
      crumb="Can it be e-notarized?"
      slug="/tools/can-it-be-e-notarized"
      intro={
        <p className="lede">
          Four questions. Nothing you enter leaves your browser. Whatever the answer, you will
          finish with a route — there is no dead end here.
        </p>
      }
      notice={<StatusBanner className="mb-8" compact />}
    >
      <EligibilityChecker />
    </ToolPageLayout>
  );
}
