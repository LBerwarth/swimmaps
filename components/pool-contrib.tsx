"use client";

import { useState } from "react";
import type { Pool, PoolEnv } from "@/lib/types";
import { applyContrib, LEN_MAX, LEN_MIN } from "@/lib/contrib";
import { Chip } from "@/components/chip";
import { useDict } from "@/components/locale-provider";
import { submitContribution, useContributions, type SubmitResult } from "@/components/use-contributions";

/** Lignes « Type » et « Longueurs » du bloc infos de la fiche, compléments inclus. */
export function PoolKindRows({ pool: source }: { pool: Pool }) {
  const dict = useDict();
  const pool = applyContrib(source, useContributions()[source.id]);
  const note = (field: "env" | "lens") =>
    pool.contributed?.includes(field) && (
      <span className="ml-1 text-xs italic text-slate-400">({dict.contribBadge})</span>
    );
  return (
    <>
      {pool.env && (
        <>
          <dt className="text-slate-500 dark:text-slate-400">{dict.typeLabel}</dt>
          <dd>
            {dict.envLabels[pool.env]}
            {note("env")}
          </dd>
        </>
      )}
      {pool.lens?.length ? (
        <>
          <dt className="text-slate-500 dark:text-slate-400">{dict.detailLengths}</dt>
          <dd>
            {pool.lens.map((l) => `${l} m`).join(", ")}
            {note("lens")}
          </dd>
        </>
      ) : null}
    </>
  );
}

/** Questions pour les champs que ni la source ni un visiteur n'ont renseignés. */
export function PoolContrib({ pool }: { pool: Pool }) {
  const dict = useDict();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [otherLen, setOtherLen] = useState("");

  const askEnv = !pool.env;
  const askLen = !pool.lens?.length;
  if (!askEnv && !askLen && result !== "ok") return null;

  const send = async (input: { env?: PoolEnv; len?: number }) => {
    setBusy(true);
    setResult(await submitContribution({ id: pool.id, ...input }));
    setBusy(false);
  };

  const other = Number(otherLen.replace(",", "."));

  return (
    <section className="mt-6 rounded-xl bg-card px-3 py-3 text-sm shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{dict.contribTitle}</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{dict.contribIntro}</p>
      <fieldset disabled={busy} className="mt-3 space-y-3">
        {askEnv && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribEnvQ}</p>
            <div className="flex flex-wrap gap-1.5">
              {(["int", "ext", "mix"] as const).map((env) => (
                <Chip key={env} selected={false} onClick={() => send({ env })}>
                  {dict.envLabels[env]}
                </Chip>
              ))}
            </div>
          </div>
        )}
        {askLen && (
          <div>
            <p className="mb-1.5 text-slate-700 dark:text-slate-200">{dict.contribLenQ}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              {[25, 50].map((len) => (
                <Chip key={len} selected={false} onClick={() => send({ len })}>
                  {len} m
                </Chip>
              ))}
              <form
                className="flex items-center gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (other >= LEN_MIN && other <= LEN_MAX) send({ len: other });
                }}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  value={otherLen}
                  onChange={(e) => setOtherLen(e.target.value)}
                  placeholder={dict.contribOtherLen}
                  aria-label={dict.contribOtherLen}
                  className="w-24 rounded-full bg-white/70 px-2.5 py-1 text-xs ring-1 ring-fuchsia-200 dark:bg-white/10 dark:ring-white/15"
                />
                <button
                  type="submit"
                  disabled={!(other >= LEN_MIN && other <= LEN_MAX)}
                  className="rounded-full bg-fuchsia-600 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {dict.contribSend}
                </button>
              </form>
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
