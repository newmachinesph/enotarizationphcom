import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

/**
 * Answer engines are explicitly welcome.
 *
 * This is a civic education site whose whole purpose is that correct
 * information reaches people. If someone asks an assistant "pwede ba akong
 * mag-e-notaryo mula abroad", we would rather the assistant read this page
 * than guess. So every major AI crawler is allowed, by name.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${brand.url}/sitemap.xml`,
    host: brand.url,
  };
}
