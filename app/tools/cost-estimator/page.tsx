import type { Metadata } from "next";
import { CostEstimator } from "@/components/tools/CostEstimator";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { StatusBanner } from "@/components/ui/StatusBanner";

export const metadata: Metadata = {
  title: "Magkano ba talaga ang notaryo?",
  description:
    "Ihambing ang walk-in, e-notaryo at consular sa presyo — ranges lang, kasama ang pamasahe at leave. Walang opisyal na fee schedule ang Korte Suprema.",
  alternates: { canonical: "/tools/cost-estimator" },
};

export default function Page() {
  return (
    <ToolPageLayout
      wide
      title="What will it actually cost?"
      crumb="Cost estimator"
      slug="/tools/cost-estimator"
      intro={
        <p className="lede">
          Ranges, not fake precision. Fees are market-driven, IBP schedules are advisory, and
          no official Supreme Court fee schedule for e-notarization has been published yet.
        </p>
      }
      notice={
        <StatusBanner className="mb-8 max-w-[42rem]" compact>
          No official fee schedule for e-notarization services has been published. The figures
          below are observed market reference points, not authority.
        </StatusBanner>
      }
    >
      <CostEstimator />
    </ToolPageLayout>
  );
}
