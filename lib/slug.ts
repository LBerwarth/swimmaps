import type { Locale } from "./i18n";
import type { Pool } from "./types";

const COUNTRY_LOCALES: Record<string, Locale[]> = {
  FR: ["fr"],
  DE: ["de"],
  AT: ["de"],
  CH: ["de", "fr", "it"],
  BE: ["fr", "nl"],
  ES: ["es"],
  IT: ["it"],
  NL: ["nl"],
  PT: ["pt"],
};

/** Langues indexées d'une fiche : celle(s) du pays, plus l'anglais. */
export function pageLocales(pool: Pick<Pool, "country">): Locale[] {
  const own = COUNTRY_LOCALES[pool.country] ?? [];
  return own.includes("en") ? own : [...own, "en"];
}

// Sans horaires, la fiche n'apporte rien de plus qu'une carte : pas d'indexation.
export function isIndexable(pool: Pick<Pool, "hours" | "country">, locale?: Locale): boolean {
  return Boolean(pool.hours) && (locale === undefined || pageLocales(pool).includes(locale));
}

/** « Centre Nautique Laure Manaudou » → « centre-nautique-laure-manaudou ». */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Identifiant d'URL d'une fiche : nom lisible + id (unique, stable). */
export function poolSlug(pool: { id: string; name: string }): string {
  const name = slugify(pool.name);
  return `${name || "piscine"}-${pool.id.toLowerCase()}`;
}

export function poolPagePath(locale: Locale, pool: { id: string; name: string }): string {
  return `/${locale}/piscine/${poolSlug(pool)}`;
}
