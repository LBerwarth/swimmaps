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
  // Grisons et Appenzell Rhodes-Intérieures absents : vacances par région ou district.
  CH: {
    Aargau: "CH-AG",
    "Appenzell Ausserrhoden": "CH-AR",
    Bern: "CH-BE",
    "Basel-Landschaft": "CH-BL",
    "Basel-Stadt": "CH-BS",
    Fribourg: "CH-FR",
    Genève: "CH-GE",
    Glarus: "CH-GL",
    Jura: "CH-JU",
    Luzern: "CH-LU",
    Neuchâtel: "CH-NE",
    Nidwalden: "CH-NW",
    Obwalden: "CH-OW",
    "St. Gallen": "CH-SG",
    Schaffhausen: "CH-SH",
    Solothurn: "CH-SO",
    Schwyz: "CH-SZ",
    Thurgau: "CH-TG",
    Ticino: "CH-TI",
    Uri: "CH-UR",
    Vaud: "CH-VD",
    Valais: "CH-VS",
    Zug: "CH-ZG",
    Zürich: "CH-ZH",
  },
};

/** Pays dont les vacances sont nationales chez OpenHolidays. */
const NATIONWIDE = ["PT", "IE"];

/** Code postal espagnol : les deux premiers chiffres = province (INE). Andalousie et Aragon : par province. */
const ES_PROVINCES: Record<string, string> = {
  "01": "ES-PV", "02": "ES-CM", "03": "ES-VC", "04": "ES-AN-AL", "05": "ES-CL", "06": "ES-EX",
  "07": "ES-IB", "08": "ES-CT", "09": "ES-CL", "10": "ES-EX", "11": "ES-AN-CA", "12": "ES-VC",
  "13": "ES-CM", "14": "ES-AN-CO", "15": "ES-GA", "16": "ES-CM", "17": "ES-CT", "18": "ES-AN-GR",
  "19": "ES-CM", "20": "ES-PV", "21": "ES-AN-HL", "22": "ES-AR-HU", "23": "ES-AN-JA", "24": "ES-CL",
  "25": "ES-CT", "26": "ES-RI", "27": "ES-GA", "28": "ES-MD", "29": "ES-AN-MA", "30": "ES-MC",
  "31": "ES-NC", "32": "ES-GA", "33": "ES-AS", "34": "ES-CL", "35": "ES-CN", "36": "ES-GA",
  "37": "ES-CL", "38": "ES-CN", "39": "ES-CB", "40": "ES-CL", "41": "ES-AN-SE", "42": "ES-CL",
  "43": "ES-CT", "44": "ES-AR-TE", "45": "ES-CM", "46": "ES-VC", "47": "ES-CL", "48": "ES-PV",
  "49": "ES-CL", "50": "ES-AR-ZG", "51": "ES-CE", "52": "ES-ML",
};

/** CAP italien : deux premiers chiffres → région (Trentin et Haut-Adige séparés). */
const IT_CAP: Array<[string, number[]]> = [
  ["IT-LA", [0, 1, 2, 3, 4]],
  ["IT-UM", [5, 6]],
  ["IT-SA", [7, 8, 9]],
  ["IT-PI", [10, 12, 13, 14, 15, 28]],
  ["IT-VA", [11]],
  ["IT-LI", [16, 17, 18, 19]],
  ["IT-LO", [20, 21, 22, 23, 24, 25, 26, 27, 46]],
  ["IT-ER", [29, 40, 41, 42, 43, 44, 47, 48]],
  ["IT-VE", [30, 31, 32, 35, 36, 37, 45]],
  ["IT-FV", [33, 34]],
  ["IT-TR-TN", [38]],
  ["IT-TR-BZ", [39]],
  ["IT-TO", [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]],
  ["IT-MA", [60, 61, 62, 63]],
  ["IT-AB", [64, 65, 66, 67]],
  ["IT-PU", [70, 71, 72, 73, 74, 76]],
  ["IT-BA", [75, 85]],
  ["IT-CM", [80, 81, 82, 83, 84]],
  ["IT-MO", [86]],
  ["IT-CL", [87, 88, 89]],
  ["IT-SI", [90, 91, 92, 93, 94, 95, 96, 97, 98]],
];

