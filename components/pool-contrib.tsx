"use client";

import { useState } from "react";
import type { Pool, Prices } from "@/lib/types";
import {
  applyContrib,
  CONTRIB_ANCHOR,
  currencySymbol,
  ENV_CHOICES,
  envKey,
  PRICE_KINDS,
  pricesText,
  todayIso,
  LEN_MAX,
  LEN_MIN,
  MAX_RANGES,
  normalizeTime,
  missingFields,
  PRICE_MAX,
  weekToOsm,
  type ContribField,
  type ContribInput,
  type SeasonInput,
  type WeekInput,
} from "@/lib/contrib";
import type { Dict, Locale } from "@/lib/i18n";
import { formatPeriodBounds, formatWeekFR, parseOpeningHours, seasonLines, type WeekSchedule } from "@/lib/opening-hours";
import { Chip } from "@/components/chip";
import { WeekList } from "@/components/week-list";
import { useDict, useLocale } from "@/components/locale-provider";
import {
  submitContribution,
  submitCorrection,
  useContributions,
  type SubmitResult,
} from "@/components/use-contributions";

// Sur fond de carte blanc, la pastille de filtre seule ne se lit pas comme un bouton.
const OUTLINE = "ring-1 ring-fuchsia-200 dark:ring-white/15";
const INPUT =
  "rounded-full bg-white/70 px-2.5 py-1 text-xs ring-1 ring-fuchsia-200 dark:bg-white/10 dark:ring-white/15";
const PRIMARY = "rounded-full bg-fuchsia-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40";

type Pending = Omit<ContribInput, "id">;

function Note({ pool, field }: { pool: Pool; field: ContribField }) {
  const dict = useDict();
  return pool.contributed?.includes(field) ? (
    <span className="ml-1 text-xs italic text-slate-400">({dict.contribBadge})</span>
  ) : null;
}

/** Lignes Type, Longueurs et Tarif du bloc infos de la fiche, compléments inclus. */
export function PoolKindRows({ pool: source }: { pool: Pool }) {
  const dict = useDict();
  const pool = applyContrib(source, useContributions()[source.id]);
  const tarif = pool.prices
    ? pricesText(pool.prices, pool.country, dict.priceKinds)
    : (pool.charge ?? (pool.fee === true ? dict.paidEntry : pool.fee === false ? dict.freeEntry : null));
  return (
    <>
      {pool.env && (
        <>
          <dt className="text-slate-500 dark:text-slate-400">{dict.typeLabel}</dt>
          <dd>
            {dict.envLabels[envKey(pool)!]}
            <Note pool={pool} field="env" />
          </dd>
        </>
      )}
      {pool.lens?.length ? (
        <>
          <dt className="text-slate-500 dark:text-slate-400">{dict.detailLengths}</dt>
          <dd>
            {pool.lens.map((l) => `${l} m`).join(", ")}
            <Note pool={pool} field="lens" />
          </dd>
        </>
      ) : null}
      {tarif && (
        <>
          <dt className="text-slate-500 dark:text-slate-400">{dict.priceLabel.replace(/\s*:$/, "")}</dt>
          <dd>
            {tarif}
            <Note pool={pool} field="price" />
          </dd>
        </>
      )}
    </>
  );
}

/** Horaires de la fiche quand seule une saisie de visiteur les connaît ; sinon le rendu serveur. */
export function PoolHours({ pool: source, children }: { pool: Pool; children: React.ReactNode }) {
  const dict = useDict();
  const locale = useLocale();
  const pool = applyContrib(source, useContributions()[source.id]);
  const parsed = pool.hoursFrom === "user" && pool.hours ? parseOpeningHours(pool.hours, locale) : null;
  if (!parsed) return children;
  return (
    <>
      <WeekList
        week={parsed.week}
        title={parsed.holidayWeek ? dict.schoolTerm : undefined}
        locale={locale}
        closed={dict.timelineClosed}
      />
      {parsed.holidayWeek && (
        <WeekList week={parsed.holidayWeek} title={dict.schoolHolidays} locale={locale} closed={dict.timelineClosed} />
      )}
      {parsed.seasons.map((s) => (
        <WeekList
          key={formatPeriodBounds(s, locale)}
          week={s.week}
          title={formatPeriodBounds(s, locale)}
          locale={locale}
          closed={dict.timelineClosed}
        />
      ))}
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-300">{dict.contribHoursNote}</p>
    </>
  );
}

