import type { Locale } from "./i18n";
import type { Pool } from "./types";

export interface SchoolHoliday {
  name: string;
  /** Dernier jour de vacances « AAAA-MM-JJ », null si la source ne donne que le début. */
  lastDay: string | null;
}

/** Départements par académie (calendrier du ministère, zone selon l'académie). */
const ACADEMIES: Record<string, string[]> = {
  Besançon: ["25", "39", "70", "90"],
  Bordeaux: ["24", "33", "40", "47", "64"],
  "Clermont-Ferrand": ["03", "15", "43", "63"],
  Dijon: ["21", "58", "71", "89"],
  Grenoble: ["07", "26", "38", "73", "74"],
  Limoges: ["19", "23", "87"],
  Lyon: ["01", "42", "69"],
  Poitiers: ["16", "17", "79", "86"],
  "Aix-Marseille": ["04", "05", "13", "84"],
  Amiens: ["02", "60", "80"],
  Lille: ["59", "62"],
  "Nancy-Metz": ["54", "55", "57", "88"],
  Nantes: ["44", "49", "53", "72", "85"],
  Nice: ["06", "83"],
  Normandie: ["14", "27", "50", "61", "76"],
  "Orléans-Tours": ["18", "28", "36", "37", "41", "45"],
  Reims: ["08", "10", "51", "52"],
  Rennes: ["22", "29", "35", "56"],
  Strasbourg: ["67", "68"],
  Créteil: ["77", "93", "94"],
  Montpellier: ["11", "30", "34", "48", "66"],
  Paris: ["75"],
  Toulouse: ["09", "12", "31", "32", "46", "65", "81", "82"],
  Versailles: ["78", "91", "92", "95"],
  Corse: ["2A", "2B"],
  Guadeloupe: ["971"],
  Martinique: ["972"],
  Guyane: ["973"],
  Réunion: ["974"],
  Mayotte: ["976"],
};

export function academyOf(dep: string): string | null {
  return Object.entries(ACADEMIES).find(([, deps]) => deps.includes(dep))?.[0] ?? null;
}

/** Nom de région renvoyé par Photon → code de subdivision OpenHolidays. */
const SUBDIVISIONS: Record<string, Record<string, string>> = {
  DE: {
    "Baden-Württemberg": "DE-BW",
    Bayern: "DE-BY",
    Berlin: "DE-BE",
    Brandenburg: "DE-BB",
    Bremen: "DE-HB",
    "Freie Hansestadt Bremen": "DE-HB",
    Hamburg: "DE-HH",
    Hessen: "DE-HE",
    "Mecklenburg-Vorpommern": "DE-MV",
    Niedersachsen: "DE-NI",
    "Nordrhein-Westfalen": "DE-NW",
    "Rheinland-Pfalz": "DE-RP",
    Saarland: "DE-SL",
    Sachsen: "DE-SN",
    "Sachsen-Anhalt": "DE-ST",
    "Schleswig-Holstein": "DE-SH",
    Thüringen: "DE-TH",
  },
  AT: {
    Burgenland: "AT-BL",
    Kärnten: "AT-KÄ",
    Niederösterreich: "AT-NÖ",
    Oberösterreich: "AT-OÖ",
    Salzburg: "AT-SB",
    Steiermark: "AT-SM",
    Tirol: "AT-TI",
    Vorarlberg: "AT-VA",
    Wien: "AT-WI",
  },
  // Bruxelles absente : les deux communautés y ont chacune leur calendrier.
  BE: {
    Antwerpen: "BE-NL",
    Limburg: "BE-NL",
    "Oost-Vlaanderen": "BE-NL",
    "West-Vlaanderen": "BE-NL",
    "Vlaams-Brabant": "BE-NL",
    Hainaut: "BE-FR",
    Liège: "BE-FR",
    Luxembourg: "BE-FR",
    Namur: "BE-FR",
    "Brabant wallon": "BE-FR",
  },
};

/** Pays dont les vacances sont nationales chez OpenHolidays. */
const NATIONWIDE = ["PT"];

export function subdivisionOf(country: string, state: string | null | undefined): string | null {
  return (state && SUBDIVISIONS[country]?.[state]) || null;
}

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

