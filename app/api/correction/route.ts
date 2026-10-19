import {
  applyContrib,
  pricesText,
  parseContribution,
  weekToOsm,
  type Contribution,
  type PendingCorrection,
} from "@/lib/contrib";
import { sendMail } from "@/lib/mail";
import { CONTRIB_KEY, CORRECTION_KEY, redis, tooMany } from "@/lib/redis";
import { SITE_URL } from "@/lib/site";
import { poolPagePath } from "@/lib/slug";
import { findPool } from "@/lib/user-pools";

export const runtime = "nodejs";

const REMOVAL_FR = { closed: "fermée définitivement", missing: "n'existe pas", private: "pas une piscine publique" };

/** Correction d'horaires ou de tarif déjà connus : en attente jusqu'à validation par l'auteure. */
export async function POST(req: Request) {
  const db = redis();
  if (!db) return Response.json({ error: "unavailable" }, { status: 503 });
  if (await tooMany(db, req)) return Response.json({ error: "too_many" }, { status: 429 });

  const input = parseContribution(await req.json().catch(() => null));
  if (
    !input ||
    (!input.week && !input.prices && !input.free && !input.closure && !input.phone && !input.website && !input.removal)
  ) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const source = await findPool(input.id);
  if (!source) return Response.json({ error: "invalid" }, { status: 400 });
  const pool = applyContrib(source, (await db.hget<Contribution>(CONTRIB_KEY, source.id)) ?? undefined);

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const token = crypto.randomUUID();
  const entry: PendingCorrection = {
    poolId: pool.id,
    ...(input.week && { hours: weekToOsm(input.week, input.holiday, input.season) }),
    ...(input.prices && { prices: input.prices }),
    ...(input.free && { free: true as const }),
    ...(input.closure && { closure: input.closure }),
    ...(input.phone && { phone: input.phone }),
    ...(input.website && { website: input.website }),
    ...(input.removal && { removal: input.removal }),
    token,
    at: new Date().toISOString(),
  };
  await db.hset(CORRECTION_KEY, { [id]: entry });

  const oldPrice = pool.prices
    ? pricesText(pool.prices, pool.country)
    : (pool.charge ?? (pool.fee === false ? "gratuit" : pool.fee ? "payant" : "—"));
  await sendMail(
    `SwimMaps — correction à valider : ${pool.name}`,
    [
      `Piscine : ${pool.name} (${pool.city}, ${pool.country}) — ${pool.id}`,
      `Page : ${SITE_URL}${poolPagePath("fr", pool)}`,
      ...(entry.hours ? [`Horaires : ${pool.hours ?? "—"}  →  ${entry.hours}`] : []),
      ...(entry.prices || entry.free
        ? [`Tarifs : ${oldPrice}  →  ${entry.prices ? pricesText(entry.prices, pool.country) : "gratuit"}`]
        : []),
      ...(entry.closure ? [`Fermeture temporaire : du ${entry.closure.from} au ${entry.closure.to}`] : []),
      ...(entry.phone ? [`Téléphone : ${pool.phone ?? "—"}  →  ${entry.phone}`] : []),
      ...(entry.website ? [`Site : ${pool.website ?? "—"}  →  ${entry.website}`] : []),
      ...(entry.removal ? [`À RETIRER du site : ${REMOVAL_FR[entry.removal]}`] : []),
      "",
      `Valider ou refuser : ${SITE_URL}/api/correction/review?id=${id}&token=${token}`,
    ].join("\n"),
  );

  return Response.json({ ok: true });
}
