"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CountryIndex, Pool, PoolDataset, PoolWithDistance } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { formatDistance, haversineKm, usesMiles } from "@/lib/geo";
import { isInClosedPeriod, isOpenAt, weekAt } from "@/lib/opening-hours";
import { fetchToulouseLive, isOpenNowLive, type LivePoolStatus } from "@/lib/toulouse-live";
import { parsedHours, poolDayState, weekdayOf, type DayState } from "@/lib/pool-state";
import { matchesQuery } from "@/lib/search";
import { applyContrib, closureAt, contributionCount } from "@/lib/contrib";
import {
  RADIUS_OPTIONS_KM,
  RADIUS_OPTIONS_MI,
  isRadiusOption,
  milesToKm,
  readFilterPreset,
  retoggle,
  type EnvFilter,
  type LenFilter,
  type OpenFilter,
} from "@/lib/filters";
import { FAV_TIP_KEY, clearFlag } from "@/lib/client-flags";
import { LocationSearch, type UserLocation } from "@/components/location-search";
import { PoolCard } from "@/components/pool-card";
import { useContributions, useUserPools } from "@/components/use-contributions";
import { Chip, ChipLabel } from "@/components/chip";
import { CollapsibleSection } from "@/components/collapsible-section";
import { WeekTimeline } from "@/components/week-timeline";
import { useFavorites } from "@/components/use-favorites";
import { useDict, useLocale } from "@/components/locale-provider";
import { useNow } from "@/components/use-now";

const PoolMap = dynamic(() => import("@/components/pool-map"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-400/10" />
  ),
});

const LIST_STEP = 40;
const STORAGE_KEY = "pf:search";
const ADDRESSES_KEY = "pf:addresses";
const MAX_SAVED_ADDRESSES = 8;

interface SavedSearch {
  location: UserLocation;
  radiusKm: number;
}

/** Marge autour de l'emprise d'un pays : couvre les zones frontalières. */
const BBOX_PADDING_DEG = 0.6;

function countriesFor(index: CountryIndex, loc: UserLocation): string[] {
  return index.countries
    .filter(
      ({ bbox: [minLat, minLon, maxLat, maxLon] }) =>
        loc.lat >= minLat - BBOX_PADDING_DEG &&
        loc.lat <= maxLat + BBOX_PADDING_DEG &&
        loc.lon >= minLon - BBOX_PADDING_DEG &&
        loc.lon <= maxLon + BBOX_PADDING_DEG,
    )
    .map((c) => c.code);
}

interface Filters {
  env: EnvFilter;
  len: LenFilter;
  open: OpenFilter;
  /** null = pas de filtre favoris ; sinon les ids à garder. */
  favorites: string[] | null;
}

/**
 * Ouverture d'après les plannings connus (semaine type ou vacances scolaires —
 * on ne sait pas toujours lequel s'applique). « Maintenant » exige des
 * horaires connus et ouverts ; « Aujourd'hui » et « Cette semaine » laissent
 * le bénéfice du doute aux piscines sans horaires et n'écartent que celles
 * dont on SAIT qu'elles sont fermées. Le statut live (Toulouse) prime sur OSM.
 */
function passesOpen(
  pool: Pool,
  open: OpenFilter,
  live: LivePoolStatus | undefined,
  now: Date,
  locale: Locale,
): boolean {
  if (open === "all") return true;
  if (live) {
    if (open === "now") return isOpenNowLive(live, now);
    if (open === "today") return live.openToday;
    return true;
  }
  if (closureAt(pool, now)) return false;
  const parsed = parsedHours(pool, locale);
  if (!parsed) return open !== "now";
  if (isInClosedPeriod(parsed.closedPeriods, now)) return false;
  const weeks = [weekAt(parsed, now), ...(parsed.holidayWeek ? [parsed.holidayWeek] : [])];
  if (open === "now") return weeks.some((week) => isOpenAt(week, now));
  if (open === "week") return weeks.some((week) => week.some((day) => day.length > 0));
  const day = weekdayOf(now);
  return weeks.some((week) => week[day].length > 0);
}

