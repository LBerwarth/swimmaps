import type { Closure, Pool, PoolEnv, PriceKind, Prices } from "./types";

/** Complément saisi par un visiteur quand la source n'a pas l'information. */
export interface Contribution {
  env?: PoolEnv;
  /** Strand- ou Naturbad : plein air + bassin naturel. */
  natural?: true;
  lens?: number[];
  /** Format OSM `opening_hours`, toujours reconstruit côté serveur. */
  hours?: string;
  prices?: Prices;
  free?: boolean;
  /** Corrections validées par l'auteure : ces champs priment sur la source. */
  corrected?: Array<"hours" | "price" | "phone" | "website">;
  closures?: Closure[];
  phone?: string;
  website?: string;
  /** Signalement validé : la piscine disparaît du site. */
  removed?: RemovalReason;
  at: string;
}

/** Fermée définitivement, inexistante, ou pas une piscine publique (hôtel, club, école…). */
export type RemovalReason = "closed" | "missing" | "private";
export const REMOVAL_REASONS: RemovalReason[] = ["closed", "missing", "private"];

export type ContribMap = Record<string, Contribution>;

/** Correction en attente de validation par l'auteure. */
export interface PendingCorrection {
  poolId: string;
  hours?: string;
  prices?: Prices;
  free?: true;
  closure?: Closure;
  phone?: string;
  website?: string;
  removal?: RemovalReason;
  token: string;
  at: string;
}
export type ContribField = "env" | "lens" | "hours" | "price";

export const CONTRIB_ANCHOR = "contrib";
export const LEN_MIN = 5;
export const LEN_MAX = 100;
export const PRICE_MAX = 2000;
export const MAX_RANGES = 2;
/** Choix proposé au visiteur ; « nat » = plage ou baignade naturelle. */
export type EnvChoice = PoolEnv | "nat";
export const ENV_CHOICES: EnvChoice[] = ["int", "ext", "nat", "mix"];

/** « nat » s'enregistre comme plein air + bassin naturel, comme les Naturbäder de Bäderleben. */
export function envOf(choice: EnvChoice): { env: PoolEnv; natural?: true } {
  return choice === "nat" ? { env: "ext", natural: true } : { env: choice };
}

/** Clé d'affichage du type : plein air à bassin naturel = « nat ». */
export function envKey(pool: Pool): EnvChoice | undefined {
  return pool.env === "ext" && pool.basins.includes("naturel") ? "nat" : pool.env;
}
const OSM_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Plages par jour (0 = lundi), « HH:MM ». Jour vide = fermé. */
export type WeekInput = Array<Array<[string, string]>>;

/** Bornes « MM-DD » (sans année : la période revient chaque année). */
export interface SeasonInput {
  from: string;
  to: string;
  week: WeekInput;
}

const MONTH_DAY = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const OSM_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseSeason(value: unknown): SeasonInput | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const { from, to, week } = value as Record<string, unknown>;
  if (typeof from !== "string" || typeof to !== "string" || !MONTH_DAY.test(from) || !MONTH_DAY.test(to)) {
    return undefined;
  }
  const w = parseWeek(week);
  return w ? { from, to, week: w } : undefined;
}

const osmDate = (md: string) => `${OSM_MONTHS[Number(md.slice(0, 2)) - 1]} ${md.slice(3)}`;

