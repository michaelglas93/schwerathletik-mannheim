import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/content";

const BASE = "https://schwerathletik-mannheim.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/verein`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/team`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/trainingsstaette`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/mitglied-werden`, changeFrequency: "yearly", priority: 0.9 },
    { url: `${BASE}/news`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kontakt`, changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...posts.map((post) => ({
      url: `${BASE}/news/${post.slug}`,
      lastModified: post.showDate ? post.date : `${post.year}-12-31`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
