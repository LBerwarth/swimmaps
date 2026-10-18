import { KM_PER_MILE } from "./geo";

export type EnvFilter = "all" | "int" | "ext";
/** Classe de longueur de bassin : 25 = 25 à <50 m, 50 = 50 m et plus. */
export type LenFilter = "all" | 25 | 50;
/**
 * Crans emboîtés du plus large au plus étroit. « week » écarte les fermetures
 * longues connues (piscine saisonnière hors saison, semaine vide).
 */
export type OpenFilter = "all" | "week" | "today" | "now";

export const RADIUS_OPTIONS_KM = [1, 2, 5, 10, 20, 50];
export const RADIUS_OPTIONS_MI = [1, 2, 3, 5, 10, 20, 30];

/** Rayon en km d'une pastille en miles. */
export const milesToKm = (mi: number) => mi * KM_PER_MILE;

/** Rayon proposé par l'une ou l'autre grille (km ou miles convertis). */
export function isRadiusOption(km: number): boolean {
  return (
    RADIUS_OPTIONS_KM.includes(km) || RADIUS_OPTIONS_MI.some((mi) => Math.abs(milesToKm(mi) - km) < 0.01)
  );
}

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
    radiusKm: isRadiusOption(radius) ? radius : null,
  };
}

/** Recliquer la pastille active la relâche : retour à « Toutes ». */
export function retoggle<T extends string | number>(current: T, value: T): T | "all" {
  return value !== "all" && current === value ? "all" : value;
}