export type ContribInput = {
  id: string;
  env?: EnvChoice;
  len?: number;
  week?: WeekInput;
  /** Horaires des vacances scolaires, s'ils diffèrent. */
  holiday?: WeekInput;
  /** Période datée (vacances d'été…) avec sa propre semaine. */
  season?: SeasonInput;
  prices?: Prices;
  free?: true;
  closure?: Closure;
  phone?: string;
  website?: string;
  removal?: RemovalReason;
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Numéro plausible (chiffres, espaces, + ( ) . / -), sinon undefined. */
export function parsePhone(value: unknown): string | undefined {
  const phone = clean(value, 30);
  return phone && /^\+?[\d\s().\/-]{6,30}$/.test(phone) ? phone : undefined;
}

/** URL http(s), « https:// » ajouté au besoin ; undefined si invalide. */
export function parseWebsite(value: unknown): string | undefined {
  const site = clean(value, 200);
  if (!site) return undefined;
  try {
    const url = new URL(/^https?:\/\//i.test(site) ? site : `https://${site}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

const ISO_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
/** Au-delà, ce n'est plus une fermeture temporaire. */
const CLOSURE_MAX_DAYS = 730;

export const todayIso = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

export function parseClosure(value: unknown, now = new Date()): Closure | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const { from, to } = value as Record<string, unknown>;
  if (typeof from !== "string" || typeof to !== "string" || !ISO_DATE.test(from) || !ISO_DATE.test(to)) return undefined;
  if (from > to || to < todayIso(now)) return undefined;
  const days = (Date.parse(to) - Date.parse(from)) / 86_400_000;
  return days <= CLOSURE_MAX_DAYS ? { from, to } : undefined;
}

/** Fermeture en cours à `date`, ou la prochaine à venir. */
export function closureAt(pool: Pool, date: Date): Closure | undefined {
  const day = todayIso(date);
  return pool.closures?.find((c) => c.from <= day && day <= c.to);
}

export function nextClosure(pool: Pool, date: Date): Closure | undefined {
  const day = todayIso(date);
  return pool.closures?.filter((c) => c.from > day).sort((a, b) => a.from.localeCompare(b.from))[0];
}

/** « 16 » → « 16:00 », « 16h30 » / « 16.30 » / « 1630 » → « 16:30 » ; vide si ce n'est pas une heure. */
export function normalizeTime(value: string): string {
  const m = value.trim().match(/^(\d{1,2})(?:\s*[:.hH]\s*(\d{2})?|(\d{2}))?$/);
  if (!m) return "";
  const h = Number(m[1]);
  const min = Number(m[2] ?? m[3] ?? 0);
  if (h > 23 || min > 59) return "";
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export const PRICE_KINDS: PriceKind[] = ["adult", "child", "senior", "disabled", "student", "family", "ten", "season"];

export function parsePrices(value: unknown): Prices | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const out: Prices = {};
  for (const kind of PRICE_KINDS) {
    const v = (value as Record<string, unknown>)[kind];
    if (typeof v === "number" && Number.isFinite(v) && v > 0 && v <= PRICE_MAX) out[kind] = Math.round(v * 100) / 100;
  }
  return Object.keys(out).length ? out : undefined;
}

const PRICE_LABELS_FR: Record<PriceKind, string> = {
  adult: "Adulte",
  child: "Enfant",
  senior: "Senior",
  disabled: "Handicap",
  student: "Étudiant",
  family: "Famille",
  ten: "10 entrées",
  season: "Abonnement annuel",
};

/** « Adulte 5,50 € · Enfant 3,00 € » ; libellés français par défaut (e-mails de l'auteure). */
export function pricesText(prices: Prices, country: string, labels: Record<PriceKind, string> = PRICE_LABELS_FR): string {
  return PRICE_KINDS.filter((k) => prices[k] !== undefined)
    .map((k) => `${labels[k]} ${formatPrice(prices[k]!, country)}`)
    .join(" · ");
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function parseWeek(value: unknown): WeekInput | undefined {
  if (!Array.isArray(value) || value.length !== 7) return undefined;
  const week: WeekInput = [];
  for (const day of value) {
    if (!Array.isArray(day) || day.length > MAX_RANGES) return undefined;
    const ranges: Array<[string, string]> = [];
    for (const r of day) {
      if (!Array.isArray(r) || r.length !== 2) return undefined;
      const [from, to] = r;
      if (typeof from !== "string" || typeof to !== "string" || !TIME.test(from) || !TIME.test(to)) {
        return undefined;
      }
      if (from >= to) return undefined;
      ranges.push([from, to]);
    }
    ranges.sort((a, b) => a[0].localeCompare(b[0]));
    if (ranges.length === 2 && ranges[0][1] > ranges[1][0]) return undefined;
    week.push(ranges);
  }
  return week.some((d) => d.length) ? week : undefined;
}

export function parseContribution(body: unknown): ContribInput | null {
  if (typeof body !== "object" || body === null) return null;
  const { id, env, len, week, holiday, season, prices, free, closure, phone, website, removal } = body as Record<
    string,
    unknown
  >;
  if (typeof id !== "string" || !/^[A-Za-z0-9]{2,40}$/.test(id)) return null;
  const okEnv = typeof env === "string" && (ENV_CHOICES as string[]).includes(env) ? (env as EnvChoice) : undefined;
  const okLen =
    typeof len === "number" && Number.isFinite(len) && len >= LEN_MIN && len <= LEN_MAX
      ? Math.round(len * 10) / 10
      : undefined;
  const okWeek = parseWeek(week);
  const okHoliday = okWeek ? parseWeek(holiday) : undefined;
  const okSeason = okWeek ? parseSeason(season) : undefined;
  const okPrices = parsePrices(prices);
  const okFree = free === true && okPrices === undefined ? true : undefined;
  const okClosure = parseClosure(closure);
  const okPhone = parsePhone(phone);
  const okWebsite = parseWebsite(website);
  const okRemoval = (REMOVAL_REASONS as unknown[]).includes(removal) ? (removal as RemovalReason) : undefined;
  if (!okEnv && !okLen && !okWeek && !okPrices && !okFree && !okClosure && !okPhone && !okWebsite && !okRemoval) {
    return null;
  }
  return {
    id,
    ...(okEnv && { env: okEnv }),
    ...(okLen && { len: okLen }),
    ...(okWeek && { week: okWeek }),
    ...(okHoliday && { holiday: okHoliday }),
    ...(okSeason && { season: okSeason }),
    ...(okPrices && { prices: okPrices }),
    ...(okFree && { free: okFree }),
    ...(okClosure && { closure: okClosure }),
    ...(okPhone && { phone: okPhone }),
    ...(okWebsite && { website: okWebsite }),
    ...(okRemoval && { removal: okRemoval }),
  };
}

/**
 * [[["07:00","21:00"]], …] → « Mo-Fr 07:00-21:00; Sa 08:00-18:00; Su off » ;
 * les vacances scolaires suivent en règles « SH … ».
 */
export function weekToOsm(week: WeekInput, holiday?: WeekInput, season?: SeasonInput): string {
  const rules = weekRules(week);
  if (holiday) rules.push(...weekRules(holiday).map((r) => `SH ${r}`));
  if (season) {
    const range = `${osmDate(season.from)}-${osmDate(season.to)}`;
    rules.push(...weekRules(season.week).map((r) => `${range} ${r}`));
  }
  return rules.join("; ");
}

function weekRules(week: WeekInput): string[] {
  const rules: string[] = [];
  let start = 0;
  while (start < 7) {
    const key = JSON.stringify(week[start]);
    let end = start;
    while (end + 1 < 7 && JSON.stringify(week[end + 1]) === key) end++;
    const days = start === end ? OSM_DAYS[start] : `${OSM_DAYS[start]}-${OSM_DAYS[end]}`;
    const times = week[start].length ? week[start].map(([a, b]) => `${a}-${b}`).join(",") : "off";
    rules.push(`${days} ${times}`);
    start = end + 1;
  }
  return rules;
}

/** 4.8 → « 4,80 € » ; « £4.80 » en Angleterre, « CHF 4.80 » en Suisse. */
export function formatPrice(price: number, country: string): string {
  if (country === "GB") return `£${price.toFixed(2)}`;
  if (country === "CH") return `CHF ${price.toFixed(2)}`;
  return `${price.toFixed(2).replace(".", ",")} €`;
}

export function currencySymbol(country: string): string {
  return country === "GB" ? "£" : country === "CH" ? "CHF" : "€";
}

/** Nombre de contributions : chaque information saisie et chaque piscine ajoutée. */
export function contributionCount(map: ContribMap, addedPools: number): number {
  let n = addedPools;
  for (const c of Object.values(map)) {
    n += [c.env, c.lens?.length, c.hours, c.prices || c.free].filter(Boolean).length;
  }
  return n;
}

/** Ce que la source laisse vide et qu'un visiteur peut donc compléter. */
export function missingFields(pool: Pool): ContribField[] {
  return [
    ...(!pool.env ? ["env" as const] : []),
    ...(!pool.lens?.length ? ["lens" as const] : []),
    ...(!pool.hours ? ["hours" as const] : []),
    ...(!pool.charge && !pool.prices && pool.fee !== false ? ["price" as const] : []),
  ];
}

/** Les compléments ne remplacent jamais une donnée de la source. */
export function applyContrib(pool: Pool, c: Contribution | undefined): Pool {
  if (!c) return pool;
  if (c.closures?.length) pool = { ...pool, closures: c.closures };
  const missing = missingFields(pool);
  const out: Pool = { ...pool };
  const contributed: ContribField[] = [];
  if (missing.includes("env") && c.env) {
    out.env = c.env;
    if (c.natural && !out.basins.includes("naturel")) out.basins = [...out.basins, "naturel"];
    contributed.push("env");
  }
  if (missing.includes("lens") && c.lens?.length) {
    out.lens = c.lens;
    contributed.push("lens");
  }
  const corrects = (f: "hours" | "price" | "phone" | "website") => c.corrected?.includes(f) ?? false;
  let touched = false;
  if (corrects("phone") && c.phone) {
    out.phone = c.phone;
    touched = true;
  }
  if (corrects("website") && c.website) {
    out.website = c.website;
    touched = true;
  }
  if ((missing.includes("hours") || corrects("hours")) && c.hours) {
    out.hours = c.hours;
    out.hoursFrom = "user";
    contributed.push("hours");
  }
  // « Payant » connu de la source : seul un montant complète, pas « gratuit ».
  const setPrices = (prices: Prices | undefined) => {
    delete out.charge;
    if (prices) {
      out.prices = prices;
      out.fee = true;
      if (prices.adult) out.charge = formatPrice(prices.adult, pool.country);
    } else {
      delete out.prices;
      out.fee = false;
    }
  };
  if (corrects("price") && (c.prices || c.free)) {
    setPrices(c.prices);
    contributed.push("price");
  } else if (missing.includes("price") && (c.prices || (c.free && pool.fee === undefined))) {
    setPrices(c.prices);
    contributed.push("price");
  }
  return contributed.length ? { ...out, contributed } : touched ? out : pool;
}
