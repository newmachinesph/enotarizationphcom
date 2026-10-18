import type { MetadataRoute } from "next";
import { asOf, brand } from "@/lib/brand";
import { getAllPages } from "@/lib/content";

/** Static routes that are not MDX content pages. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/learn", priority: 0.8 },
  { path: "/guides", priority: 0.8 },
  { path: "/tools", priority: 0.8 },
  { path: "/tools/can-it-be-e-notarized", priority: 0.9 },
  { path: "/tools/ofw-route-finder", priority: 0.9 },
  { path: "/tools/cost-estimator", priority: 0.9 },
  { path: "/tools/readiness-checklist", priority: 0.8 },
  { path: "/platforms", priority: 0.9 },
  { path: "/tracker", priority: 0.9 },
  { path: "/faq", priority: 0.9 },
  { path: "/resources", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${brand.url}${r.path}`,
    lastModified: asOf.iso,
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));

  const listed = new Set(staticEntries.map((e) => e.url));

  // A page listed above may also exist as MDX (e.g. /resources). One URL, one
  // entry — the explicit priority above wins over the frontmatter default.
  const contentEntries = getAllPages()
    .map((p) => ({
      url: `${brand.url}${p.url}`,
      lastModified: p.frontmatter.lastReviewed ?? asOf.iso,
      changeFrequency: "monthly" as const,
      priority: p.frontmatter.priority === "P0" ? 0.9 : 0.6,
    }))
    .filter((e) => !listed.has(e.url));

  return [...staticEntries, ...contentEntries];
}