function applyFilters(
  pools: PoolWithDistance[],
  f: Filters,
  live: Map<string, LivePoolStatus> | null,
  now: Date,
  locale: Locale,
): PoolWithDistance[] {
  return pools
    .filter((pool) => f.favorites === null || f.favorites.includes(pool.id))
    .filter((pool) => (f.env === "all" ? true : pool.env === f.env || pool.env === "mix"))
    // Longueur inconnue = masquée par le filtre : on ne promet pas un bassin
    // de 25 m sans donnée. Un seul bassin correspondant suffit (25 = 25 à <50 m).
    .filter((pool) => {
      if (f.len === "all") return true;
      const lens = pool.lens ?? [];
      return f.len === 50 ? lens.some((l) => l >= 50) : lens.some((l) => l >= 25 && l < 50);
    })
    .filter((pool) => passesOpen(pool, f.open, live?.get(pool.id), now, locale));
}

// Paramètres d'URL (raccourcis du lanceur, liens partagés) : inconnus au rendu
// serveur, lus à l'hydratation sans décalage grâce à useSyncExternalStore.
const noSubscribe = (): (() => void) => () => {};
const getSearch = (): string => window.location.search;
const getServerSearch = (): string => "";

function readTipDismissed(): boolean {
  try {
    return localStorage.getItem(FAV_TIP_KEY) === "1";
  } catch {
    return true;
  }
}

function dismissTip(): void {
  clearFlag("favtip");
  try {
    localStorage.setItem(FAV_TIP_KEY, "1");
  } catch {}
}