/** Un champ par catégorie de tarif ; « gratuit » si la piscine l'est. */
export function PriceForm({
  country,
  allowFree,
  onDone,
}: {
  country: string;
  allowFree: boolean;
  onDone: (prices: Prices | null) => void;
}) {
  const dict = useDict();
  const [values, setValues] = useState<Record<string, string>>({});
  const prices: Prices = {};
  for (const k of PRICE_KINDS) {
    const v = Number((values[k] ?? "").replace(",", "."));
    if (v > 0 && v <= PRICE_MAX) prices[k] = v;
  }
  const any = Object.keys(prices).length > 0;
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[minmax(0,max-content)_6rem] items-center gap-x-2 gap-y-1">
        {PRICE_KINDS.map((k) => (
          <label key={k} className="contents">
            <span className="text-xs text-slate-700 dark:text-slate-200">{dict.priceKinds[k]}</span>
            <input
              inputMode="decimal"
              value={values[k] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [k]: e.target.value }))}
              placeholder={currencySymbol(country)}
              className={INPUT}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" disabled={!any} onClick={() => onDone(prices)} className={PRIMARY}>
          {dict.contribNext}
        </button>
        {allowFree && (
          <Chip selected={false} onClick={() => onDone(null)} className={OUTLINE}>
            {dict.contribFree}
          </Chip>
        )}
      </div>
    </div>
  );
}

type DayDraft = { closed: boolean; ranges: Array<[string, string]> };
const emptyDays = (): DayDraft[] => Array.from({ length: 7 }, () => ({ closed: false, ranges: [["", ""]] }));
const toWeek = (days: DayDraft[]): WeekInput =>
  days.map((day) => (day.closed ? [] : day.ranges.map(([a, b]) => [normalizeTime(a), normalizeTime(b)] as [string, string])));
const weekOk = (week: WeekInput) =>
  week.every((r) => r.every(([a, b]) => a && b && a < b)) && week.some((r) => r.length);

/** « lun–ven 7:00–21:00 · … », vacances scolaires à part si elles diffèrent. */
export function hoursSummary(osm: string, locale: Locale, dict: Dict): string {
  const parsed = parseOpeningHours(osm, locale);
  if (!parsed) return osm;
  const line = (week: WeekSchedule) =>
    formatWeekFR(week, locale)
      .map((l) => `${l.days} ${l.hours}`)
      .join(" · ");
  return [
    parsed.holidayWeek
      ? `${dict.schoolTerm}: ${line(parsed.week)} — ${dict.schoolHolidays}: ${line(parsed.holidayWeek)}`
      : line(parsed.week),
    ...seasonLines(parsed, locale),
  ].join(" — ");
}

