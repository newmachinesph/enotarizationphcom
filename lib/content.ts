import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * MDX content pipeline.
 *
 * Every narrative page on this site is one .mdx file under content/pages.
 * The folder structure IS the URL structure — content/pages/learn/glossary.mdx
 * becomes /learn/glossary. Nothing else needs editing to publish a page.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "pages");

export type Frontmatter = {
  title: string;
  description: string;
  /** ISO YYYY-MM-DD. Rendered as the "Last reviewed" badge. */
  lastReviewed: string;
  /** Who this page is written for. Used in the header eyebrow. */
  persona: string;
  keywords: string[];
  /** Show the staged-rollout strip at the top of this page. */
  statusBanner: boolean;
  /** Launch priority. P0 pages carry full copy; P1/P2 are outlined. */
  priority: "P0" | "P1" | "P2";
  eyebrow?: string;
  /** Breadcrumb section, excluding Home and this page. */
  section?: { label: string; href: string };
  changelog?: { date: string; note: string }[];
  /** Ordered step names. Presence emits HowTo structured data. */
  howToSteps?: string[];
  /** ISO 8601 duration, e.g. "PT1H". Optional companion to howToSteps. */
  howToTime?: string;
};

export type ContentPage = {
  slug: string[];
  url: string;
  frontmatter: Frontmatter;
  body: string;
};

function walk(dir: string, base: string[] = []): string[][] {
  if (!fs.existsSync(dir)) return [];
  const out: string[][] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...walk(path.join(dir, entry.name), [...base, entry.name]));
    } else if (entry.name.endsWith(".mdx")) {
      out.push([...base, entry.name.replace(/\.mdx$/, "")]);
    }
  }
  return out;
}

export function getAllSlugs(): string[][] {
  return walk(CONTENT_DIR);
}

export function getPage(slug: string[]): ContentPage | null {
  const file = path.join(CONTENT_DIR, ...slug) + ".mdx";
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    url: `/${slug.join("/")}`,
    frontmatter: data as Frontmatter,
    body: content,
  };
}

export function getAllPages(): ContentPage[] {
  return getAllSlugs()
    .map((slug) => getPage(slug))
    .filter((p): p is ContentPage => p !== null);
}

/** Pages under a section, for the /learn and /guides hub listings. */
export function getPagesIn(section: string): ContentPage[] {
  return getAllPages()
    .filter((p) => p.slug[0] === section && p.slug.length > 1)
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}
