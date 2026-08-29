import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Das Redaktions-Backend gehört nicht in den Index.
      disallow: ["/studio", "/studio/"],
    },
    sitemap: "https://schwerathletik-mannheim.de/sitemap.xml",
  };
}
