import Image from "next/image";
import { Dateline } from "@/components/marks/Dateline";
import { BrassRule } from "@/components/marks/Ledger";
import { Seal } from "@/components/marks/Seal";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBanner } from "@/components/ui/StatusBanner";

/**
 * The front page.
 *
 * A broadsheet masthead, not a product hero: a dateline strip across the top,
 * the seal hung in the left margin, the headline given the full measure at
 * display size, and the lede, the two routes in and the plate set below it in
 * unequal columns. Nothing is centred and nothing floats.
 */
export function Hero() {
  return (
    <section className="border-b border-line bg-bg">
      <div className="shell">
        {/* The dateline strip — gazette rule across the top of the page. */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3.5">
          <p className="dateline">Civic education · Philippines only</p>
          <Dateline label="" />
        </div>

        {/* Masthead */}
        <div className="grid gap-x-10 pt-10 lg:grid-cols-12 lg:pt-16">
          <div className="hidden lg:col-span-2 lg:flex lg:justify-end lg:pt-3">
            <Seal size={116} animate className="shrink-0" />
          </div>

          <div className="lg:col-span-10 lg:col-start-3">
            <Seal size={72} animate className="mb-7 lg:hidden" />
            <h1 className="max-w-[18ch]">Notarize a PDF, not your whole afternoon.</h1>
            {/* Above the fold — extend it immediately, not on scroll. */}
            <BrassRule width="w-32 sm:w-48" animate={false} className="mt-8" />
          </div>
        </div>

        {/* Lede, routes in, and the plate */}
        <div className="grid gap-x-10 gap-y-12 pt-10 pb-16 lg:grid-cols-12 lg:pt-12 lg:pb-24">
          <div className="lg:col-span-5 lg:col-start-3">
            <p className="lede max-w-[36rem]">
              The Supreme Court&apos;s Rules on Electronic Notarization let a commissioned
              e-notary notarize your document in person or over live video — anywhere in the
              Philippines. Here is what that actually means for you, without the marketing.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/guides/first-e-notarization" size="lg">
                Start here: your first e-notarization
              </ButtonLink>
              <ButtonLink href="/guides/ofw" variant="secondary" size="lg">
                Nasa abroad ka? OFW guide
              </ButtonLink>
            </div>

            <StatusBanner className="mt-10 max-w-[36rem]" compact />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <BrassRule width="w-full" animate={false} />
            <Image
              src="/images/hero-e-notarization.png"
              alt="A Filipina professional at her laptop joining a video call with a lawyer, while her document receives a glowing circular digital notarial seal."
              width={1536}
              height={1024}
              priority
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="aspect-[5/4] w-full border-x border-b border-line bg-sunken object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
