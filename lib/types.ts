/** Environnement d'une piscine, déduit de la nature de ses bassins (Data ES). */
export type PoolEnv = "int" | "ext" | "mix";

/** Catégories de tarifs saisies par les visiteurs. */
export type PriceKind = "adult" | "child" | "senior" | "disabled" | "student" | "family" | "ten" | "season";
export type Prices = Partial<Record<PriceKind, number>>;

/** Fermeture temporaire (travaux…), dates « AAAA-MM-JJ » incluses. */
export interface Closure {
  from: string;
  to: string;
}

/**
 * Une piscine (= « installation » Data ES regroupant un ou plusieurs bassins),
 * éventuellement enrichie de données OpenStreetMap (horaires, tarif, site web).
 * Le champ `country` prépare une future extension au-delà de la France.
 */
export interface Pool {
  /** Numéro d'installation Data ES (ex. I011730003). */
  id: string;
  name: string;
  city: string;
  /** Code postal. */
  cp: string;
  address?: string;
  /** Code département français (ex. "31", "2A") — absent hors de France. */
  dep?: string;
  /** Code pays ISO 3166-1 alpha-2 (FR, GB…). */
  country: string;
  lat: number;
  lon: number;
  env?: PoolEnv;
  /** Longueurs distinctes des bassins en mètres, décroissantes (Data ES). */
  lens?: number[];
  /** Types de bassins : sportif, ludique, mixte, toboggan, plongeon, plongée. */
  basins: string[];
  /** Horaires au format OSM `opening_hours` (présent pour ~12 % des piscines). */
  hours?: string;
  /** « web » = horaires du centre lus sur le site officiel (schema.org) ; « user » = saisis par un visiteur. */
  hoursFrom?: "web" | "user";
  /** Entrée payante (tag OSM `fee`). */
  fee?: boolean;
  /** Tarif en texte libre (tag OSM `charge`), rare. */
  charge?: string;
  /** Tarifs par catégorie (visiteurs), dans la monnaie du pays. */
  prices?: Prices;
  website?: string;
  phone?: string;
  /** Fermetures temporaires signalées par des visiteurs et validées. */
  closures?: Closure[];
  /** Piscine proposée par un visiteur et validée par l'auteure. */
  addedBy?: "user";
  /** Champs complétés par des visiteurs (fusionnés au chargement, jamais dans les fichiers). */
  contributed?: Array<"env" | "lens" | "hours" | "price">;
}

export interface PoolDataset {
  /** Date de génération du fichier (ISO). */
  updated: string;
  count: number;
  pools: Pool[];
}

/** Entrée de `public/data/index.json` : un fichier de données par pays. */
export interface CountryEntry {
  /** Code pays minuscule (fr, gb…), aussi suffixe du fichier de données. */
  code: string;
  count: number;
  /** Emprise [minLat, minLon, maxLat, maxLon]. */
  bbox: [number, number, number, number];
  updated: string;
}

export interface CountryIndex {
  updated: string;
  countries: CountryEntry[];
}

/** Piscine annotée de sa distance à vol d'oiseau à la position de l'utilisateur. */
export interface PoolWithDistance extends Pool {
  distanceKm: number;
}