const BY_POSTCODE = ["ES", "IT"];

export function subdivisionOf(country: string, state: string | null | undefined): string | null {
  if (!state) return null;
  // Noms bilingues chez Photon (« Bern/Berne », « Valais/Wallis »).
  for (const name of [state, ...state.split("/")]) {
    const code = SUBDIVISIONS[country]?.[name.trim()];
    if (code) return code;
  }
  return null;
}

export type NlRegion = "noord" | "midden" | "zuid";

const NL_ZUID_GELDERLAND = [
  "Arnhem", "Berg en Dal", "Beuningen", "Doesburg", "Druten", "Duiven", "Heumen", "Lingewaard",
  "Maasdriel", "Nijmegen", "Overbetuwe", "Renkum", "Rheden", "Rozendaal", "Westervoort",
  "West Maas en Waal", "Wijchen", "Zaltbommel", "Zevenaar",
];

/** Région de vacances d'après la page « regio's schoolvakantie » de la Rijksoverheid. */
export function nlRegion(province: string, municipality: string, place: string): NlRegion | null {
  switch (province) {
    case "Drenthe":
    case "Fryslân":
    case "Friesland":
    case "Groningen":
    case "Noord-Holland":
    case "Overijssel":
      return "noord";
    case "Flevoland":
      return municipality === "Zeewolde" ? "midden" : "noord";
    case "Utrecht":
      // Ancienne commune d'Abcoude (Abcoude, Baambrugge), aujourd'hui De Ronde Venen.
      return municipality === "Eemnes" || place === "Abcoude" || place === "Baambrugge" ? "noord" : "midden";
    case "Zuid-Holland":
      return "midden";
    case "Gelderland":
      if (municipality === "Hattem") return "noord";
      if (NL_ZUID_GELDERLAND.includes(municipality) || ["Didam", "Loil", "Nieuw-Dijk", "Dodewaard"].includes(place)) return "zuid";
      return "midden";
    case "Noord-Brabant":
      return municipality === "Altena" && place !== "Hank" && place !== "Dussen" ? "midden" : "zuid";
    case "Limburg":
    case "Zeeland":
      return "zuid";
    default:
      return null;
  }
}

export function subdivisionByPostcode(country: string, postcode: string | null | undefined): string | null {
  if (!postcode || !/^\d{5}$/.test(postcode)) return null;
  const prefix = postcode.slice(0, 2);
  if (country === "ES") return ES_PROVINCES[prefix] ?? null;
  if (country === "IT") return IT_CAP.find(([, ps]) => ps.includes(Number(prefix)))?.[0] ?? null;
  return null;
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
      (h.nationwide ||
        (subdivision !== null &&
          // Vacances d'une région valables pour ses provinces (ES-AR → ES-AR-HU).
          (h.subdivisions ?? []).some((s) => s.code === subdivision || subdivision.startsWith(`${s.code}-`)))),
  );
  if (!r) return null;
  const name =
    r.name.find((n) => n.language === locale.toUpperCase()) ?? r.name.find((n) => n.language === "EN") ?? r.name[0];
  return { name: name?.text ?? "", lastDay: r.endDate > r.startDate ? r.endDate : null };
}

export interface NlHolidayYear {
  content: Array<{
    vacations: Array<{
      type: string;
      regions: Array<{ region: string; startdate: string; enddate: string }>;
    }>;
  }>;
}

const amsterdamDay = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });

/** Rijksoverheid : dates en UTC, jour civil lu à l'heure d'Amsterdam ; « heel Nederland » vaut pour tous. */
export function pickNlHoliday(years: NlHolidayYear[], region: NlRegion, today: string): SchoolHoliday | null {
  for (const vacation of years.flatMap((y) => y.content.flatMap((c) => c.vacations))) {
    for (const r of vacation.regions) {
      const name = r.region.trim();
      if (name !== region && name !== "heel Nederland") continue;
      const start = amsterdamDay(r.startdate);
      const end = amsterdamDay(r.enddate);
      if (start <= today && today <= end) return { name: vacation.type.trim(), lastDay: end };
    }
  }
  return null;
}