/** Une ligne de saisie par jour ; un jour non fermé doit avoir des plages complètes. */
function DaysGrid({ days, setDays }: { days: DayDraft[]; setDays: (fn: (prev: DayDraft[]) => DayDraft[]) => void }) {
  const dict = useDict();
  const update = (d: number, fn: (day: DayDraft) => DayDraft) =>
    setDays((prev) => prev.map((day, i) => (i === d ? fn(day) : day)));
  return (
    <div className="space-y-1.5">
      {days.map((day, d) => (
        <div key={d} className="flex flex-wrap items-center gap-1.5">
          <span className="w-10 shrink-0 capitalize text-slate-700 dark:text-slate-200">{dict.dayShort[d]}</span>
          <label className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={day.closed}
              onChange={(e) => update(d, (x) => ({ ...x, closed: e.target.checked }))}
            />
            {dict.contribClosed}
          </label>
          {!day.closed &&
            day.ranges.map(([from, to], r) => (
              <span key={r} className="flex items-center gap-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={from}
                  placeholder="9:00"
                  aria-label={`${dict.dayShort[d]} ${r + 1}`}
                  onChange={(e) =>
                    update(d, (x) => ({ ...x, ranges: x.ranges.map((v, i) => (i === r ? [e.target.value, v[1]] : v)) }))
                  }
                  onBlur={(e) => {
                    const t = normalizeTime(e.target.value);
                    if (t) update(d, (x) => ({ ...x, ranges: x.ranges.map((v, i) => (i === r ? [t, v[1]] : v)) }));
                  }}
                  className={`w-16 text-center ${INPUT}`}
                />
                –
                <input
                  type="text"
                  inputMode="decimal"
                  value={to}
                  placeholder="21:00"
                  aria-label={`${dict.dayShort[d]} ${r + 1}`}
                  onChange={(e) =>
                    update(d, (x) => ({ ...x, ranges: x.ranges.map((v, i) => (i === r ? [v[0], e.target.value] : v)) }))
                  }
                  onBlur={(e) => {
                    const t = normalizeTime(e.target.value);
                    if (t) update(d, (x) => ({ ...x, ranges: x.ranges.map((v, i) => (i === r ? [v[0], t] : v)) }));
                  }}
                  className={`w-16 text-center ${INPUT}`}
                />
              </span>
            ))}
          {!day.closed && day.ranges.length < MAX_RANGES && (
            <button
              type="button"
              onClick={() => update(d, (x) => ({ ...x, ranges: [...x.ranges, ["", ""]] }))}
              className="text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300"
            >
              {dict.contribAddRange}
            </button>
          )}
          {d === 0 && (
            <button
              type="button"
              onClick={() => setDays((prev) => prev.map(() => structuredClone(prev[0])))}
              className="text-xs font-medium text-fuchsia-700 underline underline-offset-2 dark:text-fuchsia-300"
            >
              {dict.contribCopyAll}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Semaine type, et en option une seconde semaine pour les vacances scolaires. */
export function HoursForm({
  onDone,
}: {
  onDone: (week: WeekInput, holiday?: WeekInput, season?: SeasonInput) => void;
}) {
  const dict = useDict();
  const [days, setDays] = useState(emptyDays);
  const [holidayOn, setHolidayOn] = useState(false);
  const [holidayDays, setHolidayDays] = useState(emptyDays);
  const [seasonOn, setSeasonOn] = useState(false);
  const [seasonDays, setSeasonDays] = useState(emptyDays);
  // Champs date complets (AAAA-MM-JJ) ; seuls mois et jour comptent, la période revient chaque année.
  const [seasonFrom, setSeasonFrom] = useState("");
  const [seasonTo, setSeasonTo] = useState("");
  const [invalid, setInvalid] = useState(false);

  const submit = () => {
    const week = toWeek(days);
    const holiday = holidayOn ? toWeek(holidayDays) : undefined;
    const season = seasonOn
      ? { from: seasonFrom.slice(5), to: seasonTo.slice(5), week: toWeek(seasonDays) }
      : undefined;
    const ok =
      weekOk(week) &&
      (!holiday || weekOk(holiday)) &&
      (!season || (seasonFrom.length === 10 && seasonTo.length === 10 && weekOk(season.week)));
    setInvalid(!ok);
    if (ok) onDone(week, holiday, season);
  };

  return (
    <div className="space-y-2">
      {holidayOn && (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          {dict.schoolTerm}
        </p>
      )}
      <DaysGrid days={days} setDays={setDays} />
      <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
        <input type="checkbox" checked={holidayOn} onChange={(e) => setHolidayOn(e.target.checked)} />
        {dict.contribHolidayToggle}
      </label>
      {holidayOn && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
            {dict.schoolHolidays}
          </p>
          <DaysGrid days={holidayDays} setDays={setHolidayDays} />
        </>
      )}
      <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
        <input type="checkbox" checked={seasonOn} onChange={(e) => setSeasonOn(e.target.checked)} />
        {dict.contribSeasonToggle}
      </label>
      {seasonOn && (
        <>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-1">
              {dict.contribFrom}
              <input type="date" value={seasonFrom} onChange={(e) => setSeasonFrom(e.target.value)} className={INPUT} />
            </label>
            <label className="flex items-center gap-1">
              {dict.contribTo}
              <input type="date" value={seasonTo} onChange={(e) => setSeasonTo(e.target.value)} className={INPUT} />
            </label>
          </div>
          <DaysGrid days={seasonDays} setDays={setSeasonDays} />
        </>
      )}
      {invalid && <p className="text-xs text-rose-600 dark:text-rose-300">{dict.contribHoursInvalid}</p>}
      <button type="button" onClick={submit} className={PRIMARY}>
        {dict.contribNext}
      </button>
    </div>
  );
}

/** Questions pour les champs que ni la source ni un visiteur n'ont renseignés. */
export function PoolContrib({ pool }: { pool: Pool }) {
  const dict = useDict();
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [otherLen, setOtherLen] = useState("");
  const [pricesOpen, setPricesOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const missing = missingFields(pool);
  if (!missing.length && result !== "ok") return null;

  const send = async (input: Pending) => {
    setBusy(true);
    setResult(await submitContribution({ id: pool.id, ...input }));
    setBusy(false);
    setPending(null);
    setHoursOpen(false);
    setPricesOpen(false);
  };
  const choose = (input: Pending) => {
    setResult(null);
    setPending(input);
  };
  const decimal = (n: number) => (locale === "en" ? String(n) : String(n).replace(".", ","));
  const pendingLabel = !pending
    ? ""
    : pending.env
      ? dict.envLabels[pending.env]
      : pending.len !== undefined
        ? `${decimal(pending.len)} m`
        : pending.week
          ? hoursSummary(weekToOsm(pending.week, pending.holiday, pending.season), locale, dict)
          : pending.prices
            ? pricesText(pending.prices, pool.country, dict.priceKinds)
            : dict.contribFree;

  const other = Number(otherLen.replace(",", "."));

  return (
    <section
      id={CONTRIB_ANCHOR}
      className="mt-6 scroll-mt-4 rounded-xl bg-card px-3 py-3 text-sm shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10"
    >
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{dict.contribTitle}</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dict.contribIntro}</p>
      <fieldset disabled={busy} className="mt-3 space-y-3">
        {missing.includes("env") && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribEnvQ}</p>
            <div className="flex flex-wrap gap-1.5">
              {ENV_CHOICES.map((env) => (
                <Chip key={env} selected={pending?.env === env} onClick={() => choose({ env })} className={OUTLINE}>
                  {dict.envLabels[env]}
                </Chip>
              ))}
            </div>
          </div>
        )}
        {missing.includes("lens") && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribLenQ}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {[25, 50].map((len) => (
                <Chip key={len} selected={pending?.len === len} onClick={() => choose({ len })} className={OUTLINE}>
                  {len} m
                </Chip>
              ))}
              <form
                className="flex items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (other >= LEN_MIN && other <= LEN_MAX) choose({ len: other });
                }}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  value={otherLen}
                  onChange={(e) => setOtherLen(e.target.value)}
                  placeholder={dict.contribOtherLen}
                  aria-label={dict.contribOtherLen}
                  className={`w-24 ${INPUT}`}
                />
                <button type="submit" disabled={!(other >= LEN_MIN && other <= LEN_MAX)} className={PRIMARY}>
                  {dict.contribSend}
                </button>
              </form>
            </div>
          </div>
        )}
        {missing.includes("hours") && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribHoursQ}</p>
            {hoursOpen ? (
              <HoursForm
                onDone={(week, holiday, season) => choose({ week, ...(holiday && { holiday }), ...(season && { season }) })}
              />
            ) : (
              <Chip selected={false} onClick={() => setHoursOpen(true)} className={OUTLINE}>
                {dict.contribHoursStart}
              </Chip>
            )}
          </div>
        )}
        {missing.includes("price") && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribPriceQ}</p>
            {pricesOpen ? (
              <PriceForm
                country={pool.country}
                allowFree={pool.fee === undefined}
                onDone={(prices) => choose(prices ? { prices } : { free: true })}
              />
            ) : (
              <Chip selected={false} onClick={() => setPricesOpen(true)} className={OUTLINE}>
                {dict.contribPricesStart}
              </Chip>
            )}
          </div>
        )}
        {pending && (
          <div role="group" aria-label={dict.contribConfirm(pendingLabel)} className="rounded-lg bg-fuchsia-50 px-3 py-2 dark:bg-fuchsia-400/10">
            <p className="text-slate-800 dark:text-slate-100">{dict.contribConfirm(pendingLabel)}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => send(pending)} className={`${PRIMARY} px-3`}>
                {dict.contribYes}
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-full px-3 py-1 text-xs font-medium text-fuchsia-900 ring-1 ring-fuchsia-200 dark:text-fuchsia-100 dark:ring-white/15"
              >
                {dict.contribCancel}
              </button>
            </div>
          </div>
        )}
      </fieldset>
      {result && (
        <p role="status" className="mt-2 text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300">
          {result === "ok" || result === "known"
            ? dict.contribThanks
            : result === "too_many"
              ? dict.contribTooMany
              : dict.contribError}
        </p>
      )}
    </section>
  );
}

