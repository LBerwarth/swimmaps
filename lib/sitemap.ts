import "server-only";
import { LOCALES, type Locale } from "./i18n";
import { getAllPools, getIndex } from "./pools-server";
import { poolPagePath } from "./slug";
import { SITE_URL } from "./site";
import { getUserPools } from "./user-pools";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function entry(path: (l: Locale) => string, locale: Locale, priority: number, lastmod?: string): string {
  const alternates = LOCALES.map(
    (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(SITE_URL + path(l))}"/>`,
  ).join("");
  return `<url><loc>${esc(SITE_URL + path(locale))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<priority>${priority}</priority>${alternates}</url>`;
}

/** Une sitemap par langue : 6 langues × ~14 000 fiches dépassent les 50 000 URL d'un fichier. */
export async function localeSitemap(locale: Locale): Promise<string> {
  const updated = getIndex().updated;
  const urls = [
    entry((l) => `/${l}`, locale, 1, updated),
    entry((l) => `/${l}/sources`, locale, 0.3),
    entry((l) => `/${l}/privacy`, locale, 0.2),
    ...[...getAllPools(), ...(await getUserPools())].map((pool) => entry((l) => poolPagePath(l, pool), locale, 0.6, updated)),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export function sitemapIndex(): string {
  const updated = getIndex().updated;
  const items = LOCALES.map(
    (l) => `<sitemap><loc>${SITE_URL}/sitemaps/${l}.xml</loc><lastmod>${updated}</lastmod></sitemap>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join("\n")}\n</sitemapindex>\n`;
}
