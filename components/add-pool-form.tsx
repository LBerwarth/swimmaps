"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ENV_CHOICES,
  pricesText,
  LEN_MAX,
  LEN_MIN,
  weekToOsm,
  type EnvChoice,
  type SeasonInput,
  type WeekInput,
} from "@/lib/contrib";
import { NAME_MAX, NOTE_MAX } from "@/lib/newpool";
import { Chip } from "@/components/chip";
import { LocationSearch, type UserLocation } from "@/components/location-search";
import { HoursForm, hoursSummary, PriceForm } from "@/components/pool-contrib";
import type { Prices } from "@/lib/types";
import { useDict, useLocale } from "@/components/locale-provider";
import { submitNewPool, type NewPoolResult } from "@/components/use-contributions";

const OUTLINE = "ring-1 ring-fuchsia-200 dark:ring-white/15";
const INPUT =
  "w-full rounded-xl bg-white/70 px-3 py-2 text-sm ring-1 ring-fuchsia-200 dark:bg-white/10 dark:ring-white/15";
const LABEL = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200";

export function AddPoolForm() {
  const dict = useDict();
  const locale = useLocale();
  const [name, setName] = useState("");
  const [where, setWhere] = useState<UserLocation | null>(null);
  const [env, setEnv] = useState<EnvChoice | undefined>();
  const [len, setLen] = useState("");
  const [website, setWebsite] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [week, setWeek] = useState<WeekInput | null>(null);
  const [holiday, setHoliday] = useState<WeekInput | undefined>();
  const [season, setSeason] = useState<SeasonInput | undefined>();
  const [hoursOpen, setHoursOpen] = useState(false);
  // undefined = non renseigné, null = entrée gratuite.
  const [prices, setPrices] = useState<Prices | null | undefined>();
  const [pricesOpen, setPricesOpen] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<{ result: NewPoolResult; slug?: string } | null>(null);

  const length = Number(len.replace(",", "."));
  const lengthOk = length >= LEN_MIN && length <= LEN_MAX;
  // Avant géocodage, le pays (et donc la monnaie) se devine au libellé de l'adresse.
  const label = where?.label ?? "";
  const country = /United Kingdom|Royaume-Uni|England|Angleterre/i.test(label)
    ? "GB"
    : /Suisse|Schweiz|Switzerland|Svizzera|Svizra/i.test(label)
      ? "CH"
      : "";
  const pricesLabel = prices ? pricesText(prices, country, dict.priceKinds) : prices === null ? dict.contribFree : "";
  const hoursLabel = week ? hoursSummary(weekToOsm(week, holiday, season), locale, dict) : "";

  if (outcome?.result === "ok") {
    return <p className="rounded-xl bg-fuchsia-50 px-3 py-3 text-sm dark:bg-fuchsia-400/10">{dict.addThanks}</p>;
  }

  const review = () => {
    const ok = name.trim().length >= 3 && where !== null && env !== undefined;
    setMissing(!ok);
    setReviewing(ok);
  };

  const send = async () => {
    if (!where || !env) return;
    setBusy(true);
    setOutcome(
      await submitNewPool({
        name: name.trim(),
        lat: where.lat,
        lon: where.lon,
        env,
        ...(lengthOk && { len: length }),
        ...(website.trim() && { website: website.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
        ...(week && { week, ...(holiday && { holiday }), ...(season && { season }) }),
        ...(prices ? { prices } : prices === null ? { free: true as const } : {}),
        ...(note.trim() && { note: note.trim() }),
      }),
    );
    setBusy(false);
    setReviewing(false);
  };

  const optional = <span className="font-normal text-slate-400">({dict.addOptional})</span>;

  return (
    <div className="space-y-4">
      <fieldset disabled={reviewing || busy} className="space-y-4">
        <div>
          <label htmlFor="add-name" className={LABEL}>
            {dict.addName}
          </label>
          <input id="add-name" value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} className={INPUT} />
        </div>
        <div>
          <p className={LABEL}>{dict.addWhere}</p>
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">{dict.addWhereHint}</p>
          <LocationSearch value={where} onChange={setWhere} />
          {where && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">📍 {where.label}</p>}
        </div>
        <div>
          <p className={LABEL}>
            {dict.contribEnvQ}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ENV_CHOICES.map((e) => (
              <Chip key={e} selected={env === e} onClick={() => setEnv(env === e ? undefined : e)} className={OUTLINE}>
                {dict.envLabels[e]}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className={LABEL}>
            {dict.contribLenQ} {optional}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {["25", "50"].map((l) => (
              <Chip key={l} selected={len === l} onClick={() => setLen(len === l ? "" : l)} className={OUTLINE}>
                {l} m
              </Chip>
            ))}
            <input
              inputMode="decimal"
              value={len === "25" || len === "50" ? "" : len}
              onChange={(e) => setLen(e.target.value)}
              placeholder={dict.contribOtherLen}
              aria-label={dict.contribOtherLen}
              className="w-24 rounded-full bg-white/70 px-2.5 py-1 text-xs ring-1 ring-fuchsia-200 dark:bg-white/10 dark:ring-white/15"
            />
          </div>
        </div>
        <div>
          <label htmlFor="add-site" className={LABEL}>
            {dict.addWebsite} {optional}
          </label>
          <input
            id="add-site"
            type="url"
            inputMode="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
            className={INPUT}
          />
        </div>
        <div>
          <label htmlFor="add-phone" className={LABEL}>
            {dict.addPhone} {optional}
          </label>
          <input
            id="add-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={INPUT}
          />
        </div>
        <div>
          <p className={LABEL}>
            {dict.contribHoursQ} {optional}
          </p>
          {week && !hoursOpen ? (
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {hoursLabel}{" "}
              <button
                type="button"
                onClick={() => setHoursOpen(true)}
                className="text-xs font-medium text-fuchsia-700 underline underline-offset-2 dark:text-fuchsia-300"
              >
                {dict.addEdit}
              </button>
            </p>
          ) : hoursOpen ? (
            <HoursForm
              onDone={(w, h, s) => {
                setWeek(w);
                setHoliday(h);
                setSeason(s);
                setHoursOpen(false);
              }}
            />
          ) : (
            <Chip selected={false} onClick={() => setHoursOpen(true)} className={OUTLINE}>
              {dict.contribHoursStart}
            </Chip>
          )}
        </div>
        <div>
          <p className={LABEL}>
            {dict.contribPriceQ} {optional}
          </p>
          {prices !== undefined && !pricesOpen ? (
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {pricesLabel}{" "}
              <button
                type="button"
                onClick={() => setPricesOpen(true)}
                className="text-xs font-medium text-fuchsia-700 underline underline-offset-2 dark:text-fuchsia-300"
              >
                {dict.addEdit}
              </button>
            </p>
          ) : pricesOpen ? (
            <PriceForm
              country={country}
              allowFree
              onDone={(p) => {
                setPrices(p);
                setPricesOpen(false);
              }}
            />
          ) : (
            <Chip selected={false} onClick={() => setPricesOpen(true)} className={OUTLINE}>
              {dict.contribPricesStart}
            </Chip>
          )}
        </div>
        <div>
          <label htmlFor="add-note" className={LABEL}>
            {dict.addNote} {optional}
          </label>
          <textarea
            id="add-note"
            rows={3}
            maxLength={NOTE_MAX}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={INPUT}
          />
        </div>
      </fieldset>

      {missing && <p className="text-sm text-rose-600 dark:text-rose-300">{dict.addMissing}</p>}
      {outcome?.result === "exists" && (
        <p className="text-sm text-rose-600 dark:text-rose-300">
          {dict.addExists}{" "}
          {outcome.slug && (
            <Link href={`/${locale}/piscine/${outcome.slug}`} className="underline underline-offset-2">
              {dict.detailLinkTitle}
            </Link>
          )}
        </p>
      )}
      {(outcome?.result === "too_many" || outcome?.result === "error") && (
        <p className="text-sm text-rose-600 dark:text-rose-300">
          {outcome.result === "too_many" ? dict.contribTooMany : dict.contribError}
        </p>
      )}

      {reviewing ? (
        <div className="rounded-xl bg-fuchsia-50 px-3 py-3 text-sm dark:bg-fuchsia-400/10">
          <p className="font-semibold text-slate-900 dark:text-slate-50">{name.trim()}</p>
          <p className="text-slate-600 dark:text-slate-300">{where?.label}</p>
          <p className="text-slate-600 dark:text-slate-300">
            {[env && dict.envLabels[env], lengthOk && `${len} m`, website.trim(), phone.trim()]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {week && <p className="text-slate-600 dark:text-slate-300">{hoursLabel}</p>}
          {pricesLabel && <p className="text-slate-600 dark:text-slate-300">{pricesLabel}</p>}
          <p className="mt-2 text-slate-800 dark:text-slate-100">{dict.addConfirm}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={send}
              className="rounded-full bg-fuchsia-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {dict.addSend}
            </button>
            <button
              type="button"
              onClick={() => setReviewing(false)}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-fuchsia-900 ring-1 ring-fuchsia-200 dark:text-fuchsia-100 dark:ring-white/15"
            >
              {dict.addEdit}
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={review} className="rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white">
          {dict.addReview}
        </button>
      )}
    </div>
  );
}
