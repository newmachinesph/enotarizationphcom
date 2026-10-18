import Link from "next/link";
import type { ComponentProps } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Callout, Disclaimer } from "@/components/ui/Callout";
import { QuickAnswer } from "@/components/ui/QuickAnswer";
import { RuleCite, RuleGloss, RuleQuote } from "@/components/ui/RuleCite";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { VerificationChip } from "@/components/ui/VerificationChip";

/**
 * Components available inside any .mdx content file.
 * Editors can use these by name without importing anything.
 *
 * NOTE: only components taking string attributes (or none) belong here.
 * MDX drops JSX *expression* attributes in this pipeline, so a component
 * needing array or object props would silently render empty. Per-page FAQs
 * therefore live in content/data/page-faqs.json and are rendered by the route.
 */
const components = {
  Callout,
  Disclaimer,
  QuickAnswer,
  StatusBanner,
  VerificationChip,
  // Citation components. All take a string `id` from rules-citations.json,
  // which is the only prop shape MDX reliably passes here.
  RuleCite,
  RuleQuote,
  RuleGloss,

  // Internal links go through next/link so navigation stays client-side.
  // In-page anchors (including the heading anchors rehype adds) must stay
  // in-page — sending "#section" to a new tab would be absurd.
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    if (href.startsWith("#")) return <a href={href} {...props} />;
    if (href.startsWith("/")) return <Link href={href} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  },

  // Wide tables scroll inside their own box, never the page body.
  table: (props: ComponentProps<"table">) => (
    <div className="scroll-x">
      <table {...props} />
    </div>
  ),
};

/**
 * The long-form reading container.
 *
 * `.mdx` carries the prose defaults (headings, lists, tables, heading anchors);
 * `.article` sets the copy in Newsreader at the 46rem measure. Both live in
 * globals.css — nothing about the prose is styled here.
 */
export function MdxContent({ source }: { source: string }) {
  return (
    <div className="mdx article">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "append",
                  properties: {
                    className: "heading-anchor",
                    ariaHidden: true,
                    tabIndex: -1,
                  },
                  content: { type: "text", value: "#" },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
