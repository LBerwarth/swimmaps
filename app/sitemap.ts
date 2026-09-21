import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { getAllPools, getIndex } from "@/lib/pools-server";
import { poolPagePath } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = getIndex().updated;
  const languages = (path: (locale: (typeof LOCALES)[number]) => string) =>
    Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}${path(l)}`]));

  const statics: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: languages((l) => `/${l}`) },
    },
    {
      url: `${SITE_URL}/${locale}/sources`,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: { languages: languages((l) => `/${l}/sources`) },
    },
    {
      url: `${SITE_URL}/${locale}/privacy`,
      changeFrequency: "monthly",
      priority: 0.2,
      alternates: { languages: languages((l) => `/${l}/privacy`) },
    },
  ]);

  // Une entrée par fiche et par langue (~30 000 URL, sous la limite de 50 000).
  const pools: MetadataRoute.Sitemap = getAllPools().flatMap((pool) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${poolPagePath(locale, pool)}`,
      lastModified: updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: languages((l) => poolPagePath(l, pool)) },
    })),
  );

  return [...statics, ...pools];
}
