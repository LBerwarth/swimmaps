import {
  ENV_CHOICES,
  LEN_MAX,
  LEN_MIN,
  parsePhone,
  parsePrices,
  parseSeason,
  parseWeek,
  parseWebsite,
  type EnvChoice,
  type SeasonInput,
  type WeekInput,
} from "./contrib";
import type { Prices } from "./types";

export const NAME_MAX = 100;
export const NOTE_MAX = 500;

export interface NewPoolInput {
  name: string;
  lat: number;
  lon: number;
  env: EnvChoice;
  len?: number;
  website?: string;
  phone?: string;
  week?: WeekInput;
  holiday?: WeekInput;
  season?: SeasonInput;
  prices?: Prices;
  free?: true;
  note?: string;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

export function parseNewPool(body: unknown): NewPoolInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const name = clean(b.name, NAME_MAX);
  if (name.length < 3) return null;
  const { lat, lon } = b;
  if (typeof lat !== "number" || typeof lon !== "number" || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  if (!(ENV_CHOICES as unknown[]).includes(b.env)) return null;
  const env = b.env as EnvChoice;
  const len =
    typeof b.len === "number" && b.len >= LEN_MIN && b.len <= LEN_MAX ? Math.round(b.len * 10) / 10 : undefined;
  const website = b.website ? parseWebsite(b.website) : undefined;
  if (b.website && !website) return null;
  const phone = b.phone ? parsePhone(b.phone) : undefined;
  if (b.phone && !phone) return null;
  const week = parseWeek(b.week);
  const holiday = week ? parseWeek(b.holiday) : undefined;
  const season = week ? parseSeason(b.season) : undefined;
  const prices = parsePrices(b.prices);
  const free = b.free === true && prices === undefined ? true : undefined;
  const note = clean(b.note, NOTE_MAX);
  return {
    name,
    lat: Math.round(lat * 1e5) / 1e5,
    lon: Math.round(lon * 1e5) / 1e5,
    env,
    ...(len && { len }),
    ...(website && { website }),
    ...(phone && { phone }),
    ...(week && { week }),
    ...(holiday && { holiday }),
    ...(season && { season }),
    ...(prices && { prices }),
    ...(free && { free }),
    ...(note && { note }),
  };
}
