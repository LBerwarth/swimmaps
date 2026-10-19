import { revalidatePath, revalidateTag } from "next/cache";
import { pricesText } from "@/lib/contrib";
import { LOCALES } from "@/lib/i18n";
import { redis } from "@/lib/redis";
import { esc, GONE, reviewForm, reviewPage } from "@/lib/review-page";
import { poolPagePath } from "@/lib/slug";
import { APPROVED_KEY, PENDING_KEY, USER_POOLS_TAG, type PendingPool } from "@/lib/user-pools";

export const runtime = "nodejs";

async function load(id: string | null, token: string | null): Promise<PendingPool | null> {
  const db = redis();
  if (!db || !id || !token) return null;
  const entry = await db.hget<PendingPool>(PENDING_KEY, id);
  return entry && entry.token === token ? entry : null;
}

// GET n'agit pas : les messageries ouvrent parfois les liens d'un e-mail toutes seules.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");
  const entry = await load(id, token);
  if (!entry) return reviewPage(GONE, 404);
  const p = entry.pool;
  return reviewForm(
    "Nouvelle piscine proposée",
    [
      ["Nom", p.name],
      ["Adresse", `${p.address ?? "—"}, ${p.cp} ${p.city} (${p.country})`],
      ["Type", p.env ?? "—"],
      ["Longueur", p.lens ? `${p.lens[0]} m` : "—"],
      ["Site", p.website ?? "—"],
      ["Téléphone", p.phone ?? "—"],
      ["Horaires", p.hours ?? "—"],
      ["Tarifs", p.prices ? pricesText(p.prices, p.country) : p.fee === false ? "gratuit" : "—"],
      ["Message", entry.note ?? "—"],
    ],
    id!,
    token!,
    `<p><a href="https://www.openstreetmap.org/?mlat=${p.lat}&amp;mlon=${p.lon}#map=18/${p.lat}/${p.lon}" target="_blank" rel="noreferrer">Voir sur la carte</a></p>`,
  );
}

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id")?.toString() ?? null;
  const token = form.get("token")?.toString() ?? null;
  const entry = await load(id, token);
  const db = redis();
  if (!entry || !db) return reviewPage(GONE, 404);

  await db.hdel(PENDING_KEY, id!);
  if (form.get("action") !== "approve") return reviewPage("<p>Proposition refusée et supprimée.</p>");

  await db.hset(APPROVED_KEY, { [entry.pool.id]: entry.pool });
  revalidateTag(USER_POOLS_TAG, { expire: 0 });
  for (const l of LOCALES) revalidatePath(poolPagePath(l, entry.pool));
  return reviewPage(
    `<p>Piscine validée : <a href="${esc(poolPagePath("fr", entry.pool))}">${esc(entry.pool.name)}</a>.</p>`,
  );
}
