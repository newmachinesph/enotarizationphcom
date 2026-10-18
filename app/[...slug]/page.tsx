import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Dateline } from "@/components/marks/Dateline";
import { BrassRule } from "@/components/marks/Ledger";
import { Seal } from "@/components/marks/Seal";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Disclaimer } from "@/components/ui/Callout";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Breadcrumbs, SectionHeading } from "@/components/ui/PageHeader";
import { SourceList } from "@/components/ui/SourceList";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { brand, officialSources } from "@/lib/brand";
import { getAllSlugs, getPage } from "@/lib/content";
import pageFaqs from "@/content/data/page-faqs.json";

type PageFaq = { q: string; a: string; lang: string };
const FAQS = pageFaqs as unknown as Record<string, PageFaq[]>;

/** Fully static: every content page is generated at build time. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};

  const { title, description, keywords } = page.frontmatter;
  const url = `/${slug.join("/")}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        `/og?title=${encodeURIComponent(title)}&section=${encodeURIComponent(
          page.frontmatter.section?.label ?? page.frontmatter.eyebrow ?? "",
        )}`,
      ],
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const fm = page.frontmatter;
  const trail = fm.section
    ? [fm.section, { label: fm.title, href: page.url }]
    : [{ label: fm.title, href: page.url }];

  const faqs = FAQS[page.url] ?? [];

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: fm.title,
      description: fm.description,
      dateModified: fm.lastReviewed,
      inLanguage: "en-PH",
      isAccessibleForFree: true,
      publisher: { "@type": "Organization", name: brand.name, url: brand.url },
      mainEntityOfPage: `${brand.url}${page.url}`,
    },
  ];

  // BreadcrumbList — helps search engines render the trail, and gives answer
  // engines the page's place in the hierarchy.
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brand.url },
      ...trail.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        item: `${brand.url}${c.href}`,
      })),
    ],
  });

  // The Quick Answer is the passage we want read aloud and quoted.
  jsonLd.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fm.title,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".mdx h2", "[data-quick-answer]"],
    },
  });

  // Step-by-step guides are HowTo documents.
  if (fm.howToSteps && fm.howToSteps.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: fm.title,
      description: fm.description,
      totalTime: fm.howToTime ?? undefined,
      step: fm.howToSteps.map((st, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: st,
      })),
    });
  }

  // Pages that carry questions also emit FAQPage structured data.
  if (faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <article className="shell py-10 sm:py-14">
      {jsonLd.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      {/*
        The broadsheet grid runs the whole page: a full-width masthead, then a
        marginalia rail beside a 46rem reading column. Below lg the grid folds
        to one column and the rail inlines ABOVE the text — which is why the
        rail is written first in the DOM.
      */}
      <div className="broadsheet gap-y-12">
        <header className="broadsheet-full">
          <Breadcrumbs trail={trail} />

          <div className="mt-8 flex items-start gap-6 sm:gap-10">
            <div className="min-w-0 flex-1">
              <p className="dateline text-accent-text">
                {fm.eyebrow ?? `For ${fm.persona}`}
              </p>
              <h1 className="mt-4 max-w-[20ch]">{fm.title}</h1>
            </div>

            {/* The seal marks the record. Decorative — the headline carries it. */}
            <Seal size={76} className="mt-2 hidden shrink-0 sm:block" />
          </div>

          <BrassRule width="w-28" animate={false} className="mt-7" />

          <p className="lede mt-6 max-w-[46rem]">{fm.description}</p>

          <Dateline asOf={fm.lastReviewed} label="Reviewed" className="mt-6" />
        </header>

        {/* --- Marginalia: who this is for, when it was checked, what it cites. */}
        <aside
          aria-label="Record details"
          className="broadsheet-rail text-fine lg:sticky lg:top-28 lg:self-start"
        >
          {fm.section && (
            <>
              <p className="dateline">Filed under</p>
              <p className="mt-1.5">
                <Link href={fm.section.href} className="no-underline hover:underline">
                  {fm.section.label}
                </Link>
              </p>
              <div aria-hidden className="hair-rule my-5" />
            </>
          )}

          <p className="dateline">Written for</p>
          <p className="mt-1.5 text-ink">{fm.persona}</p>

          <div aria-hidden className="hair-rule my-5" />

          <LastReviewed date={fm.lastReviewed} changelog={fm.changelog} />

          <div aria-hidden className="hair-rule my-5" />

          {/* Un-boxed in the rail: on a page this ruled, another border is noise. */}
          <SourceList
            sources={officialSources}
            className="border-0 bg-transparent p-0 text-left"
          />
        </aside>

        <div className="broadsheet-text">
          {fm.statusBanner && <StatusBanner className="mb-8" />}

          {fm.priority !== "P0" && (
            <p className="mb-8 border-l-[3px] border-accent bg-sunken px-4 py-3 text-fine text-muted">
              <strong className="font-semibold text-ink">Outline page.</strong> The structure
              and the key facts are here; the full-length copy for this page is still being
              written. Everything stated below is sourced from the Rules.
            </p>
          )}

          <MdxContent source={page.body} />

          {faqs.length > 0 && (
            <section className="mt-14">
              <div aria-hidden className="hair-rule mb-8" />
              <SectionHeading
                title="Common questions"
                id="common-questions"
                sub="Answered in the language they are asked in."
              />
              <FaqAccordion
                items={faqs.map((f) => ({
                  q: f.q,
                  lang: f.lang === "tl" ? ("tl" as const) : ("en" as const),
                  a: <p>{f.a}</p>,
                }))}
              />
            </section>
          )}

          {/* The disclaimer closes every page. Non-negotiable. */}
          <div className="mt-14">
            <div aria-hidden className="hair-rule mb-6" />
            <Disclaimer />
          </div>
        </div>
      </div>
    </article>
  );
}
