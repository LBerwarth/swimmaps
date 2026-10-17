import { getIndex } from "@/lib/pools-server";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

function body(): string {
  const index = getIndex();
  const total = index.countries.reduce((n, c) => n + c.count, 0);
  return `# Swimmaps — finding a public swimming pool in France, England or Germany

Swimmaps lists ${total.toLocaleString("en-GB")} public swimming pools from open
data (Data ES and OpenStreetMap for France, Active Places for England,
Bäderleben for Germany). It is independent and non-official: it represents
neither the pool operators nor any public authority.

## Resources

- **${SITE_URL}/llms.txt** — overview and links to the datasets.
- **${SITE_URL}/data/index.json** — countries covered, counts, bounding boxes.
- **${SITE_URL}/data/piscines-<cc>.json** — every pool of a country (\`fr\`,
  \`gb\`, \`de\`), with coordinates. To answer "near X", geocode X yourself and
  filter by haversine distance; the app does exactly that in the browser.
- **${SITE_URL}/<lang>/piscine/<slug>** — the page of one pool (\`<lang>\` =
  fr, en or de; \`<slug>\` = kebab-case name + \`-\` + lower-case id, e.g.
  \`piscine-leo-lagrange-i315550227\`). It carries schema.org JSON-LD
  (PublicSwimmingPool with address, geo, telephone, priceRange and
  openingHoursSpecification when the weekly hours are unambiguous).

## Reading a record

| field | meaning |
| --- | --- |
| \`env\` | \`int\` indoor, \`ext\` outdoor, \`mix\` both |
| \`lens\` | distinct pool lengths in metres, descending (25 or 50 = standard lanes) |
| \`basins\` | pool types: sportif, ludique, mixte, toboggan, plongeon, plongée, principal, apprentissage, lido, pataugeoire, vagues, spa, kneipp, naturel |
| \`hours\` | OpenStreetMap \`opening_hours\` string; \`SH\` rules = school holidays; \`Jun-Aug off\` = seasonal closure |
| \`hoursFrom\` | \`web\` when hours were read from the official website (centre hours, pool sessions may differ) |
| \`fee\` / \`charge\` | paid entry (boolean) / free-text price such as \`4,80 €\` |

Hours are given in the pool's local time.

## Limits to respect

- Hours are known for a minority of pools (about 10 % in France, fewer in
  Germany) and prices for very few outside Germany. A missing field means
  unknown, never "closed" or "free".
- Data are rebuilt periodically from open sources (date in
  \`index.json\`), not live — except the Toulouse pools, whose daily status
  comes from ${"https://piscines-toulouse.fr"}.
- For any decision that matters, the operator's website (field \`website\`,
  linked on each page) is authoritative. Do not present these data as coming
  from the operators or from a public authority.
`;
}

export function GET() {
  return new Response(body(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
