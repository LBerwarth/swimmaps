import {
  applyContrib,
  envOf,
  pricesText,
  missingFields,
  parseContribution,
  weekToOsm,
  type ContribMap,
  type Contribution,
} from "@/lib/contrib";
import { sendMail } from "@/lib/mail";
import { CONTRIB_KEY as KEY, redis, tooMany } from "@/lib/redis";
import { poolPagePath } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";
import { findPool } from "@/lib/user-pools";

export const runtime = "nodejs";

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

  if (await tooMany(db, req)) return Response.json({ error: "too_many" }, { status: 429 });

  const input = parseContribution(await req.json().catch(() => null));
  if (!input) return Response.json({ error: "invalid" }, { status: 400 });
  const pool = await findPool(input.id);
  if (!pool) return Response.json({ error: "invalid" }, { status: 400 });

  // Premier arrivé : une valeur déjà connue (source ou visiteur) n'est pas écrasée.
  const prev = (await db.hget<Contribution>(KEY, pool.id)) ?? undefined;
  const open = missingFields(applyContrib(pool, prev));
  const choice = input.env && open.includes("env") ? envOf(input.env) : undefined;
  const env = choice?.env;
  const len = input.len && open.includes("lens") ? input.len : undefined;
  const hours = input.week && open.includes("hours") ? weekToOsm(input.week, input.holiday, input.season) : undefined;
  const prices = input.prices && open.includes("price") ? input.prices : undefined;
  const free = input.free && open.includes("price") && pool.fee === undefined ? true : undefined;
  if (!env && !len && !hours && !prices && !free) return Response.json({ error: "known" }, { status: 409 });

  const next: Contribution = {
    ...prev,
    ...(choice && { env: choice.env, ...(choice.natural && { natural: true as const }) }),
    ...(len && { lens: [len] }),
    ...(hours && { hours }),
    ...(prices && { prices }),
    ...(free && { free }),
    at: new Date().toISOString(),
  };
  await db.hset(KEY, { [pool.id]: next });

  await sendMail(
    `SwimMaps — complément : ${pool.name}`,
    [
      `Piscine : ${pool.name} (${pool.city}, ${pool.country}) — ${pool.id}`,
      `Page : ${SITE_URL}${poolPagePath("fr", pool)}`,
      ...(input.env && env ? [`Type : ${input.env}`] : []),
      ...(len ? [`Longueur : ${len} m`] : []),
      ...(hours ? [`Horaires : ${hours}`] : []),
      ...(prices ? [`Tarifs : ${pricesText(prices, pool.country)}`] : []),
      ...(free ? ["Entrée gratuite"] : []),
      "",
      `Retirer : HDEL ${KEY} ${pool.id} (console Upstash)`,
    ].join("\n"),
  );

  return Response.json({ ok: true, contribution: next });
}
