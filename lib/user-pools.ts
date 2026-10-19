import "server-only";
import { unstable_cache } from "next/cache";
import { getPoolBySlug } from "./pools-server";
import type { ContribMap } from "./contrib";
import { CONTRIB_KEY, redis } from "./redis";
import { poolSlug } from "./slug";
import type { Pool } from "./types";

export const APPROVED_KEY = "newpool";
export const PENDING_KEY = "newpool:pending";
/** Étiquette du cache des lectures Redis faites au rendu des pages ; invalidée à chaque validation. */
export const USER_POOLS_TAG = "user-pools";

export interface PendingPool {
  pool: Pool;
  token: string;
  note: string | null;
  at: string;
}

/** Piscines proposées par des visiteurs et validées par l'auteure. */
export const getUserPools = unstable_cache(
  async (): Promise<Pool[]> => {
    const db = redis();
    if (!db) return [];
    const all = await db.hgetall<Record<string, Pool>>(APPROVED_KEY).catch(() => null);
    return Object.values(all ?? {});
  },
  ["user-pools"],
  { tags: [USER_POOLS_TAG], revalidate: 86400 },
);

/** Piscines retirées après un signalement validé (fermée, inexistante, non publique). */
const removedIds = unstable_cache(
  async (): Promise<string[]> => {
    const db = redis();
    if (!db) return [];
    const all = await db.hgetall<ContribMap>(CONTRIB_KEY).catch(() => null);
    return Object.entries(all ?? {})
      .filter(([, c]) => c.removed)
      .map(([id]) => id);
  },
  ["removed-ids"],
  { tags: [USER_POOLS_TAG], revalidate: 86400 },
);

export async function getRemovedIds(): Promise<Set<string>> {
  return new Set(await removedIds());
}

/** Fiche par slug ou id : jeux de données d'abord, puis piscines ajoutées. */
export async function findPool(slugOrId: string): Promise<Pool | undefined> {
  const known = getPoolBySlug(slugOrId);
  if (known) return known;
  const key = slugOrId.toLowerCase();
  return (await getUserPools()).find((p) => poolSlug(p) === key || p.id.toLowerCase() === key);
}
