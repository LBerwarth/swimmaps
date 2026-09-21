import type { Locale } from "./i18n";

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
