/**
 * Superposition « statut en direct » pour les piscines de Toulouse et de son
 * agglomération.
 *
 * L'application sœur piscines-toulouse.fr relève les pages officielles de
 * chaque gestionnaire environ tous les quarts d'heure en journée (fermetures
 * exceptionnelles et saisonnières comprises) et expose /api/status. Quand une
 * piscine d'ici correspond à une piscine de là-bas, son vrai statut du jour
 * prime sur les horaires OSM.
 */

const STATUS_URL =
  process.env.NEXT_PUBLIC_TOULOUSE_STATUS_URL ??
  "https://toulouse-piscines.vercel.app/api/status";

/**
 * id Data ES (piscines-fr.json) → slugs piscines-toulouse.fr correspondants.
 * Correspondances vérifiées par la distance entre les deux jeux de
 * coordonnées (< 310 m, sauf Léguevin dont le point publié est celui du
 * centre-ville — c'est la seule piscine de la commune).
 */
const SLUGS_BY_POOL_ID: Record<string, string[]> = {
  // Ville de Toulouse
  I315550015: ["piscine-jean-boiteux-espace-job"],
  I315550075: ["piscine-alex-jany"],
  I315550154: ["piscine-yvonne-godard"],
  I315550223: ["piscine-alban-minville"],
  I315550224: ["piscine-bellevue"],
  "I315550226-castex": ["piscine-castex"],
  // Nakache été (150 m extérieur) et hiver (25 m intérieur) = un seul site ici.
  "I315550226-nakache": [
    "piscine-alfred-nakache-ete",
    "piscine-alfred-nakache-hiver",
  ],
  I315550227: ["piscine-leo-lagrange"],
  I315550229: ["piscine-chapou-ete"],
  I315550230: ["piscine-toulouse-lautrec"],
  I315550232: ["piscine-papus"],
  // Reste de Toulouse Métropole
  I311490014: ["espace-nautique-jean-vauchere"],
  I310690007: ["complexe-nautique-des-ramiers"],
  I312820007: ["piscine-launaguet"],
  I315570023: ["piscine-oasis-de-la-ramee"],
  I310440003: ["piscine-balma"],
  I315610001: ["piscine-lunion"],
  I315060008: ["piscine-les-tournesols"],
  I314670005: ["piscine-hersain"],
  // Aire urbaine hors métropole
  I314240013: ["piscine-plaisance-du-touch"],
  I314330010: ["piscine-aquagaronna"],
  I313950005: ["piscine-aqualudia"],
  I314990008: ["piscine-aquabella"],
  I315730003: ["piscine-verfeil"],
  I312320001: ["piscine-grenade"],
  I312910003: ["piscine-leguevin"],
  I314460007: ["piscine-alex-jany-ramonville"],
  I311130001: ["piscine-georges-vallerey"],
};

interface ApiPool {
  slug: string;
  name: string;
  url: string;
  ok: boolean;
  openToday: boolean | null;
  slots: Array<{ start: string; end: string }>;
  closureReason: string | null;
}

export interface LivePoolStatus {
  openToday: boolean;
  /** Créneaux du jour, heures « HH:MM ». */
  slots: Array<{ start: string; end: string }>;
  closureReason: string | null;
  url: string;
  updatedAt: string;
}

/** Statuts live indexés par id de piscine (piscines.json). */
export async function fetchToulouseLive(
  signal?: AbortSignal,
): Promise<Map<string, LivePoolStatus>> {
  const res = await fetch(STATUS_URL, { signal });
  if (!res.ok) throw new Error(`toulouse-piscines : HTTP ${res.status}`);
  const data: { updatedAt: string; pools: ApiPool[] } = await res.json();

  const bySlug = new Map(
    data.pools
      .filter((p) => p.ok && p.openToday !== null)
      .map((p) => [p.slug, p]),
  );

  const result = new Map<string, LivePoolStatus>();
  for (const [poolId, slugs] of Object.entries(SLUGS_BY_POOL_ID)) {
    const entries = slugs
      .map((slug) => bySlug.get(slug))
      .filter((p): p is ApiPool => !!p);
    if (entries.length === 0) continue;
    const openToday = entries.some((p) => p.openToday);
    result.set(poolId, {
      openToday,
      slots: entries.flatMap((p) => p.slots),
      closureReason: openToday
        ? null
        : (entries.map((p) => p.closureReason).find(Boolean) ?? null),
      url: entries[0].url,
      updatedAt: data.updatedAt,
    });
  }
  return result;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Ouverte à l'instant `now` d'après les créneaux live du jour. */
export function isOpenNowLive(status: LivePoolStatus, now: Date): boolean {
  if (!status.openToday) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return status.slots.some(
    ({ start, end }) => minutes >= toMinutes(start) && minutes < toMinutes(end),
  );
}

/** « 12:00 » → « 12h », « 09:30 » → « 9h30 ». */
export function formatSlotTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${+h}h` : `${+h}h${m}`;
}
