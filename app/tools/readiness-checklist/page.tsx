import type { Metadata } from "next";
import { ReadinessChecklist } from "@/components/tools/ReadinessChecklist";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";

export const metadata: Metadata = {
  title: "Handa ka na ba sa session mo?",
  description:
    "Gumawa ng printable checklist para sa session mo — in-person o video, anong notarial act, at sino ang sasama. Bawat isa, sariling ID at account.",
  alternates: { canonical: "/tools/readiness-checklist" },
};

export default function Page() {
  return (
    <ToolPageLayout
      title="Are you ready for the session?"
      crumb="Readiness checklist"
      slug="/tools/readiness-checklist"
      intro={
        <p className="lede">
          Tick your way through. Print it, or send it to everyone else joining — each of
          them needs their own ID and their own account.
        </p>
      }
      disclaimerClassName="no-print mt-8"
    >
      <ReadinessChecklist />
    </ToolPageLayout>
  );
}
