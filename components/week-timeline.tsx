"use client";

import { useState } from "react";
import type { Pool } from "@/lib/types";
import type { LivePoolStatus } from "@/lib/toulouse-live";
import { matchesHoursOn, parsedHours, rangesForDay, weekdayOf, type Range } from "@/lib/pool-state";
import type { HoursFilter } from "@/lib/filters";
import { useDict, useLocale } from "@/components/locale-provider";
import { TimelineChart, type TimelineEntry } from "./timeline-chart";

/** Au-delà, la frise devient illisible : on invite à réduire le rayon. */
const MAX_ROWS = 30;

export function WeekTimeline({
  pools,
  live,
  isFavorite,
  hours = "all",
}: {
  /** Piscines affichées, déjà triées (favorites en tête, puis distance). */
  pools: Pool[];
  live: Map<string, LivePoolStatus> | null;
  isFavorite: (id: string) => boolean;
  hours?: HoursFilter;
}) {
  const dict = useDict();
  const locale = useLocale();
  const now = new Date();
  const todayWeekday = weekdayOf(now);
  const [selected, setSelected] = useState(todayWeekday);
  // Onglet resté ouvert pendant minuit : la sélection de la veille ne survit pas.
  const [lastToday, setLastToday] = useState(todayWeekday);
  if (lastToday !== todayWeekday) {
    setLastToday(todayWeekday);
    setSelected(todayWeekday);
  }
  const isToday = selected === todayWeekday;

  // Sept jours à partir d'aujourd'hui : « lundi » se lit comme LE PROCHAIN lundi.
  const days = Array.from({ length: 7 }, (_, i) => (todayWeekday + i) % 7);

  const known = pools.filter((p) => parsedHours(p, locale) !== null || (live?.get(p.id) && isToday));
  // Filtre horaires jugé sur le jour affiché.
  const dayPools =
    hours === "all"
      ? known
      : known.filter((p) => matchesHoursOn(p, live?.get(p.id), selected, isToday, now, hours, locale));
  const unknownCount = pools.length - known.length;
  const shown = dayPools.slice(0, MAX_ROWS);
  const hiddenCount = dayPools.length - shown.length;
  const hasHolidayWeek = shown.some((p) => parsedHours(p, locale)?.holidayWeek);

  // « Piscine Municipale » revient de commune en commune : les homonymes
  // affichés portent la leur, sinon la frise ne se lit plus.
  const seen = new Set<string>();
  const dupes = new Set(shown.filter((p) => (seen.has(p.name) ? true : (seen.add(p.name), false))).map((p) => p.name));

  const entries: TimelineEntry[] = shown.map((p) => {
    const { ranges, state } = rangesForDay(p, live?.get(p.id), selected, isToday, now, locale);
    return {
      id: p.id,
      name: dupes.has(p.name) ? `${p.name} (${p.city})` : p.name,
      href: `#pool-${p.id}`,
      ranges,
      note: state === "seasonal" ? dict.timelineSeasonal : dict.timelineClosed,
      favorite: isFavorite(p.id),
    };
  });

  // Axe horaire calibré sur toute la semaine : il ne saute pas quand on change de jour.
  const rangeSlots: Range[] = shown.flatMap((p) => parsedHours(p, locale)?.week.flat() ?? []);

  const dateLabel = new Intl.DateTimeFormat(dict.intlLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(now.getTime() + days.indexOf(selected) * 86_400_000));

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {days.map((d) => {
          const isSel = selected === d;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelected(d)}
              aria-pressed={isSel}
              className={`rounded-full px-0 py-1 text-center text-xs transition-colors ${
                isSel
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 font-semibold text-white shadow-sm dark:from-pink-600 dark:to-fuchsia-700"
                  : "bg-fuchsia-50 font-medium text-fuchsia-900 hover:bg-fuchsia-100 dark:bg-fuchsia-400/10 dark:text-fuchsia-100 dark:hover:bg-fuchsia-400/20"
              }`}
            >
              {dict.dayShort[d]}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="capitalize">{dateLabel}</span>
        {isToday && ` ${dict.todaySuffix}`}
      </p>

      <TimelineChart entries={entries} showNow={isToday} rangeSlots={rangeSlots} />

      <div className="mt-2 space-y-0.5 text-[11px] text-slate-400 dark:text-slate-400">
        {hasHolidayWeek && <p>{dict.timelineHolidayNote}</p>}
        {hiddenCount > 0 && <p>{dict.timelineMore(hiddenCount)}</p>}
        {unknownCount > 0 && <p>{dict.timelineUnknown(unknownCount)}</p>}
      </div>
    </div>
  );
}
