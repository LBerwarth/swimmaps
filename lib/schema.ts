import type { WeekSchedule } from "./opening-hours";

const SCHEMA_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

const hhmm = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Semaine type → OpeningHoursSpecification schema.org (une entrée par créneau). */
export function openingHoursSpec(week: WeekSchedule) {
  return week.flatMap((ranges, day) =>
    ranges.map(([s, e]) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[day]}`,
      opens: hhmm(s),
      closes: hhmm(e === 24 * 60 ? 24 * 60 - 1 : e),
    })),
  );
}
