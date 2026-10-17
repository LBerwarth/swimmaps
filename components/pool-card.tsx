"use client";

import Link from "next/link";
import type { Pool } from "@/lib/types";
import { formatDistance } from "@/lib/geo";
import {
  formatClosedPeriodFR,
  formatTime,
  formatWeekFR,
  isInClosedPeriod,
  prettifyOpeningHours,
  type WeekSchedule,
} from "@/lib/opening-hours";
import { formatSlotTime, toulouseUrl, type LivePoolStatus } from "@/lib/toulouse-live";
import { parsedHours, poolDayState, type DayState } from "@/lib/pool-state";
import { poolPagePath } from "@/lib/slug";
import { toggleFavorite, useFavorites } from "@/components/use-favorites";
import { useDict, useLocale } from "@/components/locale-provider";
import { useNow } from "@/components/use-now";

function WeekLines({ week }: { week: WeekSchedule }) {
  const locale = useLocale();
  return (
    <ul className="mt-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
      {formatWeekFR(week, locale).map((line) => (
        <li key={line.days} className="flex gap-2">
          <span className="w-16 shrink-0 font-medium">{line.days}</span>
          <span>{line.hours}</span>
        </li>
      ))}
    </ul>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "open" | "later" | "done" | "closed" | "seasonal";
  children: React.ReactNode;
}) {
  const styles = {
    open: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200 [&>i]:bg-violet-600 dark:[&>i]:bg-violet-300",
    later: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200 [&>i]:bg-amber-500 dark:[&>i]:bg-amber-300",
    done: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300 [&>i]:bg-slate-400",
    closed: "bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200 [&>i]:bg-red-500 dark:[&>i]:bg-red-300",
    seasonal: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200 [&>i]:bg-rose-500 dark:[&>i]:bg-rose-300",
  }[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      <i className="h-1.5 w-1.5 rounded-full" />
      {children}
    </span>
  );
}

function Badge({ state }: { state: DayState }) {
  const dict = useDict();
  const locale = useLocale();
  switch (state.kind) {
    case "open":
      return <Pill tone="open">{dict.badgeOpenUntil(formatTime(state.until, locale))}</Pill>;
    case "later":
      return <Pill tone="later">{dict.badgeOpensAt(formatTime(state.at, locale))}</Pill>;
    case "done":
      return <Pill tone="done">{dict.badgeDone}</Pill>;
    case "closed":
      return <Pill tone="closed">{dict.badgeClosedToday}</Pill>;
    case "seasonal":
      return <Pill tone="seasonal">{dict.seasonalClosed}</Pill>;
    default:
      return null;
  }
}

const ICON_BTN =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-sm transition-colors";

