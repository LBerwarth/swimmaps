/** Minuscules sans accents ni apostrophe, « St » déplié : « L’Union » ↔ « lunion ». */
export function foldText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u2019']/g, "")
    .toLowerCase()
    .replace(/\bst\b/g, "saint")
    .replace(/\bste\b/g, "sainte")
    .replace(/ß/g, "ss");
}

/** Mots vides de la requête : « piscine de la Ramée » cherche « ramee ». */
const NOISE = new Set([
  "piscine", "piscines", "pool", "swimming", "bad", "schwimmbad", "hallenbad", "freibad",
  "de", "du", "des", "la", "le", "les", "l", "d", "a", "au", "aux", "et", "en",
  "the", "of", "and", "in", "at", "der", "die", "das", "und", "im", "am",
]);

/** Chaque mot utile tapé se retrouve dans le nom, la commune ou le code postal. */
export function matchesQuery(
  pool: { name: string; city: string; cp?: string },
  query: string,
): boolean {
  const hay = foldText([pool.name, pool.city, pool.cp ?? ""].join(" "));
  return foldText(query)
    .split(/\s+/)
    .filter((word) => word && !NOISE.has(word))
    .every((word) => hay.includes(word));
}
