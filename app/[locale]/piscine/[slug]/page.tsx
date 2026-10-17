import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getDict, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { getPoolBySlug, nearestPools } from "@/lib/pools-server";
import { poolPagePath, poolSlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";
import { formatDistance } from "@/lib/geo";
import {
  formatTime,
  parseOpeningHours,
  prettifyOpeningHours,
  type WeekSchedule,
} from "@/lib/opening-hours";
import { isCertain } from "@/lib/pool-state";
import { openingHoursSpec } from "@/lib/schema";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { PoolDetail } from "@/components/pool-detail";
import { FeedbackForm } from "@/components/feedback-form";

// Fiches rendues à la demande (10 000 piscines × 3 langues) et gardées un jour.
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const pool = getPoolBySlug(slug);
  if (!pool) return {};
  const dict = getDict(locale);
  return {
    title: `${dict.detailMetaTitle(pool.name, pool.city)} — Swimmaps`,
    description: dict.detailMetaDescription(pool.name, pool.city),
    alternates: {
      canonical: poolPagePath(locale, pool),
      languages: Object.fromEntries(LOCALES.map((l) => [l, poolPagePath(l, pool)])),
    },
  };
}

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

function WeekList({
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

export default async function PoolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const pool = getPoolBySlug(slug);
  if (!pool) notFound();
  // Ancien lien (id seul) ou nom modifié : une seule URL canonique par fiche.
  if (slug !== poolSlug(pool)) permanentRedirect(poolPagePath(locale, pool));

  const dict = getDict(locale);
  const parsed = pool.hours ? parseOpeningHours(pool.hours, locale) : null;
  const nearby = nearestPools(pool, 6);
  const pagePath = poolPagePath(locale, pool);
  const website = pool.website;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${pool.lat},${pool.lon}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${pagePath}#webpage`,
        url: `${SITE_URL}${pagePath}`,
        name: dict.detailMetaTitle(pool.name, pool.city),
        inLanguage: dict.intlLocale,
        mainEntity: { "@id": `${SITE_URL}${pagePath}` },
      },
      {
        "@type": "PublicSwimmingPool",
        "@id": `${SITE_URL}${pagePath}`,
        name: pool.name,
        url: `${SITE_URL}${pagePath}`,
        ...(website && { sameAs: website }),
        address: {
          "@type": "PostalAddress",
          ...(pool.address && { streetAddress: pool.address }),
          postalCode: pool.cp,
          addressLocality: pool.city,
          addressCountry: pool.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: pool.lat, longitude: pool.lon },
        ...(pool.phone && { telephone: pool.phone }),
        ...(pool.charge && { priceRange: pool.charge }),
        ...(pool.fee === false && { isAccessibleForFree: true }),
        ...(parsed &&
          isCertain(parsed) && { openingHoursSpecification: openingHoursSpec(parsed.week) }),
      },
    ],
  };

  const lengths = (pool.lens ?? []).map((l) => `${l} m`).join(", ");
  const basins = pool.basins.map((b) => dict.basinLabels[b] ?? dict.basinFallback(b)).join(", ");
  const tarif = pool.charge
    ? pool.charge
    : pool.fee === true
      ? dict.paidEntry
      : pool.fee === false
        ? dict.freeEntry
        : null;

  const LINK = "underline underline-offset-2 hover:text-fuchsia-700 dark:hover:text-fuchsia-300";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHeader
        locale={locale}
        path={pagePath.slice(`/${locale}`.length)}
        title={pool.name}
        subtitle={dict.detailSubtitle(pool.city)}
        back={{ href: `/${locale}`, label: dict.backHome }}
      />

      <PoolDetail pool={pool} />

      <section className="mt-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{dict.detailHoursTitle}</h2>
        {parsed ? (
          <>
            <WeekList
              week={parsed.week}
              title={parsed.holidayWeek ? dict.schoolTerm : undefined}
              locale={locale}
              closed={dict.timelineClosed}
            />
            {parsed.holidayWeek && (
              <WeekList
                week={parsed.holidayWeek}
                title={dict.schoolHolidays}
                locale={locale}
                closed={dict.timelineClosed}
              />
            )}
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-300">
              {pool.hoursFrom === "web" ? dict.centreHoursNote : dict.detailHoursNote}
            </p>
          </>
        ) : pool.hours ? (
          <div className="mt-2 rounded-xl bg-card px-3 py-2 text-sm shadow-sm dark:shadow-none dark:ring-1 dark:ring-white/10">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{dict.detailRawHours}</p>
            <ul className="mt-1 space-y-0.5 text-slate-700 dark:text-slate-200">
              {prettifyOpeningHours(pool.hours, locale).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{dict.detailHoursUnknown}</p>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{dict.detailInfoTitle}</h2>
        <dl className="mt-2 grid grid-cols-[minmax(0,max-content)_1fr] gap-x-4 gap-y-1.5 rounded-xl bg-card px-3 py-2 text-sm text-slate-700 shadow-sm shadow-pink-100/40 dark:text-slate-300 dark:shadow-none dark:ring-1 dark:ring-white/10">
          <dt className="text-slate-500 dark:text-slate-400">{dict.detailAddress}</dt>
          <dd>
            {pool.address ? `${pool.address}, ` : ""}
            {pool.cp} {pool.city} ·{" "}
            <a href={directions} target="_blank" rel="noreferrer" className={LINK}>
              {dict.directions}
            </a>
          </dd>
          {pool.env && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.typeLabel}</dt>
              <dd>{dict.envLabels[pool.env]}</dd>
            </>
          )}
          {basins && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.detailBasins}</dt>
              <dd>{basins}</dd>
            </>
          )}
          {lengths && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.detailLengths}</dt>
              <dd>{lengths}</dd>
            </>
          )}
          {tarif && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.priceLabel.replace(/\s*:$/, "")}</dt>
              <dd>{tarif}</dd>
            </>
          )}
          {pool.phone && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">☎</dt>
              <dd>
                <a href={`tel:${pool.phone.replace(/\s/g, "")}`} className={LINK}>
                  {pool.phone}
                </a>
              </dd>
            </>
          )}
          {website && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.website}</dt>
              <dd className="break-words">
                <a href={website} target="_blank" rel="noreferrer" className={LINK}>
                  {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </dd>
            </>
          )}
        </dl>
      </section>

      <nav aria-label={dict.detailNearbyTitle} className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dict.detailNearbyTitle}</h2>
        <ul className="mt-2 text-sm">
          {nearby.map((p) => (
            <li key={p.id}>
              <Link
                href={poolPagePath(locale, p)}
                className="block py-1.5 text-slate-500 underline underline-offset-2 hover:text-fuchsia-700 dark:text-slate-300 dark:hover:text-fuchsia-300"
              >
                {p.name} ({p.city}) — {dict.detailNearbyAway(formatDistance(p.distanceKm, locale))}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <FeedbackForm poolName={`${pool.name} (${pool.city})`} />

      <SiteFooter locale={locale} withFeedback />
    </main>
  );
}
