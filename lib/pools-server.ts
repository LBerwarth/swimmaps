import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { haversineKm } from "./geo";
import { poolSlug } from "./slug";
import type { CountryIndex, Pool, PoolDataset } from "./types";

/**
 * Jeu de données complet côté serveur (fiches, sitemap, llms.txt) : lu une fois
 * par instance depuis public/data. Le navigateur, lui, ne charge que les pays
 * couvrant la position choisie.
 */
const DATA_DIR = path.join(process.cwd(), "public", "data");

interface Loaded {
  pools: Pool[];
  bySlug: Map<string, Pool>;
  byId: Map<string, Pool>;
}

let index: CountryIndex | null = null;
let loaded: Loaded | null = null;

export function getIndex(): CountryIndex {
  index ??= JSON.parse(readFileSync(path.join(DATA_DIR, "index.json"), "utf8")) as CountryIndex;
  return index;
}

function load(): Loaded {
  if (loaded) return loaded;
  const pools: Pool[] = [];
  for (const { code } of getIndex().countries) {
    const data = JSON.parse(
      readFileSync(path.join(DATA_DIR, `piscines-${code}.json`), "utf8"),
    ) as PoolDataset;
    pools.push(...data.pools);
  }
  loaded = {
    pools,
    bySlug: new Map(pools.map((p) => [poolSlug(p), p])),
    byId: new Map(pools.map((p) => [p.id.toLowerCase(), p])),
  };
  return loaded;
}

export function getAllPools(): Pool[] {
  return load().pools;
}

/** Fiche par slug d'URL ; un id seul (ancien lien) est aussi accepté. */
export function getPoolBySlug(slug: string): Pool | undefined {
  const { bySlug, byId } = load();
  return bySlug.get(slug) ?? byId.get(slug.toLowerCase());
}

/** Les `limit` piscines les plus proches (hors elle-même), avec leur distance. */
export function nearestPools(pool: Pool, limit: number): Array<Pool & { distanceKm: number }> {
  return load()
    .pools.filter((p) => p.id !== pool.id)
    .map((p) => ({ ...p, distanceKm: haversineKm(pool.lat, pool.lon, p.lat, p.lon) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
