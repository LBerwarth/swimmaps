import { Redis } from "@upstash/redis";
import { parseContribution, type ContribMap, type Contribution } from "@/lib/contrib";
import { sendMail } from "@/lib/mail";
import { getPoolBySlug } from "@/lib/pools-server";
import { poolPagePath } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const KEY = "contrib";
const MAX_PER_HOUR = 20;

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

export async function GET() {
  const db = redis();
  const all = db ? ((await db.hgetall<ContribMap>(KEY).catch(() => null)) ?? {}) : {};
  return Response.json(all, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" },
  });
}

export async function POST(req: Request) {
  const db = redis();
  if (!db) return Response.json({ error: "unavailable" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = `rl:contrib:${ip}`;
  const hits = await db.incr(rl);
  if (hits === 1) await db.expire(rl, 3600);
  if (hits > MAX_PER_HOUR) return Response.json({ error: "too_many" }, { status: 429 });

  const input = parseContribution(await req.json().catch(() => null));
  if (!input) return Response.json({ error: "invalid" }, { status: 400 });
  const pool = getPoolBySlug(input.id);
  if (!pool) return Response.json({ error: "invalid" }, { status: 400 });

  // Premier arrivé : une valeur déjà connue (source ou visiteur) n'est pas écrasée.
  const prev = (await db.hget<Contribution>(KEY, pool.id)) ?? undefined;
  const env = input.env && !pool.env && !prev?.env ? input.env : undefined;
  const len = input.len && !pool.lens?.length && !prev?.lens?.length ? input.len : undefined;
  if (!env && !len) return Response.json({ error: "known" }, { status: 409 });

  const next: Contribution = {
    ...prev,
    ...(env && { env }),
    ...(len && { lens: [len] }),
    at: new Date().toISOString(),
  };
  await db.hset(KEY, { [pool.id]: next });

  await sendMail(
    `Swimmaps — complément : ${pool.name}`,
    [
      `Piscine : ${pool.name} (${pool.city}, ${pool.country}) — ${pool.id}`,
      `Page : ${SITE_URL}${poolPagePath("fr", pool)}`,
      ...(env ? [`Type : ${env}`] : []),
      ...(len ? [`Longueur : ${len} m`] : []),
      "",
      `Retirer : HDEL ${KEY} ${pool.id} (console Upstash)`,
    ].join("\n"),
  );

  return Response.json({ ok: true, contribution: next });
}
