import type { Pool, PoolEnv } from "./types";

/** Complément saisi par un visiteur quand la source n'a pas l'information. */
export interface Contribution {
  env?: PoolEnv;
  lens?: number[];
  at: string;
}

export type ContribMap = Record<string, Contribution>;

export const LEN_MIN = 5;
export const LEN_MAX = 100;
const ENVS: PoolEnv[] = ["int", "ext", "mix"];

export type ContribInput = { id: string; env?: PoolEnv; len?: number };

export function parseContribution(body: unknown): ContribInput | null {
  if (typeof body !== "object" || body === null) return null;
  const { id, env, len } = body as Record<string, unknown>;
  if (typeof id !== "string" || !/^[A-Za-z0-9]{2,40}$/.test(id)) return null;
  const okEnv = typeof env === "string" && (ENVS as string[]).includes(env) ? (env as PoolEnv) : undefined;
  const okLen =
    typeof len === "number" && Number.isFinite(len) && len >= LEN_MIN && len <= LEN_MAX
      ? Math.round(len * 10) / 10
      : undefined;
  if (okEnv === undefined && okLen === undefined) return null;
  return { id, ...(okEnv && { env: okEnv }), ...(okLen && { len: okLen }) };
}

/** Les compléments ne remplacent jamais une donnée de la source. */
export function applyContrib(pool: Pool, c: Contribution | undefined): Pool {
  if (!c) return pool;
  const env = !pool.env && c.env ? c.env : undefined;
  const lens = !pool.lens?.length && c.lens?.length ? c.lens : undefined;
  if (!env && !lens) return pool;
  return {
    ...pool,
    ...(env && { env }),
    ...(lens && { lens }),
    contributed: [...(env ? ["env" as const] : []), ...(lens ? ["lens" as const] : [])],
  };
}
