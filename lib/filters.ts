export type EnvFilter = "all" | "int" | "ext";
/** Classe de longueur de bassin : 25 = 25 à <50 m, 50 = 50 m et plus. */
export type LenFilter = "all" | 25 | 50;
/**
 * Crans emboîtés du plus large au plus étroit. « week » écarte les fermetures
 * longues connues (piscine saisonnière hors saison, semaine vide).
 */
export type OpenFilter = "all" | "week" | "today" | "now";

export const RADIUS_OPTIONS_KM = [1, 2, 5, 10, 20, 50];

export interface FilterPreset {
  env: EnvFilter;
  len: LenFilter;
  open: OpenFilter;
  fav: boolean;
  radiusKm: number | null;
}

export const DEFAULT_PRESET: FilterPreset = {
  env: "all",
  len: "all",
  open: "all",
  fav: false,
  radiusKm: null,
};

/**
 * Préréglage lu dans l'URL (raccourcis du lanceur, liens partagés) :
 * ?open=now|today|week&type=indoor|outdoor&length=25|50&fav=1&radius=5
 */
export function readFilterPreset(params: URLSearchParams): FilterPreset {
  const open = params.get("open");
  const type = params.get("type");
  const length = params.get("length");
  const radius = Number(params.get("radius"));
  return {
    env: type === "indoor" ? "int" : type === "outdoor" ? "ext" : "all",
    len: length === "25" ? 25 : length === "50" ? 50 : "all",
    open: open === "now" || open === "today" || open === "week" ? open : "all",
    fav: params.get("fav") === "1",
    radiusKm: RADIUS_OPTIONS_KM.includes(radius) ? radius : null,
  };
}

/** Recliquer la pastille active la relâche : retour à « Toutes ». */
export function retoggle<T extends string | number>(current: T, value: T): T | "all" {
  return value !== "all" && current === value ? "all" : value;
}