export function PoolCard({
  pool,
  live = null,
  selected = false,
  showDetails = true,
}: {
  pool: Pool & { distanceKm?: number };
  live?: LivePoolStatus | null;
  selected?: boolean;
  /** Lien vers la fiche dédiée — inutile sur la fiche elle-même. */
  showDetails?: boolean;
}) {
  const dict = useDict();
  const locale = useLocale();
  const favorites = useFavorites();
  const now = useNow();
  const isFavorite = favorites.includes(pool.id);
  const toulouse = toulouseUrl(pool.id);
  const parsed = parsedHours(pool, locale);
  const seasonalClosed = parsed
    ? isInClosedPeriod(parsed.closedPeriods, now ?? new Date())
    : false;
  const state: DayState = now ? poolDayState(pool, live, now, locale) : { kind: "unknown" };

  const tarif = pool.charge
    ? pool.charge
    : pool.fee === true
      ? dict.paidEntry
      : pool.fee === false
        ? dict.freeEntry
        : null;

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${pool.lat},${pool.lon}`;
  const website = pool.website ?? live?.url;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${locale === "fr" ? "piscine" : locale === "de" ? "Schwimmbad" : "swimming pool"} ${pool.name} ${pool.city}`,
  )}`;
  const detailHref = poolPagePath(locale, pool);
  const phone = pool.phone?.replace(/\s/g, "");

  return (
    <article
      id={`pool-${pool.id}`}
      className={`scroll-mt-4 rounded-2xl bg-card p-4 shadow-md shadow-pink-100/50 transition dark:shadow-none dark:ring-1 ${
        selected ? "ring-2 ring-fuchsia-400 dark:ring-fuchsia-400" : "dark:ring-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-start gap-1.5">
            <button
              type="button"
              onClick={() => toggleFavorite(pool.id)}
              aria-pressed={isFavorite}
              aria-label={isFavorite ? dict.favRemove(pool.name) : dict.favAdd(pool.name)}
              className={`-ml-0.5 shrink-0 text-lg leading-none transition-colors ${
                isFavorite
                  ? "text-amber-400"
                  : "text-slate-300 hover:text-amber-300 dark:text-slate-500 dark:hover:text-amber-300"
              }`}
            >
              {isFavorite ? "★" : "☆"}
            </button>
            <h2 className="group/name min-w-0 text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
              {showDetails ? (
                <Link
                  href={detailHref}
                  title={dict.detailLinkTitle}
                  className="underline decoration-slate-200 decoration-1 underline-offset-4 transition-colors group-hover/name:text-sky-700 group-hover/name:decoration-sky-400 dark:decoration-slate-600 dark:group-hover/name:text-sky-300"
                >
                  {pool.name}
                </Link>
              ) : (
                pool.name
              )}
              {showDetails && (
                <Link
                  href={detailHref}
                  tabIndex={-1}
                  aria-hidden="true"
                  title={dict.detailLinkTitle}
                  className="ml-2 inline-block h-6 w-6 overflow-hidden rounded-lg bg-pink-500 p-[5px] align-[-0.35rem] text-white shadow-sm transition-colors hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-600"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="block h-3.5 w-3.5 fill-current">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
                  </svg>
                </Link>
              )}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {pool.address ? `${pool.address}, ` : ""}
            {pool.cp} {pool.city}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(pool.lens ?? []).map((len) => (
              <span
                key={len}
                className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800 dark:bg-violet-400/15 dark:text-violet-200"
              >
                {locale === "fr" || locale === "de" ? String(len).replace(".", ",") : String(len)} m
              </span>
            ))}
            {pool.env && (
              <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 ring-1 ring-fuchsia-200 dark:bg-fuchsia-400/15 dark:text-fuchsia-100 dark:ring-white/15">
                {dict.envLabels[pool.env]}
              </span>
            )}
            {pool.basins.map((b) => (
              <span
                key={b}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-white/10 dark:text-slate-300"
              >
                {dict.basinLabels[b] ?? dict.basinFallback(b)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {pool.distanceKm !== undefined && (
            <span
              className="rounded-full bg-fuchsia-100 px-2.5 py-1 text-xs font-semibold text-fuchsia-900 dark:bg-fuchsia-400/15 dark:text-fuchsia-100"
              title={dict.distanceTitle}
            >
              {formatDistance(pool.distanceKm, locale)}
            </span>
          )}
          <Badge state={state} />
          <div className="flex items-center gap-3">
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              aria-label={dict.directionsAria(pool.name)}
              title={dict.directionsTitle}
              className={`${ICON_BTN} bg-fuchsia-600 hover:bg-fuchsia-700 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-400`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
              </svg>
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                aria-label={dict.phoneAria(pool.name, pool.phone!)}
                title={dict.phoneTitle(pool.phone!)}
                className={`${ICON_BTN} bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
              </a>
            )}
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                aria-label={dict.websiteAria(pool.name)}
                title={dict.websiteTitle}
                className={`${ICON_BTN} bg-violet-800 hover:bg-violet-900 dark:bg-violet-700 dark:hover:bg-violet-600`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
              </a>
            ) : (
              <a
                href={searchUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={dict.searchWebsite}
                title={dict.searchWebsiteTitle}
                className={`${ICON_BTN} bg-slate-400 hover:bg-slate-500 dark:bg-slate-600 dark:hover:bg-slate-500`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm">
        {toulouse && (
          <a
            href={toulouse}
            target="_blank"
            rel="noopener"
            className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-violet-50 px-3 py-2 text-xs font-medium text-violet-900 ring-1 ring-violet-200 transition-colors hover:bg-violet-100 dark:bg-violet-400/10 dark:text-violet-100 dark:ring-white/15 dark:hover:bg-violet-400/20"
          >
            <span>{dict.toulouseRecommend}</span>
            <span aria-hidden="true">→</span>
          </a>
        )}
        {live && (
          <div className="mb-2">
            {live.openToday && live.slots.length > 0 && (
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-medium">{dict.todayLabel}</span>{" "}
                {live.slots.map((s) => `${formatSlotTime(s.start)}–${formatSlotTime(s.end)}`).join(", ")}
              </p>
            )}
            {!live.openToday && live.closureReason && (
              <p className="text-xs text-rose-800/90 dark:text-rose-200">{live.closureReason}</p>
            )}
            <p className="mt-1 text-[10px] text-slate-400">
              {dict.liveSource(
                new Intl.DateTimeFormat(locale, {
                  timeZone: "Europe/Paris",
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(live.updatedAt)),
              )}
            </p>
          </div>
        )}
        {!live &&
          (parsed ? (
            <div>
              {parsed.holidayWeek && (
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  {dict.schoolTerm}
                </p>
              )}
              <WeekLines week={parsed.week} />
              {parsed.holidayWeek && (
                <>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                    {dict.schoolHolidays}
                  </p>
                  <WeekLines week={parsed.holidayWeek} />
                </>
              )}
              {pool.hoursFrom === "web" && (
                <p className="mt-1 text-[10px] text-slate-400">{dict.centreHoursNote}</p>
              )}
              {(parsed.extras.length > 0 || parsed.closedPeriods.length > 0) && (
                <>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                    {dict.specialPeriods}
                  </p>
                  <ul className="mt-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                    {parsed.closedPeriods.map((period) => (
                      <li key={formatClosedPeriodFR(period, locale)}>
                        {formatClosedPeriodFR(period, locale)}
                        {seasonalClosed ? " ●" : ""}
                      </li>
                    ))}
                    {parsed.extras.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : pool.hours ? (
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <p className="font-medium">{dict.hoursLabel}</p>
              <ul className="mt-1 space-y-0.5">
                {prettifyOpeningHours(pool.hours, locale).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">{dict.noHours}</p>
          ))}
        {tarif && (
          <p className="mt-1.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-medium">{dict.priceLabel}</span> {tarif}
          </p>
        )}
      </div>
    </article>
  );
}
