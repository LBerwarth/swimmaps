import { envOf, formatPrice, pricesText, weekToOsm } from "@/lib/contrib";
import { haversineKm } from "@/lib/geo";
import { sendMail } from "@/lib/mail";
import { parseNewPool } from "@/lib/newpool";
import { getAllPools } from "@/lib/pools-server";
import { redis, tooMany } from "@/lib/redis";
import { SITE_URL } from "@/lib/site";
import { poolSlug } from "@/lib/slug";
import type { Pool } from "@/lib/types";
import { getUserPools, PENDING_KEY, type PendingPool } from "@/lib/user-pools";

export const runtime = "nodejs";

/** Une piscine connue à moins de 100 m : sans doute la même. */
const SAME_PLACE_KM = 0.1;

export async function GET() {
  return Response.json(await getUserPools(), {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" },
  });
}

interface PhotonProps {
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  town?: string;
  village?: string;
  district?: string;
  countrycode?: string;
}

/** Adresse déduite des coordonnées : rien de ce que tape le visiteur n'en fait partie. */
async function reverseGeocode(lat: number, lon: number): Promise<PhotonProps | null> {
  const res = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&limit=1`, {
    headers: { "User-Agent": "swimmaps/1.0 (+https://www.swimmaps.eu)" },
  }).catch(() => null);
  if (!res?.ok) return null;
  const data = (await res.json().catch(() => null)) as { features?: Array<{ properties?: PhotonProps }> } | null;
  return data?.features?.[0]?.properties ?? null;
}

export async function POST(req: Request) {
  const db = redis();
  if (!db) return Response.json({ error: "unavailable" }, { status: 503 });
  if (await tooMany(db, req)) return Response.json({ error: "too_many" }, { status: 429 });

  const input = parseNewPool(await req.json().catch(() => null));
  if (!input) return Response.json({ error: "invalid" }, { status: 400 });

  const pending = Object.values((await db.hgetall<Record<string, PendingPool>>(PENDING_KEY)) ?? {}).map((p) => p.pool);
  const nearby = [...getAllPools(), ...(await getUserPools()), ...pending].find(
    (p) => haversineKm(p.lat, p.lon, input.lat, input.lon) < SAME_PLACE_KM,
  );
  if (nearby) return Response.json({ error: "exists", slug: poolSlug(nearby) }, { status: 409 });

  const place = await reverseGeocode(input.lat, input.lon);
  if (!place?.countrycode) return Response.json({ error: "unavailable" }, { status: 502 });

  const id = `U${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const pool: Pool = {
    id,
    name: input.name,
    city: place.city ?? place.town ?? place.village ?? place.district ?? "",
    cp: place.postcode ?? "",
    ...(place.street ? { address: [place.street, place.housenumber].filter(Boolean).join(" ") } : {}),
    country: place.countrycode.toUpperCase(),
    lat: input.lat,
    lon: input.lon,
    ...(input.env && { env: envOf(input.env).env }),
    ...(input.len && { lens: [input.len] }),
    basins: input.env === "nat" ? ["naturel"] : [],
    ...(input.website && { website: input.website }),
    ...(input.phone && { phone: input.phone }),
    ...(input.week && { hours: weekToOsm(input.week, input.holiday, input.season), hoursFrom: "user" as const }),
    ...(input.prices && {
      prices: input.prices,
      fee: true,
      ...(input.prices.adult && { charge: formatPrice(input.prices.adult, place.countrycode.toUpperCase()) }),
    }),
    ...(input.free && { fee: false }),
    addedBy: "user",
  };
  const token = crypto.randomUUID();
  await db.hset(PENDING_KEY, {
    [id]: { pool, token, note: input.note ?? null, at: new Date().toISOString() } satisfies PendingPool,
  });

  await sendMail(
    `SwimMaps — nouvelle piscine à valider : ${pool.name}`,
    [
      `Nom : ${pool.name}`,
      `Adresse : ${pool.address ?? "—"}, ${pool.cp} ${pool.city} (${pool.country})`,
      `Carte : https://www.openstreetmap.org/?mlat=${pool.lat}&mlon=${pool.lon}#map=18/${pool.lat}/${pool.lon}`,
      ...(input.env ? [`Type : ${input.env}`] : []),
      ...(pool.lens ? [`Longueur : ${pool.lens[0]} m`] : []),
      ...(pool.website ? [`Site : ${pool.website}`] : []),
      ...(pool.phone ? [`Téléphone : ${pool.phone}`] : []),
      ...(pool.hours ? [`Horaires : ${pool.hours}`] : []),
      ...(pool.prices ? [`Tarifs : ${pricesText(pool.prices, pool.country)}`] : pool.fee === false ? ["Entrée gratuite"] : []),
      ...(input.note ? ["", `Message : ${input.note}`] : []),
      "",
      `Valider ou refuser : ${SITE_URL}/api/newpool/review?id=${id}&token=${token}`,
    ].join("\n"),
  );

  return Response.json({ ok: true });
}

