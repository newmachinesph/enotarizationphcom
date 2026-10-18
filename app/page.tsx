import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { PersonaGrid } from "@/components/home/PersonaGrid";
import { TopQuestions } from "@/components/home/TopQuestions";
import { TrackerPreview } from "@/components/home/TrackerPreview";
import { TrustBand } from "@/components/home/TrustBand";
import { WhatChanged } from "@/components/home/WhatChanged";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.taglineEn}`,
  description: brand.description,
  alternates: { canonical: "/" },
};

/** The homepage is a running order, nothing more. Each section owns its copy. */
export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: brand.url,
    description: brand.description,
    inLanguage: "en-PH",
    publisher: {
      "@type": "Organization",
      name: brand.legalName,
      url: brand.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <WhatChanged />
      <PersonaGrid />
      <TrustBand />
      <TopQuestions />
      <TrackerPreview />
    </>
  );
}
