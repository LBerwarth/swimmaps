import "server-only";
import { Redis } from "@upstash/redis";

export const CONTRIB_KEY = "contrib";
export const CORRECTION_KEY = "contrib:pending";

/** Base Upstash des compléments et des piscines ajoutées ; null sans variables (dev hors ligne). */
export function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

/** 20 envois par heure et par IP, compléments et ajouts confondus. */
export async function tooMany(db: Redis, req: Request): Promise<boolean> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const key = `rl:contrib:${ip}`;
  const hits = await db.incr(key);
  if (hits === 1) await db.expire(key, 3600);
  return hits > 20;
}
