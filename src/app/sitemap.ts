import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const caseStudies = projects
    .filter((p) => p.caseStudy)
    .map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...caseStudies,
    {
      url: `${siteUrl}/work/football-analysis/demo`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
