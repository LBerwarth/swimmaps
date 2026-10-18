import { getDict, type Locale } from "@/lib/i18n";
import { formatTime, type WeekSchedule } from "@/lib/opening-hours";

function SlotChips({ ranges, locale }: { ranges: Array<[number, number]>; locale: Locale }) {
  return ranges.map(([s, e]) => (
    <span
      key={`${s}-${e}`}
      className="whitespace-nowrap rounded-full bg-fuchsia-50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-fuchsia-900 dark:bg-fuchsia-400/15 dark:text-fuchsia-100"
    >
      {formatTime(s, locale)}–{formatTime(e, locale)}
    </span>
  ));
}

export function WeekList({
  week,
  title,
  locale,
  closed,
}: {
  week: WeekSchedule;
  title?: string;
  locale: Locale;
  closed: string;
}) {
  const dict = getDict(locale);
  const todayWeekday = (new Date().getDay() + 6) % 7;
  const days = Array.from({ length: 7 }, (_, i) => (todayWeekday + i) % 7);
  return (
    <div>
      {title && (
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
          {title}
        </p>
      )}
      <ul className="mt-2 space-y-1.5">
        {days.map((d, i) => (
          <li
            key={d}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl bg-card px-3 py-2 text-sm shadow-sm shadow-pink-100/40 dark:shadow-none dark:ring-1 dark:ring-white/10"
          >
            <span className="w-28 shrink-0 capitalize text-slate-700 dark:text-slate-200">
              {dict.dayShort[d]}
              {i === 0 && <span className="text-slate-400"> {dict.todaySuffix}</span>}
            </span>
            {week[d].length === 0 ? (
              <span className="text-xs italic text-slate-400 dark:text-slate-300">{closed}</span>
            ) : (
              <span className="flex flex-wrap gap-1.5">
                <SlotChips ranges={week[d]} locale={locale} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
