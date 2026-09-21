import { getIndex } from "@/lib/pools-server";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

const COUNTRY = { fr: "France", gb: "England", de: "Germany" } as const;

function body(): string {
  const index = getIndex();
  const total = index.countries.reduce((n, c) => n + c.count, 0);
  const countries = index.countries
    .map(
      (c) =>
        `- ${COUNTRY[c.code as keyof typeof COUNTRY] ?? c.code.toUpperCase()}: ${c.count.toLocaleString("en-GB")} pools — [${SITE_URL}/data/piscines-${c.code}.json](${SITE_URL}/data/piscines-${c.code}.json)`,
    )
    .join("\n");

  return [
    "# Swimspot",
    "",
    `> ${total.toLocaleString("en-GB")} public swimming pools in France, England and Germany, from open data: location, pool types and lengths, opening hours and prices where known. Independent, non-official site; the operator's website linked on each page is authoritative.`,
    "",
    `Data as of ${index.updated.slice(0, 10)}. Interface in French, English and German; every page exists under /fr, /en and /de.`,
    "",
    "## Finding pools",
    "",
    `- [Around a location](${SITE_URL}/fr): pick an address or use geolocation, choose a radius (1–50 km), filter by indoor/outdoor, 25 m / 50 m pools, and opening (this week, today, now). Shortcuts: \`?open=now\`, \`?type=outdoor\`, \`?length=50\`, \`?fav=1\`, \`?radius=10\`.`,
    `- [Pool pages](${SITE_URL}/fr/piscine/<slug>): one page per pool with weekly hours, pool types, price, address, official website and nearby pools. The slug is \`<name-in-kebab-case>-<id>\`; an id alone also resolves.`,
    "",
    "## Datasets (JSON, one file per country)",
    "",
    `- [Index](${SITE_URL}/data/index.json): countries, counts, bounding boxes, dates.`,
    countries,
    "",
    "Each pool record: `id`, `name`, `city`, `cp` (postcode), `address`, `country` (ISO 3166-1 alpha-2), `lat`, `lon`, `env` (`int` indoor, `ext` outdoor, `mix`), `lens` (pool lengths in metres), `basins` (types), `hours` (OSM `opening_hours` syntax, present for a minority), `hoursFrom` (`web` when read from the official website), `fee`, `charge` (free-text price), `website`, `phone`.",
    "",
    "## About",
    "",
    `- [Agent skill](${SITE_URL}/agent-skill.md): how to answer questions with these data and their limits.`,
    `- [Sources](${SITE_URL}/en/sources): Data ES + OpenStreetMap (France), Active Places (England), Bäderleben (Germany), official websites; licences.`,
    `- [Privacy](${SITE_URL}/en/privacy): no cookies, aggregated analytics only.`,
    "",
  ].join("\n");
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
