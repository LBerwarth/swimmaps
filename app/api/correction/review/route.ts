import { revalidatePath } from "next/cache";
import { applyContrib, pricesText, todayIso, type Contribution, type PendingCorrection } from "@/lib/contrib";
import { LOCALES } from "@/lib/i18n";
import { CONTRIB_KEY, CORRECTION_KEY, redis } from "@/lib/redis";
import { esc, GONE, reviewForm, reviewPage } from "@/lib/review-page";
import { poolPagePath } from "@/lib/slug";
import { findPool } from "@/lib/user-pools";

export const runtime = "nodejs";

const REMOVAL_FR = { closed: "fermée définitivement", missing: "n'existe pas", private: "pas une piscine publique" };

async function load(id: string | null, token: string | null): Promise<PendingCorrection | null> {
  const db = redis();
  if (!db || !id || !token) return null;
  const entry = await db.hget<PendingCorrection>(CORRECTION_KEY, id);
  return entry && entry.token === token ? entry : null;
}

// GET n'agit pas : les messageries ouvrent parfois les liens d'un e-mail toutes seules.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");
  const entry = await load(id, token);
  const source = entry && (await findPool(entry.poolId));
  if (!entry || !source) return reviewPage(GONE, 404);
  const db = redis()!;
  const pool = applyContrib(source, (await db.hget<Contribution>(CONTRIB_KEY, source.id)) ?? undefined);
  const rows: Array<[string, string]> = [["Piscine", `${pool.name} (${pool.city}, ${pool.country})`]];
  if (entry.hours) rows.push(["Horaires actuels", pool.hours ?? "—"], ["Horaires proposés", entry.hours]);
  if (entry.prices || entry.free) {
    rows.push(
      [
        "Tarifs actuels",
        pool.prices
          ? pricesText(pool.prices, pool.country)
          : (pool.charge ?? (pool.fee === false ? "gratuit" : pool.fee ? "payant" : "—")),
      ],
      ["Tarifs proposés", entry.prices ? pricesText(entry.prices, pool.country) : "gratuit"],
    );
  }
  if (entry.closure) rows.push(["Fermeture temporaire", `du ${entry.closure.from} au ${entry.closure.to}`]);
  if (entry.phone) rows.push(["Téléphone actuel", pool.phone ?? "—"], ["Téléphone proposé", entry.phone]);
  if (entry.website) rows.push(["Site actuel", pool.website ?? "—"], ["Site proposé", entry.website]);
  if (entry.removal) rows.push(["À retirer du site", REMOVAL_FR[entry.removal]]);
  return reviewForm(
    "Correction proposée",
    rows,
    id!,
    token!,
    `<p><a href="${esc(poolPagePath("fr", pool))}" target="_blank">Voir la fiche</a></p>`,
  );
}

export async function POST(req: Request) {
  const form = await req.formData();
  const id = form.get("id")?.toString() ?? null;
  const token = form.get("token")?.toString() ?? null;
  const entry = await load(id, token);
  const db = redis();
  const source = entry && (await findPool(entry.poolId));
  if (!entry || !db || !source) return reviewPage(GONE, 404);

  await db.hdel(CORRECTION_KEY, id!);
  if (form.get("action") !== "approve") return reviewPage("<p>Correction refusée et supprimée.</p>");

  const prev = (await db.hget<Contribution>(CONTRIB_KEY, source.id)) ?? { at: "" };
  const corrected = new Set(prev.corrected ?? []);
  const next: Contribution = { ...prev, at: new Date().toISOString() };
  if (entry.hours) {
    next.hours = entry.hours;
    corrected.add("hours");
  }
  if (entry.prices || entry.free) {
    delete next.prices;
    delete next.free;
    if (entry.prices) next.prices = entry.prices;
    else next.free = true;
    corrected.add("price");
  }
  if (entry.closure) {
    // Les fermetures passées tombent ; trois au plus restent connues.
    const today = todayIso();
    next.closures = [...(prev.closures ?? []).filter((c) => c.to >= today), entry.closure].slice(-3);
  }
  if (entry.phone) {
    next.phone = entry.phone;
    corrected.add("phone");
  }
  if (entry.website) {
    next.website = entry.website;
    corrected.add("website");
  }
  if (entry.removal) next.removed = entry.removal;
  next.corrected = [...corrected];
  await db.hset(CONTRIB_KEY, { [source.id]: next });
  for (const l of LOCALES) revalidatePath(poolPagePath(l, source));
  return reviewPage(
    `<p>Correction appliquée : <a href="${esc(poolPagePath("fr", source))}">${esc(source.name)}</a>.</p>`,
  );
}
