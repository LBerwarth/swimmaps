"use client";

import Link from "next/link";
import type { Pool } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { formatDistance } from "@/lib/geo";
import {
  formatClosedPeriodFR,
  formatTime,
  formatWeekFR,
  isInClosedPeriod,
  prettifyOpeningHours,
  seasonLines,
  type WeekSchedule,
} from "@/lib/opening-hours";
import { formatSlotTime, toulouseUrl, type LivePoolStatus } from "@/lib/toulouse-live";
import { parsedHours, poolDayState, type DayState } from "@/lib/pool-state";
import { poolPagePath } from "@/lib/slug";
import { CONTRIB_ANCHOR, envKey, missingFields, nextClosure, pricesText } from "@/lib/contrib";
import { FEEDBACK_ANCHOR } from "@/lib/feedback";
import { toggleFavorite, useFavorites } from "@/components/use-favorites";
import { useDict, useLocale } from "@/components/locale-provider";
import { useNow } from "@/components/use-now";
import {
  DirectionsIcon,
  DoubleChevronIcon,
  ExternalLinkIcon,
  PencilIcon,
  PhoneIcon,
  SearchIcon,
  StarIcon,
} from "@/components/icons";

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

/** « 2026-12-31 » → « 31 décembre 2026 » dans la langue de l'interface. */
function longDate(iso: string, intlLocale: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" });
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
    case "temporary":
      return <Pill tone="seasonal">{dict.closedUntil(longDate(state.until, dict.intlLocale))}</Pill>;
    default:
      return null;
  }
}

const SEARCH_WORD: Record<Locale, string> = {
  fr: "piscine",
  en: "swimming pool",
  de: "Schwimmbad",
  es: "piscina",
  it: "piscina",
  nl: "zwembad",
  pt: "piscina",
};

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

  const upcoming = now ? nextClosure(pool, now) : undefined;
  const tarif = pool.prices
    ? pricesText(pool.prices, pool.country, dict.priceKinds)
    : pool.charge
      ? pool.charge
      : pool.fee === true
      ? dict.paidEntry
      : pool.fee === false
        ? dict.freeEntry
        : null;

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${pool.lat},${pool.lon}`;
  const website = pool.website ?? live?.url;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${SEARCH_WORD[locale]} ${pool.name} ${pool.city}`,
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
              className={`-ml-0.5 shrink-0 text-base leading-snug transition-colors ${
                isFavorite
                  ? "text-amber-400"
                  : "text-slate-300 hover:text-amber-300 dark:text-slate-500 dark:hover:text-amber-300"
              }`}
            >
              <StarIcon filled={isFavorite} />
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
                  <DoubleChevronIcon className="block h-3.5 w-3.5" />
                </Link>
              )}
              {showDetails && (
                <Link
                  href={`${detailHref}#${missingFields(pool).length ? CONTRIB_ANCHOR : FEEDBACK_ANCHOR}`}
                  aria-label={dict.contribEdit(pool.name)}
                  title={dict.contribEdit(pool.name)}
                  className="ml-1 inline-block h-6 w-6 overflow-hidden rounded-lg bg-violet-500 p-[5px] align-[-0.35rem] text-white shadow-sm transition-colors hover:bg-violet-600 dark:bg-violet-700 dark:hover:bg-violet-600"
                >
                  <PencilIcon className="block h-3.5 w-3.5" />
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
                {locale === "en" ? String(len) : String(len).replace(".", ",")} m
              </span>
            ))}
            {pool.env && (
              <span className="rounded-full bg-fuchsia-50 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 ring-1 ring-fuchsia-200 dark:bg-fuchsia-400/15 dark:text-fuchsia-100 dark:ring-white/15">
                {dict.envLabels[envKey(pool)!]}
              </span>
            )}
            {(pool.contributed || pool.addedBy) && (
              <span className="px-1 py-0.5 text-[11px] italic text-slate-400 dark:text-slate-400">
                {pool.addedBy ? dict.addedBadge : dict.contribBadge}
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
              {formatDistance(pool.distanceKm, locale, pool.country)}
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
              <DirectionsIcon className="h-4 w-4" />
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                aria-label={dict.phoneAria(pool.name, pool.phone!)}
                title={dict.phoneTitle(pool.phone!)}
                className={`${ICON_BTN} bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400`}
              >
                <PhoneIcon className="h-4 w-4" />
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
                <ExternalLinkIcon className="h-4 w-4" />
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
                <SearchIcon className="h-4 w-4" />
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
        {upcoming && (
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
            {dict.closureNotice(longDate(upcoming.from, dict.intlLocale), longDate(upcoming.to, dict.intlLocale))}
          </p>
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
              {pool.hoursFrom && (
                <p className="mt-1 text-[10px] text-slate-400">
                  {pool.hoursFrom === "web" ? dict.centreHoursNote : dict.contribHoursNote}
                </p>
              )}
              {(parsed.extras.length > 0 || parsed.closedPeriods.length > 0 || parsed.seasons.length > 0) && (
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
                    {[...seasonLines(parsed, locale), ...parsed.extras].map((line) => (
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
