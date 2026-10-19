"use client";

import { useEffect, useState } from "react";
import type { Pool } from "@/lib/types";
import { currentSchoolHoliday, type SchoolHoliday } from "@/lib/school-holidays";
import { useDict, useLocale } from "@/components/locale-provider";

export function HolidayBanner({
  pool,
  hoursIncluded = false,
  className = "",
}: {
  pool: Pool;
  hoursIncluded?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const dict = useDict();
  const [holiday, setHoliday] = useState<{ poolId: string; value: SchoolHoliday | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    currentSchoolHoliday(pool, locale).then((value) => {
      if (!cancelled) setHoliday({ poolId: pool.id, value });
    });
    return () => {
      cancelled = true;
    };
  }, [pool, locale]);

  const current = holiday && holiday.poolId === pool.id ? holiday.value : null;
  if (!current) return null;
  return (
    <p
      className={`rounded-2xl bg-amber-100/45 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-300/60 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-white/15 ${className}`}
    >
      {dict.holidayBanner(
        current.name,
        current.lastDay
          ? new Intl.DateTimeFormat(dict.intlLocale, {
              weekday: "long",
              day: "numeric",
              month: "long",
              timeZone: "UTC",
            }).format(new Date(`${current.lastDay}T00:00:00Z`))
          : null,
      )}
      {hoursIncluded && ` ${dict.holidayHoursIncluded}`}
    </p>
  );
}
