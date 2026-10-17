"use client";

import Image from "next/image";
import { useDict } from "@/components/locale-provider";

export function ShareIcon({
  className = "mx-0.5 inline h-4 w-4 align-text-bottom",
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 15V3" />
      <path d="m8 7 4-4 4 4" />
      <path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-3 w-3 shrink-0"
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[11px] font-semibold text-white dark:bg-sky-500">
      {n}
    </span>
  );
}

const STEP =
  "flex gap-3 rounded-xl bg-white/80 p-3 ring-1 ring-sky-200/70 dark:bg-white/5 dark:ring-white/10";
const MOCK =
  "w-24 shrink-0 self-start rounded-lg bg-slate-100 p-1.5 text-[9px] leading-tight text-slate-500 dark:bg-slate-800 dark:text-slate-400";

/** Les trois gestes pour installer l'appli depuis Safari sur iPhone/iPad. */
export function IosInstallSteps() {
  const dict = useDict();
  return (
    <ol className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-3">
      <li className={STEP}>
        <div className={`${MOCK} flex h-14 items-center justify-center`}>
          <ShareIcon className="h-7 w-7 text-sky-600 dark:text-sky-400" label={dict.iosShare} />
        </div>
        <div className="flex gap-2">
          <StepBadge n={1} />
          <p>
            {dict.iosStep3a} <span className="font-medium">{dict.iosShare}</span>{" "}
            <ShareIcon label={dict.iosShare} /> {dict.iosStep1}
          </p>
        </div>
      </li>
      <li className={STEP}>
        <div className={MOCK}>
          <div className="px-1.5 py-1">{dict.iosCopy}</div>
          <div className="px-1.5 py-1">{dict.iosBookmark}</div>
          <div className="flex items-center gap-1 rounded bg-white px-1.5 py-1 font-semibold text-slate-900 shadow-sm ring-1 ring-sky-400 dark:bg-slate-700 dark:text-white">
            <span className="truncate">{dict.iosAddHome}</span>
            <PlusSquareIcon />
          </div>
        </div>
        <div className="flex gap-2">
          <StepBadge n={2} />
          <p>
            {dict.iosStep2a} <span className="font-medium">{dict.iosStep2b}</span>
          </p>
        </div>
      </li>
      <li className={STEP}>
        <div className={MOCK}>
          <div className="flex justify-between">
            <span>{dict.iosCancel}</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">{dict.iosAdd}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Image src="/icon-192.png" alt="" width={20} height={20} className="rounded-md" />
            <span className="text-slate-700 dark:text-slate-200">Swimmaps</span>
          </div>
        </div>
        <div className="flex gap-2">
          <StepBadge n={3} />
          <p>
            {dict.iosStep3a} <span className="font-medium">{dict.iosAdd}</span>. {dict.iosStep3b}
          </p>
        </div>
      </li>
    </ol>
  );
}
