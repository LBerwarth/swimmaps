import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Bing crawlt nach IndexNow die Fiches im Dauerlauf (Vercel-CPU-Kontingent)
      { userAgent: "bingbot", allow: "/", disallow: ["/api/"], crawlDelay: 10 },
      // Crawl d'entraînement et outil SEO : 95 % des requêtes, aucun visiteur en retour.
      { userAgent: ["ClaudeBot", "AhrefsBot"], disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