export function FinderView() {
  const dict = useDict();
  const locale = useLocale();
  const nowTick = useNow();
  const now = useMemo(() => nowTick ?? new Date(), [nowTick]);
  const search = useSyncExternalStore(noSubscribe, getSearch, getServerSearch);
  const preset = useMemo(() => readFilterPreset(new URLSearchParams(search)), [search]);
  const [index, setIndex] = useState<CountryIndex | null>(null);
  const [poolsByCountry, setPoolsByCountry] = useState<Map<string, Pool[]>>(() => new Map());
  const [loadError, setLoadError] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  // Un choix explicite de l'utilisateur (même « Toutes ») prime sur le préréglage de l'URL.
  const [envChoice, setEnvFilter] = useState<EnvFilter | null>(null);
  const [lenChoice, setLenFilter] = useState<LenFilter | null>(null);
  const [openChoice, setOpenFilter] = useState<OpenFilter | null>(null);
  const [favChoice, setFavoritesOnly] = useState<boolean | null>(null);
  const envFilter = envChoice ?? preset.env;
  const lenFilter = lenChoice ?? preset.len;
  const openFilter = openChoice ?? preset.open;
  const favoritesOnly = favChoice ?? preset.fav;
  const [query, setQuery] = useState("");
  const favorites = useFavorites();
  const [listLimit, setListLimit] = useState(LIST_STEP);
  /** Piscine ciblée depuis la carte : mise en avant + défilement. */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // null = pas encore chargées depuis localStorage : l'effet de persistance
  // ne doit pas écraser la liste stockée avec un tableau vide au montage.
  const [savedAddresses, setSavedAddresses] = useState<UserLocation[] | null>(null);
  // Statut du jour en direct (piscines de Toulouse), superposé aux données OSM.
  const [live, setLive] = useState<Map<string, LivePoolStatus> | null>(null);

  const hasFavorites = favorites.length > 0;
  // « Favoris » actif mais plus aucune ★ : le filtre devient inactif (dérivé au
  // rendu) — pas de liste vide sans échappatoire.
  const effectiveFavOnly = favoritesOnly && hasFavorites;
  const searching = query.trim().length > 0;

  useEffect(() => {
    const controller = new AbortController();
    fetchToulouseLive(controller.signal)
      .then(setLive)
      .catch(() => {
        // Service indisponible : on reste sur les horaires OSM.
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let saved: SavedSearch | null = null;
    let addresses: UserLocation[] = [];
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      const rawAddresses = JSON.parse(localStorage.getItem(ADDRESSES_KEY) ?? "[]");
      if (Array.isArray(rawAddresses)) addresses = rawAddresses;
    } catch {
      // Stockage local corrompu ou indisponible : on repart de zéro.
    }
    // Le rayon de l'URL prime sur celui de la recherche mémorisée.
    const urlRadius = readFilterPreset(new URLSearchParams(window.location.search)).radiusKm;
    // La recherche sauvegardée n'est restaurée qu'une fois l'index prêt :
    // la liste ne peut de toute façon rien afficher avant.
    fetch("/data/index.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: CountryIndex) => {
        setIndex(data);
        setSavedAddresses(addresses);
        if (saved?.location) setLocation(saved.location);
        const radius = urlRadius ?? saved?.radiusKm;
        if (radius && isRadiusOption(radius)) setRadiusKm(radius);
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (savedAddresses === null) return;
    try {
      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(savedAddresses));
    } catch {
      // Quota ou navigation privée : la persistance est optionnelle.
    }
  }, [savedAddresses]);

  // Charge les fichiers des pays couvrant la position (zones frontalières :
  // plusieurs pays possibles). Les pays déjà chargés sont conservés.
  useEffect(() => {
    if (!index || !location) return;
    const missing = countriesFor(index, location).filter((code) => !poolsByCountry.has(code));
    if (missing.length === 0) return;
    let cancelled = false;
    Promise.all(
      missing.map((code) =>
        fetch(`/data/piscines-${code}.json`)
          .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
          .then((data: PoolDataset) => [code, data.pools] as const),
      ),
    )
      .then((loaded) => {
        if (cancelled) return;
        setPoolsByCountry((prev) => new Map([...prev, ...loaded]));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [index, location, poolsByCountry]);

  const contributions = useContributions();
  const userPools = useUserPools();
  const allPools = useMemo(
    () => [...[...poolsByCountry.values()].flat(), ...userPools].map((p) => applyContrib(p, contributions[p.id])),
    [poolsByCountry, userPools, contributions],
  );

  const loadingPools =
    index !== null &&
    location !== null &&
    countriesFor(index, location).some((code) => !poolsByCountry.has(code));

  useEffect(() => {
    if (!location) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ location, radiusKm } satisfies SavedSearch));
    } catch {
      // Quota ou navigation privée : la persistance est optionnelle.
    }
  }, [location, radiusKm]);

  // Première ★ posée : l'astuce a rempli son rôle.
  useEffect(() => {
    if (hasFavorites && !readTipDismissed()) dismissTip();
  }, [hasFavorites]);

  /** Piscines dans le rayon (à vol d'oiseau), triées par distance. */
  const nearest = useMemo(() => {
    if (!location || allPools.length === 0) return null;
    let best: { km: number; pool: Pool } | null = null;
    for (const pool of allPools) {
      const d = haversineKm(location.lat, location.lon, pool.lat, pool.lon);
      if (!best || d < best.km) best = { km: d, pool };
    }
    return best;
  }, [allPools, location]);
  const nearestKm = nearest?.km ?? null;
  // Rayon en miles quand la piscine la plus proche est britannique.
  const imperial = usesMiles(nearest?.pool.country);
  const radiusChoices = imperial
    ? RADIUS_OPTIONS_MI.map((mi) => ({ km: milesToKm(mi), label: `${mi} mi` }))
    : RADIUS_OPTIONS_KM.map((km) => ({ km, label: `${km} km` }));

  // Passage km ↔ miles : le rayon retenu devient la pastille la plus proche.
  const radius = radiusChoices.reduce((a, b) => (Math.abs(b.km - radiusKm) < Math.abs(a.km - radiusKm) ? b : a));
  const radiusLimitKm = radius.km;

  const inRadius: PoolWithDistance[] = useMemo(() => {
    if (!location) return [];
    return allPools
      .map((pool) => ({
        ...pool,
        distanceKm: haversineKm(location.lat, location.lon, pool.lat, pool.lon),
      }))
      .filter((pool) => pool.distanceKm <= radiusLimitKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allPools, location, radiusLimitKm]);

  const filters: Filters = useMemo(
    () => ({
      env: envFilter,
      len: lenFilter,
      open: openFilter,
      favorites: effectiveFavOnly ? favorites : null,
    }),
    [envFilter, lenFilter, openFilter, effectiveFavOnly, favorites],
  );

  // La recherche par nom remplace tous les filtres : on nomme une piscine
  // précise, on veut la voir. Les ★ remontent en tête, puis la distance.
  const displayed: PoolWithDistance[] = useMemo(() => {
    const kept = searching
      ? inRadius.filter((p) => matchesQuery(p, query))
      : applyFilters(inRadius, filters, live, now, locale);
    return [...kept].sort((a, b) => {
      const fa = favorites.includes(a.id) ? 0 : 1;
      const fb = favorites.includes(b.id) ? 0 : 1;
      return fa - fb || a.distanceKm - b.distanceKm;
    });
  }, [inRadius, searching, query, filters, live, now, locale, favorites]);

  const center = useMemo<[number, number] | null>(
    () => (location ? [location.lat, location.lon] : null),
    [location],
  );

  /** Distance de la piscine la plus proche, pour guider quand le rayon est vide. */

  const resetList = () => {
    setListLimit(LIST_STEP);
    setSelectedId(null);
  };

  /**
   * Clic sur un filtre : si plus AUCUNE favorite ne passerait le nouveau
   * réglage, « ★ Favoris » se désactive au lieu de laisser une liste vide —
   * chercher un 50 m quand toutes ses ★ font 25 m, c'est chercher une autre
   * piscine que les siennes.
   */
  const clickFilter = (change: { env?: EnvFilter; len?: LenFilter; open?: OpenFilter }) => {
    const next: Filters = { ...filters, ...change };
    if (
      effectiveFavOnly &&
      applyFilters(inRadius, { ...next, favorites }, live, now, locale).length === 0
    ) {
      setFavoritesOnly(false);
    }
    if (change.env !== undefined) setEnvFilter(change.env);
    if (change.len !== undefined) setLenFilter(change.len);
    if (change.open !== undefined) setOpenFilter(change.open);
    resetList();
  };

  /** ★ veut dire « mes piscines, toutes mes piscines » : les autres filtres reviennent à « Toutes ». */
  const toggleFavOnly = () => {
    const next = !effectiveFavOnly;
    setFavoritesOnly(next);
    if (next) {
      setEnvFilter("all");
      setLenFilter("all");
      setOpenFilter("all");
    }
    resetList();
  };

  /** Clic sur un point de la carte : déplie la liste si besoin et défile. */
  const selectPool = useCallback(
    (id: string) => {
      const idx = displayed.findIndex((p) => p.id === id);
      if (idx < 0) return;
      if (idx >= listLimit) setListLimit(Math.ceil((idx + 1) / LIST_STEP) * LIST_STEP);
      setSelectedId(id);
    },
    [displayed, listLimit],
  );

  useEffect(() => {
    if (!selectedId) return;
    // Le bloc replié se rouvre au même moment : la fiche peut n'exister qu'au
    // rendu suivant, d'où quelques tentatives.
    let tries = 0;
    let frame = 0;
    const scroll = () => {
      const el = document.getElementById(`pool-${selectedId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (tries++ < 5) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [selectedId, listLimit]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const stateOf = useCallback(
    (pool: Pool): DayState["kind"] => poolDayState(pool, live?.get(pool.id), now, locale).kind,
    [live, now, locale],
  );

  const isCurrentSaved =
    location !== null && (savedAddresses ?? []).some((a) => a.label === location.label);

  const saveCurrentAddress = () => {
    if (!location || isCurrentSaved) return;
    setSavedAddresses((prev) => [location, ...(prev ?? [])].slice(0, MAX_SAVED_ADDRESSES));
  };

  const removeAddress = (label: string) => {
    setSavedAddresses((prev) => (prev ?? []).filter((a) => a.label !== label));
  };

  const coveredCountries = index
    ? index.countries
        .map((c) => `${dict.countryNames[c.code] ?? c.code.toUpperCase()} (${c.count.toLocaleString(dict.intlLocale)})`)
        .join(" · ")
    : "";

  const openCount = displayed.filter((p) => stateOf(p) === "open").length;

  const openOptions: Array<{ value: OpenFilter; label: string; short: string }> = [
    { value: "all", label: dict.openAll, short: dict.openAll },
    { value: "week", label: dict.openWeek, short: dict.openWeekShort },
    { value: "today", label: dict.openToday, short: dict.openTodayShort },
    { value: "now", label: dict.openNow, short: dict.openNowShort },
  ];

  const contribCount = contributionCount(contributions, userPools.length);

  return (
    <div className="space-y-4">
      {contribCount > 0 && (
        <p className="text-center text-xs text-violet-800/80 dark:text-violet-200/85">
          🏊 {dict.contribCount(contribCount, contribCount.toLocaleString(dict.intlLocale))}{" "}
          <Link href={`/${locale}/ajouter`} className="font-medium underline underline-offset-2">
            {dict.addLink}
          </Link>
        </p>
      )}
      <LocationSearch
        value={location}
        onChange={(l) => {
          setLocation(l);
          resetList();
        }}
      />

      {((savedAddresses?.length ?? 0) > 0 || location) && (
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={dict.savedAddressesAria}>
          {(savedAddresses ?? []).map((address) => (
            <span
              key={address.label}
              className={`flex items-center gap-1 rounded-full py-1 pl-3 pr-1.5 text-xs font-semibold transition ${
                location?.label === address.label
                  ? "bg-violet-600 text-white shadow-sm dark:bg-violet-500"
                  : "bg-white/80 text-violet-800 ring-1 ring-violet-200 dark:bg-white/10 dark:text-violet-100 dark:ring-white/15"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setLocation(address);
                  resetList();
                }}
                className="max-w-52 truncate"
                title={address.label}
              >
                {address.label}
              </button>
              <button
                type="button"
                onClick={() => removeAddress(address.label)}
                aria-label={dict.removeAddress(address.label)}
                className={`rounded-full px-1 leading-none ${
                  location?.label === address.label ? "hover:bg-violet-500" : "hover:bg-violet-100 dark:hover:bg-white/10"
                }`}
              >
                ×
              </button>
            </span>
          ))}
          {location && !isCurrentSaved && savedAddresses !== null && (
            <button
              type="button"
              onClick={saveCurrentAddress}
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-fuchsia-800 ring-1 ring-dashed ring-fuchsia-300 transition hover:bg-fuchsia-50 dark:bg-white/10 dark:text-fuchsia-100 dark:ring-fuchsia-300/50 dark:hover:bg-fuchsia-400/20"
            >
              {dict.saveAddress}{" "}
              « <span className="inline-block max-w-40 truncate align-bottom">{location.label}</span> »
            </button>
          )}
        </div>
      )}

      {location && (
        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fuchsia-700/70 dark:text-fuchsia-200/70"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m12.5 12.5 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            aria-label={dict.poolSearchAria}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetList();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            placeholder={dict.poolSearchPlaceholder}
            className="w-full rounded-full bg-white/70 py-2 pl-9 pr-9 text-sm text-slate-900 shadow-sm ring-1 ring-fuchsia-200/60 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 dark:bg-white/10 dark:text-slate-50 dark:ring-white/15 dark:placeholder:text-slate-400 dark:focus:ring-fuchsia-300"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={dict.poolSearchClear}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-fuchsia-100 hover:text-fuchsia-800 dark:hover:bg-fuchsia-400/20 dark:hover:text-fuchsia-100"
            >
              <span aria-hidden className="text-base leading-none">×</span>
            </button>
          )}
        </div>
      )}

      {searching ? (
        <p className="text-xs text-slate-500 dark:text-slate-300">
          {dict.searchCount(displayed.length, inRadius.length)}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.radiusAria}>
            <ChipLabel>{dict.radiusLabel}</ChipLabel>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {radiusChoices.map(({ km, label }) => (
                <Chip
                  key={label}
                  selected={km === radius.km}
                  onClick={() => {
                    setRadiusKm(km);
                    resetList();
                  }}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.typeAria}>
            <ChipLabel>{dict.typeLabel}</ChipLabel>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {(
                [
                  ["all", dict.typeAll],
                  ["int", dict.typeIndoor],
                  ["ext", dict.typeOutdoor],
                ] as Array<[EnvFilter, string]>
              ).map(([key, label]) => (
                <Chip
                  key={key}
                  selected={envFilter === key}
                  onClick={() => clickFilter({ env: retoggle(envFilter, key) })}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.lenAria}>
            <ChipLabel>{dict.lenLabel}</ChipLabel>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {(
                [
                  ["all", dict.lenAll],
                  [25, "25 m"],
                  [50, "50 m"],
                ] as Array<[LenFilter, string]>
              ).map(([key, label]) => (
                <Chip
                  key={String(key)}
                  selected={lenFilter === key}
                  onClick={() => clickFilter({ len: retoggle(lenFilter, key) })}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label={dict.openAria}
            title={dict.openTitle}
          >
            <ChipLabel>{dict.openLabel}</ChipLabel>
            <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
              {openOptions.map((opt) => (
                <Chip
                  key={opt.value}
                  selected={openFilter === opt.value}
                  onClick={() => clickFilter({ open: retoggle(openFilter, opt.value) })}
                  ariaLabel={opt.short !== opt.label ? opt.label : undefined}
                >
                  {opt.short !== opt.label ? (
                    <>
                      <span className="sm:hidden">{opt.short}</span>
                      <span className="hidden sm:inline">{opt.label}</span>
                    </>
                  ) : (
                    opt.label
                  )}
                </Chip>
              ))}
            </div>
          </div>

          {hasFavorites && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={dict.favAria}>
              <ChipLabel>{dict.favLabel}</ChipLabel>
              <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                <Chip
                  selected={!effectiveFavOnly}
                  onClick={() => {
                    if (effectiveFavOnly) toggleFavOnly();
                  }}
                >
                  {dict.favAll}
                </Chip>
                <Chip selected={effectiveFavOnly} onClick={toggleFavOnly}>
                  {dict.favOnly}
                </Chip>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Découverte des favoris : un seul passage, écarté d'un clic ou dès la
          première ★ (décidé avant la première peinture, cf. lib/client-flags.ts). */}
      {location && (
        <div
          data-slot="fav-tip"
          className="flex-wrap items-center justify-between gap-2 rounded-xl bg-violet-50 px-3 py-2 dark:bg-violet-400/10"
        >
          <span className="text-xs text-violet-900 dark:text-violet-100">{dict.favTip}</span>
          <button
            type="button"
            onClick={dismissTip}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-800 shadow-sm transition-colors hover:bg-fuchsia-100 dark:bg-white/10 dark:text-violet-100 dark:hover:bg-fuchsia-400/20"
          >
            {dict.favTipOk}
          </button>
        </div>
      )}

      {loadError && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-400/30">
          {dict.loadError}
        </p>
      )}

      {!location && !loadError && (
        <div className="rounded-2xl border border-dashed border-fuchsia-300 bg-white/60 px-5 py-8 text-center text-sm text-slate-600 dark:border-fuchsia-300/40 dark:bg-white/5 dark:text-slate-300">
          <p className="text-2xl">🏊</p>
          <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">{dict.emptyTitle}</p>
          <p className="mt-1">{dict.emptyHint}</p>
          {index && (
            <p className="mt-3 text-xs text-slate-400">
              {dict.coveredLabel} {coveredCountries}
            </p>
          )}
        </div>
      )}

      {location && center && (
        <>
          <p className="text-sm text-slate-600 dark:text-slate-300" aria-live="polite">
            {index === null || loadingPools
              ? dict.loadingPools
              : displayed.length === 0
                ? searching
                  ? dict.searchNone(query.trim())
                  : effectiveFavOnly
                    ? dict.noneFavorite
                    : inRadius.length > 0
                      ? dict.noneFilters
                      : nearestKm !== null && nearestKm > radius.km
                        ? dict.noneInRadiusNear(formatDistance(nearestKm, locale, nearest?.pool.country))
                        : dict.noneInRadius
                : dict.countLine(displayed.length, radius.label, location.label)}
          </p>

          {displayed.length > 0 && (
            <CollapsibleSection title={dict.sectionTimeline} storageKey="pf:bloc-timeline">
              <WeekTimeline pools={displayed} live={live} isFavorite={isFavorite} />
            </CollapsibleSection>
          )}

          <CollapsibleSection title={dict.sectionMap} storageKey="pf:bloc-map">
            {displayed.length > 0 && (
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                {dict.mapOpenCount(openCount)} {dict.mapHint}
              </p>
            )}
            <PoolMap
              center={center}
              radiusKm={radius.km}
              pools={displayed}
              onSelect={selectPool}
              isFavorite={isFavorite}
              stateOf={stateOf}
            />
          </CollapsibleSection>

          <CollapsibleSection
            title={dict.sectionList(displayed.length)}
            storageKey="pf:bloc-list"
            variant="plain"
            openSignal={selectedId}
          >
            <div className="space-y-3">
              {displayed.slice(0, listLimit).map((pool) => (
                <PoolCard
                  key={pool.id}
                  pool={pool}
                  live={live?.get(pool.id) ?? null}
                  selected={pool.id === selectedId}
                />
              ))}
            </div>

            {displayed.length > listLimit && (
              <button
                type="button"
                onClick={() => setListLimit((n) => n + LIST_STEP)}
                className="mt-3 w-full rounded-xl bg-white/80 px-4 py-2.5 text-sm font-medium text-fuchsia-800 ring-1 ring-fuchsia-200 transition hover:bg-fuchsia-50 dark:bg-white/10 dark:text-fuchsia-100 dark:ring-white/15 dark:hover:bg-fuchsia-400/20"
              >
                {dict.showMore(displayed.length - listLimit)}
              </button>
            )}
          </CollapsibleSection>

          <p className="pt-2 text-center text-sm">
            <Link
              href={`/${locale}/ajouter`}
              className="font-medium text-fuchsia-700 underline underline-offset-2 hover:text-fuchsia-900 dark:text-fuchsia-300"
            >
              {dict.addLink}
            </Link>
          </p>
          {index && (
            <p className="pt-2 text-center text-xs text-slate-400">
              {dict.coveredLabel} {coveredCountries}
            </p>
          )}
        </>
      )}
    </div>
  );
}
