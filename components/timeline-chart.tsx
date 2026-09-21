"use client";

import { useSyncExternalStore } from "react";
import { formatTime } from "@/lib/opening-hours";
import { minutesOf, type Range } from "@/lib/pool-state";
import { useDict, useLocale } from "@/components/locale-provider";

export interface TimelineEntry {
  id: string;
  name: string;
  /** Ancre de la fiche dans la liste (#pool-…). */
  href: string;
  /** Créneaux du jour en minutes ; vide = fermée ce jour-là. */
  ranges: Range[];
  /** Motif affiché dans la barre quand il n'y a aucun créneau. */
  note: string;
  favorite: boolean;
}

const nowMinutes = (): number => minutesOf(new Date());
const noTime = (): number | null => null;
const noSubscribe = (): (() => void) => () => {};

/** Réévalue l'heure chaque minute pour faire avancer la ligne « maintenant ». */
function subscribeToMinute(onChange: () => void): () => void {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

function FavStar() {
  return (
    <span className="text-amber-400" aria-hidden>
      ★{" "}
    </span>
  );
}

export function TimelineChart({
  entries,
  showNow = false,
  rangeSlots,
}: {
  entries: TimelineEntry[];
  /** Afficher la ligne « maintenant » et la couleur « ouverte maintenant ». */
  showNow?: boolean;
  /** Créneaux calibrant l'axe horaire (stable d'un jour à l'autre). */
  rangeSlots?: Range[];
}) {
  const dict = useDict();
  const locale = useLocale();
  // null au rendu serveur et à l'hydratation, puis l'heure réelle côté client.
  const nowMin = useSyncExternalStore<number | null>(
    showNow ? subscribeToMinute : noSubscribe,
    showNow ? nowMinutes : noTime,
    noTime,
  );

  const shownSlots = entries.flatMap((e) => e.ranges);
  const axisSlots = rangeSlots && rangeSlots.length > 0 ? rangeSlots : shownSlots;

  let earliest = Infinity;
  let latest = -Infinity;
  for (const [s, e] of axisSlots) {
    earliest = Math.min(earliest, s);
    latest = Math.max(latest, e);
  }
  const rangeStart = Number.isFinite(earliest) ? Math.floor(earliest / 60) * 60 : 8 * 60;
  const rangeEnd = Number.isFinite(latest) ? Math.min(Math.ceil(latest / 60) * 60, 24 * 60) : 20 * 60;
  const span = Math.max(rangeEnd - rangeStart, 60);
  const pct = (min: number) => ((min - rangeStart) / span) * 100;

  const tickStep = span > 10 * 60 ? 120 : 60;
  const ticks: number[] = [];
  for (let t = rangeStart; t <= rangeEnd; t += tickStep) ticks.push(t);

  const showNowLine = showNow && nowMin !== null && nowMin >= rangeStart && nowMin <= rangeEnd;

  const Track = ({ children }: { children: React.ReactNode }) => (
    <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-fuchsia-50 dark:bg-fuchsia-400/10">
      {ticks.map((t) => (
        <span
          key={t}
          className="absolute inset-y-0 w-px bg-fuchsia-100 dark:bg-fuchsia-300/20"
          style={{ left: `${pct(t)}%` }}
        />
      ))}
      {children}
      {showNowLine && (
        <span
          className="absolute inset-y-0 w-0.5 rounded-full bg-violet-950 dark:bg-violet-200"
          style={{ left: `${pct(nowMin!)}%` }}
        />
      )}
    </div>
  );

  const colStyle: React.CSSProperties = { gridTemplateColumns: "8rem 1fr" };

  return (
    <div className="mt-3 space-y-1.5">
      <div className="grid items-center gap-2" style={colStyle}>
        <div />
        <div className="relative h-4">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute -translate-x-1/2 text-[10px] font-medium tabular-nums text-violet-700/60 dark:text-violet-200/70"
              style={{ left: `${pct(t)}%` }}
            >
              {formatTime(t, locale)}
            </span>
          ))}
        </div>
      </div>

      {entries.map((row) => {
        const nameEl = (
          <p className="break-words text-xs font-medium leading-tight text-slate-700 dark:text-slate-200">
            {row.favorite && <FavStar />}
            <a
              href={row.href}
              title={dict.timelineGoto(row.name)}
              className="underline-offset-2 hover:text-fuchsia-700 hover:underline dark:hover:text-fuchsia-300"
            >
              {row.name}
            </a>
          </p>
        );
        const wrapClass = "grid min-h-7 items-center gap-2";

        if (row.ranges.length === 0) {
          return (
            <div key={row.id} className={wrapClass} style={colStyle}>
              {nameEl}
              <Track>
                <span
                  className="absolute inset-y-0 left-1.5 right-2 flex items-center text-[10px] italic text-slate-400 dark:text-slate-300"
                  title={row.note}
                >
                  <span className="truncate">{row.note}</span>
                </span>
              </Track>
            </div>
          );
        }

        return (
          <div key={row.id} className={wrapClass} style={colStyle}>
            {nameEl}
            <Track>
              {row.ranges.map(([s, e]) => {
                const openNow = showNow && nowMin !== null && nowMin >= s && nowMin < e;
                return (
                  <span
                    key={`${s}-${e}`}
                    className={`absolute inset-y-0.5 rounded ${
                      openNow
                        ? "bg-gradient-to-r from-violet-500 to-purple-600"
                        : "bg-gradient-to-r from-pink-400 to-fuchsia-500"
                    }`}
                    style={{ left: `${pct(s)}%`, width: `${pct(e) - pct(s)}%` }}
                    title={`${row.name} : ${formatTime(s, locale)}–${formatTime(e, locale)}`}
                  />
                );
              })}
            </Track>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400 dark:text-slate-300">
        {showNow && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />{" "}
            {dict.legendOpenNow}
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500" />{" "}
          {dict.legendSlot}
        </span>
        {showNow && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-0.5 bg-violet-950 dark:bg-violet-200" /> {dict.legendNow}
          </span>
        )}
      </div>
    </div>
  );
}