async function nlHoliday(pool: Pool, today: string): Promise<SchoolHoliday | null> {
  const place = await fetch(
    `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${pool.lat}&lon=${pool.lon}&rows=1` +
      "&fl=gemeentenaam,provincienaam,woonplaatsnaam",
  );
  if (!place.ok) return null;
  const doc = ((await place.json()) as {
    response?: { docs?: Array<{ gemeentenaam?: string; provincienaam?: string; woonplaatsnaam?: string }> };
  }).response?.docs?.[0];
  const region = doc ? nlRegion(doc.provincienaam ?? "", doc.gemeentenaam ?? "", doc.woonplaatsnaam ?? "") : null;
  if (!region) return null;
  // Proxy maison : l'API de la Rijksoverheid n'autorise pas les appels depuis le navigateur.
  const res = await fetch("/api/holidays/nl");
  if (!res.ok) return null;
  return pickNlHoliday((await res.json()) as NlHolidayYear[], region, today);
}

/** Région de la piscine la plus proche (Photon), pas celle de l'utilisateur : aucune position ne sort. */
async function photonPlace(pool: Pool): Promise<{ state: string | null; postcode: string | null }> {
  // Sans lang=default, Photon traduit selon Accept-Language (« Rhénanie-du-Nord-Westphalie »).
  const res = await fetch(`https://photon.komoot.io/reverse?lat=${pool.lat}&lon=${pool.lon}&lang=default`);
  if (!res.ok) return { state: null, postcode: null };
  const data = (await res.json()) as {
    features?: Array<{ properties?: { state?: string; city?: string; postcode?: string } }>;
  };
  const p = data.features?.[0]?.properties;
  // Villes-États (Berlin, Hambourg, Vienne) : Photon ne renvoie que la ville.
  return { state: p?.state ?? p?.city ?? null, postcode: p?.postcode ?? null };
}

async function subdivisionFor(pool: Pool): Promise<string | null> {
  if (BY_POSTCODE.includes(pool.country)) {
    const own = subdivisionByPostcode(pool.country, pool.cp);
    return own ?? subdivisionByPostcode(pool.country, (await photonPlace(pool)).postcode);
  }
  return subdivisionOf(pool.country, (await photonPlace(pool)).state);
}

const cache = new Map<string, Promise<SchoolHoliday | null>>();

/**
 * Vacances scolaires en cours autour de la piscine. FR : ministère de
 * l'Éducation nationale ; NL : Rijksoverheid (commune via PDOK) ; DE, AT, BE,
 * CH, PT, IE, ES, IT : OpenHolidays (ES, IT et IE vides pour 2026/27 au
 * 19.10.2026). GB : pas de source centrale → null.
 */
export function currentSchoolHoliday(pool: Pool, locale: Locale, now = new Date()): Promise<SchoolHoliday | null> {
  const today = isoDay(now);
  const regional = pool.country in SUBDIVISIONS || BY_POSTCODE.includes(pool.country) || pool.country === "NL";
  const key = `${pool.country}:${pool.dep ?? ""}:${regional ? pool.id : ""}:${locale}:${today}`;
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
  if (pool.country === "NL") return nlHoliday(pool, today);
  const nationwide = NATIONWIDE.includes(pool.country);
  if (!nationwide && !(pool.country in SUBDIVISIONS) && !BY_POSTCODE.includes(pool.country)) return null;
  const subdivision = nationwide ? null : await subdivisionFor(pool);
  if (!nationwide && !subdivision) return null;
  const res = await fetch(
    `https://openholidaysapi.org/SchoolHolidays?countryIsoCode=${pool.country}&languageIsoCode=${locale.toUpperCase()}` +
      `&validFrom=${today}&validTo=${today}`,
  );
  if (!res.ok) return null;
  return pickOpenHoliday((await res.json()) as OpenHolidaysRecord[], subdivision, today, locale);
}
