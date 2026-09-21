import type { Locale } from "./i18n";
import {
  isInClosedPeriod,
  parseOpeningHours,
  type ParsedOpeningHours,
  type WeekSchedule,
} from "./opening-hours";
import type { LivePoolStatus } from "./toulouse-live";
import type { Pool } from "./types";

/** État du jour d'une piscine à l'instant courant. Partagé par la liste, la carte et la frise. */
export type DayState =
  | { kind: "open"; until: number }
  | { kind: "later"; at: number }
  | { kind: "done" }
  | { kind: "closed" }
  | { kind: "seasonal" }
  | { kind: "unknown" };

export type Range = [number, number];

/** Minutes écoulées depuis minuit, heure locale de l'appareil. */
export function minutesOf(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}

/** 0 = lundi … 6 = dimanche (Date.getDay() : 0 = dimanche). */
export function weekdayOf(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function slotsState(ranges: Range[], minutes: number): DayState {
  if (ranges.length === 0) return { kind: "closed" };
  for (const [s, e] of ranges) {
    if (minutes >= s && minutes < e) return { kind: "open", until: e };
  }
  const next = ranges.find(([s]) => minutes < s);
  if (next) return { kind: "later", at: next[0] };
  return { kind: "done" };
}

export function scheduleState(week: WeekSchedule, now: Date): DayState {
  return slotsState(week[weekdayOf(now)], minutesOf(now));
}

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** Créneaux live (« HH:MM ») → minutes. */
export function liveRanges(status: LivePoolStatus): Range[] {
  return status.slots.map((s) => [toMinutes(s.start), toMinutes(s.end)]);
}

const cache = new Map<string, ParsedOpeningHours | null>();

/** parseOpeningHours mémoïsé : la même chaîne est relue par la carte, la liste et les filtres. */
export function parsedHours(pool: Pick<Pool, "hours">, locale: Locale = "fr"): ParsedOpeningHours | null {
  if (!pool.hours) return null;
  const key = `${locale}:${pool.hours}`;
  let parsed = cache.get(key);
  if (parsed === undefined) {
    parsed = parseOpeningHours(pool.hours, locale);
    cache.set(key, parsed);
  }
  return parsed;
}

/**
 * La semaine type suffit-elle à trancher ? Avec des horaires de vacances
 * scolaires ou des périodes datées, on ne sait pas quel planning s'applique.
 */
export function isCertain(parsed: ParsedOpeningHours): boolean {
  return !parsed.holidayWeek && parsed.extras.length === 0;
}

/**
 * État du jour : le statut live (Toulouse) prime ; sinon la semaine type OSM,
 * seulement quand elle est certaine. Fermeture saisonnière avant tout.
 */
export function poolDayState(
  pool: Pool,
  live: LivePoolStatus | null | undefined,
  now: Date,
  locale: Locale = "fr",
): DayState {
  if (live) {
    if (!live.openToday) return { kind: "closed" };
    return slotsState(liveRanges(live), minutesOf(now));
  }
  const parsed = parsedHours(pool, locale);
  if (!parsed) return { kind: "unknown" };
  if (isInClosedPeriod(parsed.closedPeriods, now)) return { kind: "seasonal" };
  if (!isCertain(parsed)) return { kind: "unknown" };
  return scheduleState(parsed.week, now);
}

/** Créneaux du jour `weekday` (0 = lundi), tous plannings confondus, ou null si inconnus. */
export function rangesForDay(
  pool: Pool,
  live: LivePoolStatus | null | undefined,
  weekday: number,
  isToday: boolean,
  now: Date,
  locale: Locale = "fr",
): { ranges: Range[]; state: "known" | "seasonal" | "unknown" } {
  if (live && isToday) {
    return { ranges: live.openToday ? liveRanges(live) : [], state: "known" };
  }
  const parsed = parsedHours(pool, locale);
  if (!parsed) return { ranges: [], state: "unknown" };
  if (isInClosedPeriod(parsed.closedPeriods, now)) return { ranges: [], state: "seasonal" };
  return { ranges: parsed.week[weekday], state: "known" };
}
