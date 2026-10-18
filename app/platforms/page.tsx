import type { Metadata } from "next";
import { Dateline } from "@/components/marks/Dateline";
import { BrassRule, LedgerNumber } from "@/components/marks/Ledger";
import { Callout, Disclaimer } from "@/components/ui/Callout";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { StatusBanner } from "@/components/ui/StatusBanner";
import {
  VerificationChip,
  type VerificationStatus,
} from "@/components/ui/VerificationChip";
import { brand, officialSources } from "@/lib/brand";
import platforms from "@/content/data/platforms.json";

export const metadata: Metadata = {
  title: "Mga e-notary platform, at ano ang alam namin",
  description:
    "Bawat platform na nag-aalok ng e-notarization sa Pilipinas, may verification status kada isa. Hindi ito opisyal na listahan ng Korte Suprema.",
  alternates: { canonical: "/platforms" },
};

export default function PlatformsPage() {
  return (
    <div className="shell py-10 sm:py-14">
      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <Breadcrumbs trail={[{ label: "Platforms", href: "/platforms" }]} />
          <p className="dateline mt-8 text-accent-text">Maintained list</p>
          <h1 className="mt-4 max-w-[18ch]">E-notarization platforms in the Philippines</h1>
          <BrassRule width="w-28" animate={false} className="mt-7" />
          <p className="lede mt-6 max-w-[46rem]">
            Inilalarawan namin, hindi ine-endorso. May verification status ang bawat entry.
            Tatlo ang nabanggit sa balita bilang accredited. Ang iba ay sarili nilang sabi lang,
            at hindi iyon pareho.
          </p>
          <Dateline asOf={platforms.lastChecked} label="Checked" className="mt-6" />
        </header>

        {/* Rail first in the DOM — it inlines above the list below lg. */}
        <aside
          aria-label="Record details"
          className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start"
        >
          <p className="dateline">Listed</p>
          <p className="mt-1.5 font-mono tabular-nums text-ink">
            {platforms.platforms.length} entries
          </p>

          <div aria-hidden className="hair-rule my-5" />

          <LastReviewed date={platforms.lastChecked} />

          <div aria-hidden className="hair-rule my-5" />

          <SourceList
            sources={officialSources}
            className="border-0 bg-transparent p-0 text-left"
          />
        </aside>

        <div className="broadsheet-text space-y-6">
          <Callout tone="info" title="We are not one of these platforms">
            <p>
              {brand.name} is an educational website. We do not notarize documents and we are
              not an accredited provider. This page describes other organisations&apos;
              services so you can choose between them — we take nothing if you pick one.
            </p>
          </Callout>

          <StatusBanner>
            Noong <strong>5 Agosto 2026</strong>, may balitang nagngangalan sa tatlong
            Electronic Notarization Facility provider bilang accredited: Twala, QLegal at
            NotarizeIT. Pero wala pa ring inilathalang listahan ang Korte Suprema na
            matitingnan mo mismo, at wala pa ring public directory ng mga commissioned
            e-notary. Kaya hilingin mo sa provider ang mismong accreditation document bago ka
            magbayad.
          </StatusBanner>

          <Callout tone="neutral" title="How we verify, and our neutrality policy">
            <p>
              Ganito ang pagkakasunod ng ebidensya para sa amin: unang-una ang inilathalang
              listahan ng Korte Suprema, pangalawa ang may petsang balita na nagngangalan sa
              provider, pangatlo ang sarili nilang sabi. Walang listahan ang Korte Suprema
              hanggang ngayon. Kaya ang pinakamalakas na chip sa page na ito ay{" "}
              <em>reported</em>, hindi <em>verified</em> — at sinasabi mismo ng chip iyon.
            </p>
            <p>
              <strong>No paid placement.</strong> We take no commission, referral fee or
              advertising from any provider. Philippine providers are listed alphabetically,
              not by preference; the final row exists only to explain why US platforms are
              absent. Providers have a right of reply — send corrections and we will publish
              them.
            </p>
          </Callout>
        </div>

        {/* The comparison earns the wide column. */}
        <div className="broadsheet-wide">
          <ComparisonTable
            caption="Philippine providers listed alphabetically, followed by a row explaining why US platforms are absent. Status labels describe evidence, not quality."
            columns={[
              { key: "name", label: "Platform" },
              { key: "who", label: "Who it's for" },
              { key: "modes", label: "Modes" },
              { key: "pricing", label: "Pricing" },
              { key: "status", label: "Verification status" },
            ]}
            rows={platforms.platforms.map((p) => ({
              id: p.slug,
              name: (
                <>
                  <span className="block">{p.name}</span>
                  {p.site !== "—" && (
                    <span className="text-fine font-normal text-muted">{p.site}</span>
                  )}
                </>
              ),
              who: p.who,
              modes: p.modes,
              pricing: p.pricing,
              status: <VerificationChip status={p.verification as VerificationStatus} />,
            }))}
          />
        </div>

        <div className="broadsheet-text">
          <section aria-labelledby="notes-on-each">
            <div className="mb-2 flex items-baseline gap-3">
              <LedgerNumber value={1} />
              <h2 id="notes-on-each" className="text-[1.75rem] sm:text-[2rem]">
                Notes on each
              </h2>
            </div>
            <p className="mb-6 text-muted">The context the table cannot hold.</p>

            {/* Ruled ledger rows: the name hangs, the note reads. */}
            <dl className="border-t border-line-strong">
              {platforms.platforms.map((p) => (
                <div key={p.slug} className="border-b border-line py-5">
                  <dt className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-display text-[1.25rem] leading-tight text-ink">
                      {p.name}
                    </span>
                    <VerificationChip status={p.verification as VerificationStatus} />
                  </dt>
                  <dd className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">
                    {p.notes}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="how-to-choose" className="mt-16">
            <div className="mb-2 flex items-baseline gap-3">
              <LedgerNumber value={2} />
              <h2 id="how-to-choose" className="text-[1.75rem] sm:text-[2rem]">
                Five questions to ask any platform
              </h2>
            </div>
            <p className="mb-6 text-muted">Before you upload a document or pay anything.</p>

            <ol className="border-t border-line">
              {platforms.howToChoose.map((q, i) => (
                <li
                  key={q}
                  className="grid grid-cols-[2rem_1fr] gap-x-3 border-b border-line py-4 sm:grid-cols-[2.75rem_1fr] sm:gap-x-6"
                >
                  <LedgerNumber value={i + 1} className="pt-1" />
                  <span className="text-[0.9375rem] leading-relaxed">{q}</span>
                </li>
              ))}
            </ol>
          </section>

          <Callout tone="info" title="For providers" className="mt-12">
            <p>
              Kung may mali o luma sa entry ninyo, mag-email sa hello@enotarizationph.com na
              may ebidensya. Itatama namin at ilalagay ang petsa ng pagbabago. Kung accredited
              na kayo at kaya ninyong ipakita ang dokumento, ipadala ninyo — babaguhin namin
              ang label at isusulat kung kailan.
            </p>
          </Callout>

          {/* The disclaimer closes every page. Non-negotiable. */}
          <div className="mt-12">
            <div aria-hidden className="hair-rule mb-6" />
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
