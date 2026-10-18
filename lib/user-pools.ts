import "server-only";
import { getPoolBySlug } from "./pools-server";
import { redis } from "./redis";
import { poolSlug } from "./slug";
import type { Pool } from "./types";

export const APPROVED_KEY = "newpool";
export const PENDING_KEY = "newpool:pending";

export interface PendingPool {
  pool: Pool;
  token: string;
  note: string | null;
  at: string;
}

/** Piscines proposées par des visiteurs et validées par l'auteure. */
export async function getUserPools(): Promise<Pool[]> {
  const db = redis();
  if (!db) return [];
  const all = await db.hgetall<Record<string, Pool>>(APPROVED_KEY).catch(() => null);
  return Object.values(all ?? {});
}

/** Fiche par slug ou id : jeux de données d'abord, puis piscines ajoutées. */
export async function findPool(slugOrId: string): Promise<Pool | undefined> {
  const known = getPoolBySlug(slugOrId);
  if (known) return known;
  const key = slugOrId.toLowerCase();
  return (await getUserPools()).find((p) => poolSlug(p) === key || p.id.toLowerCase() === key);
}