/** « 2026-12-31 » → date courte localisée, sans dépendre du fuseau. */
function shortDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

/** Correction d'horaires, de tarif ou fermeture temporaire ; appliquée après validation par l'auteure. */
export function PoolCorrect({ pool }: { pool: Pool }) {
  const dict = useDict();
  const locale = useLocale();
  const [open, setOpen] = useState<"hours" | "price" | "closure" | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [closeFrom, setCloseFrom] = useState("");
  const [closeTo, setCloseTo] = useState("");

  const hasHours = Boolean(pool.hours);
  const hasPrice = Boolean(pool.charge || pool.prices) || pool.fee !== undefined;
  const closureOk = closeFrom.length === 10 && closeTo.length === 10 && closeFrom <= closeTo && closeTo >= todayIso();
  if (result === "ok") {
    return <p className="mt-4 rounded-xl bg-fuchsia-50 px-3 py-3 text-sm dark:bg-fuchsia-400/10">{dict.corrThanks}</p>;
  }

  const label = !pending
    ? ""
    : pending.week
      ? hoursSummary(weekToOsm(pending.week, pending.holiday, pending.season), locale, dict)
      : pending.prices
        ? pricesText(pending.prices, pool.country, dict.priceKinds)
        : pending.closure
          ? dict.closureNotice(shortDate(pending.closure.from, locale), shortDate(pending.closure.to, locale))
          : dict.contribFree;

  const send = async () => {
    if (!pending) return;
    setBusy(true);
    setResult(await submitCorrection({ id: pool.id, ...pending }));
    setBusy(false);
    setPending(null);
  };

  return (
    <section className="mt-4 rounded-xl bg-card px-3 py-3 text-sm shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{dict.corrTitle}</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dict.corrIntro}</p>
      <fieldset disabled={busy} className="mt-3 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {hasHours && (
            <Chip selected={open === "hours"} onClick={() => setOpen(open === "hours" ? null : "hours")} className={OUTLINE}>
              {dict.corrHours}
            </Chip>
          )}
          {hasPrice && (
            <Chip selected={open === "price"} onClick={() => setOpen(open === "price" ? null : "price")} className={OUTLINE}>
              {dict.corrPrice}
            </Chip>
          )}
          <Chip selected={open === "closure"} onClick={() => setOpen(open === "closure" ? null : "closure")} className={OUTLINE}>
            {dict.corrClosure}
          </Chip>
        </div>
        {open === "hours" && (
          <HoursForm
            onDone={(week, holiday, season) =>
              setPending({ week, ...(holiday && { holiday }), ...(season && { season }) })
            }
          />
        )}
        {open === "closure" && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-1">
              {dict.contribFrom}
              <input type="date" value={closeFrom} onChange={(e) => setCloseFrom(e.target.value)} className={INPUT} />
            </label>
            <label className="flex items-center gap-1">
              {dict.contribTo}
              <input type="date" value={closeTo} onChange={(e) => setCloseTo(e.target.value)} className={INPUT} />
            </label>
            <button
              type="button"
              disabled={!closureOk}
              onClick={() => setPending({ closure: { from: closeFrom, to: closeTo } })}
              className={PRIMARY}
            >
              {dict.contribNext}
            </button>
          </div>
        )}
        {open === "price" && (
          <PriceForm country={pool.country} allowFree onDone={(prices) => setPending(prices ? { prices } : { free: true })} />
        )}
        {pending && (
          <div role="group" aria-label={dict.corrConfirm(label)} className="rounded-lg bg-fuchsia-50 px-3 py-2 dark:bg-fuchsia-400/10">
            <p className="text-slate-800 dark:text-slate-100">{dict.corrConfirm(label)}</p>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={send} className={`${PRIMARY} px-3`}>
                {dict.contribYes}
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-full px-3 py-1 text-xs font-medium text-fuchsia-900 ring-1 ring-fuchsia-200 dark:text-fuchsia-100 dark:ring-white/15"
              >
                {dict.contribCancel}
              </button>
            </div>
          </div>
        )}
      </fieldset>
      {result && (
        <p role="status" className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-300">
          {result === "too_many" ? dict.contribTooMany : dict.contribError}
        </p>
      )}
    </section>
  );
}
