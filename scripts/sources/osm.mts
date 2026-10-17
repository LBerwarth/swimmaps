/**
 * Source OpenStreetMap seule (ODbL), pour les pays sans base nationale
 * ouverte exploitable (Espagne, Italie, Belgique, Pays-Bas).
 */
import type { Pool, PoolEnv } from "../../lib/types";

export interface OsmElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

/** Bassins d'hôtels, campings, résidences : pas ouverts au public. */
const PRIVATE_NAME =
  /hotel|hôtel|camping|resort|apartamento|aparthotel|residen|villa|condominio|b&b|agriturismo|vakantiepark|bungalow/i;

/** Un site est souvent décrit par plusieurs éléments (centre + bassins). */
const SAME_SITE_KM = 0.2;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function envOf(tags: Record<string, string>): PoolEnv | undefined {
  if (tags.indoor === "yes" || tags.covered === "yes" || tags.location === "indoor") return "int";
  if (tags.indoor === "no" || tags.covered === "no" || tags.location === "outdoor") return "ext";
  return undefined;
}

/** Centres et parcs aquatiques d'abord : ils portent le nom du site. */
function rank(tags: Record<string, string>): number {
  return tags.leisure === "sports_centre" || tags.leisure === "water_park" ? 0 : 1;
}

/** Localité la plus proche (nœuds place=*) : addr:city manque une fois sur deux. */
function nearestPlace(places: OsmElement[], lat: number, lon: number): string {
  let best = "";
  let bestKm = 10;
  for (const p of places) {
    if (p.lat === undefined || Math.abs(p.lat - lat) > 0.1) continue;
    // Les quartiers ne nomment la piscine que s'ils sont tout proches.
    const km = haversineKm(lat, lon, p.lat, p.lon!) * (p.tags?.place === "suburb" ? 3 : 1);
    if (km < bestKm) [best, bestKm] = [p.tags!.name, km];
  }
  return best;
}

export function poolsFromOsm(iso: string, elements: OsmElement[], places: OsmElement[]): Pool[] {
  const candidates = elements
    .map((el) => ({ el, c: el.lat !== undefined ? { lat: el.lat, lon: el.lon! } : el.center }))
    .filter(
      (x): x is { el: OsmElement & { tags: Record<string, string> }; c: { lat: number; lon: number } } =>
        !!x.c && !!x.el.tags?.name &&
        !/^(private|no)$/.test(x.el.tags.access ?? "") &&
        !PRIVATE_NAME.test(x.el.tags.name) &&
        // Pays-Bas : écarte les îles des Caraïbes (emprise démesurée).
        x.c.lat > 20,
    )
    .sort((a, b) => rank(a.el.tags) - rank(b.el.tags) || a.el.id - b.el.id);

  const pools: Array<Pool & { envs: Set<PoolEnv> }> = [];
  for (const { el, c } of candidates) {
    const tags = el.tags;
    const env = envOf(tags);
    const len = Number.parseFloat(tags.length ?? "");
    const site = pools.find((p) => haversineKm(p.lat, p.lon, c.lat, c.lon) < SAME_SITE_KM);
    if (site) {
      if (env) site.envs.add(env);
      if (len > 0 && !site.lens!.includes(len)) site.lens!.push(len);
      continue;
    }
    pools.push({
      id: `${iso}${el.type[0].toUpperCase()}${el.id}`,
      name: tags.name,
      city: tags["addr:city"] ?? nearestPlace(places, c.lat, c.lon),
      cp: tags["addr:postcode"] ?? "",
      ...(tags["addr:street"]
        ? { address: [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" ") }
        : {}),
      country: iso,
      lat: Math.round(c.lat * 1e5) / 1e5,
      lon: Math.round(c.lon * 1e5) / 1e5,
      envs: new Set(env ? [env] : []),
      lens: len > 0 ? [len] : [],
      basins: tags.leisure === "water_park" ? ["ludique"] : [],
    });
  }

  const out = pools.map(({ envs, lens, ...p }): Pool => ({
    ...p,
    ...(envs.size === 1 ? { env: [...envs][0] } : envs.size > 1 ? { env: "mix" as const } : {}),
    ...(lens?.length ? { lens: lens.sort((a, b) => b - a) } : {}),
  }));
  console.log(`${iso} (OSM) : ${out.length} piscines sur ${elements.length} éléments`);
  return out;
}