interface MinistryRecord {
  description?: string;
  start_date?: string;
  end_date?: string;
}

/** Ministère : `end_date` = jour de reprise à minuit (Paris), donc dernier jour = veille. */
export function pickMinistryHoliday(records: MinistryRecord[], now: Date): SchoolHoliday | null {
  const t = now.getTime();
  for (const r of records) {
    if (!r.description || !r.start_date || !r.end_date) continue;
    if (/^Pont/i.test(r.description)) continue;
    const start = Date.parse(r.start_date);
    const end = Date.parse(r.end_date);
    if (t < start || t > end) continue;
    return {
      name: r.description.replace(/^Début des /, ""),
      lastDay: end > start ? isoDay(new Date(end - 86_400_000)) : null,
    };
  }
  return null;
}

interface OpenHolidaysRecord {
  startDate: string;
  endDate: string;
  name: Array<{ language: string; text: string }>;
  nationwide: boolean;
  subdivisions?: Array<{ code: string }>;
}

export function pickOpenHoliday(
  records: OpenHolidaysRecord[],
  subdivision: string | null,
  today: string,
  locale: Locale,
): SchoolHoliday | null {
  const r = records.find(
    (h) =>
      h.startDate <= today &&
      today <= h.endDate &&
      (h.nationwide || (subdivision !== null && (h.subdivisions ?? []).some((s) => s.code === subdivision))),
  );
  if (!r) return null;
  const name =
    r.name.find((n) => n.language === locale.toUpperCase()) ?? r.name.find((n) => n.language === "EN") ?? r.name[0];
  return { name: name?.text ?? "", lastDay: r.endDate > r.startDate ? r.endDate : null };
}

/** Région de la piscine la plus proche (Photon), pas celle de l'utilisateur : aucune position ne sort. */
async function photonState(pool: Pool): Promise<string | null> {
  const res = await fetch(`https://photon.komoot.io/reverse?lat=${pool.lat}&lon=${pool.lon}`);
  if (!res.ok) return null;
  const data = (await res.json()) as { features?: Array<{ properties?: { state?: string; city?: string } }> };
  const p = data.features?.[0]?.properties;
  // Villes-États (Berlin, Hambourg, Vienne) : Photon ne renvoie que la ville.
  return p?.state ?? p?.city ?? null;
}

const cache = new Map<string, Promise<SchoolHoliday | null>>();

/**
 * Vacances scolaires en cours autour de la piscine. FR : ministère de
 * l'Éducation nationale ; DE, AT, BE, PT : OpenHolidays. Ailleurs (GB, IE, ES,
 * IT, NL, CH) : pas de source exploitable → null.
 */
export function currentSchoolHoliday(pool: Pool, locale: Locale, now = new Date()): Promise<SchoolHoliday | null> {
  const today = isoDay(now);
  const key = `${pool.country}:${pool.dep ?? ""}:${pool.country in SUBDIVISIONS ? pool.id : ""}:${locale}:${today}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = load(pool, locale, now, today).catch(() => null);
    cache.set(key, pending);
  }
  return pending;
}

async function load(pool: Pool, locale: Locale, now: Date, today: string): Promise<SchoolHoliday | null> {
  if (pool.country === "FR") {
    const academy = pool.dep ? academyOf(pool.dep) : null;
    if (!academy) return null;
    const where = encodeURIComponent(`location="${academy}"`);
    const res = await fetch(
      "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records" +
        `?select=description,start_date,end_date&where=${where}&order_by=start_date%20desc&limit=40`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: MinistryRecord[] };
    return pickMinistryHoliday(data.results ?? [], now);
  }
  const nationwide = NATIONWIDE.includes(pool.country);
  if (!nationwide && !(pool.country in SUBDIVISIONS)) return null;
  const subdivision = nationwide ? null : subdivisionOf(pool.country, await photonState(pool));
  if (!nationwide && !subdivision) return null;
  const res = await fetch(
    `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${pool.country}&languageIsoCode=${locale.toUpperCase()}` +
      `&validFrom=${today}&validTo=${today}`,
  );
  if (!res.ok) return null;
  return pickOpenHoliday((await res.json()) as OpenHolidaysRecord[], subdivision, today, locale);
}
