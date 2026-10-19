import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { nearestPools } from "@/lib/pools-server";
import { findPool, getRemovedIds } from "@/lib/user-pools";
import { poolPagePath, poolSlug } from "@/lib/slug";
import { SITE_URL } from "@/lib/site";
import { formatDistance } from "@/lib/geo";
import { formatPeriodBounds, parseOpeningHours, prettifyOpeningHours } from "@/lib/opening-hours";
import { isCertain } from "@/lib/pool-state";
import { openingHoursSpec } from "@/lib/schema";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { PoolDetail } from "@/components/pool-detail";
import { PoolHours, PoolKindRows } from "@/components/pool-contrib";
import { WeekList } from "@/components/week-list";
import { FeedbackForm } from "@/components/feedback-form";
import { TipJar } from "@/components/tip-jar";
import { PhoneIcon } from "@/components/icons";

// Fiches rendues à la demande (10 000 piscines × 3 langues) et gardées un jour.
export const dynamicParams = true;
export const revalidate = 86400;
// Sans liste (même vide), Next rend chaque fiche à chaque visite, robots compris : la CPU s'envole.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const pool = await findPool(slug);
  if (!pool) return {};
  const dict = getDict(locale);
  return {
    title: `${dict.detailMetaTitle(pool.name, pool.city)} — SwimMaps`,
    description: dict.detailMetaDescription(pool.name, pool.city),
    alternates: {
      canonical: poolPagePath(locale, pool),
      languages: Object.fromEntries(LOCALES.map((l) => [l, poolPagePath(l, pool)])),
    },
  };
}

export default async function PoolPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const pool = await findPool(slug);
  if (!pool) notFound();
  const removed = await getRemovedIds();
  if (removed.has(pool.id)) notFound();
  // Ancien lien (id seul) ou nom modifié : une seule URL canonique par fiche.
  if (slug !== poolSlug(pool)) permanentRedirect(poolPagePath(locale, pool));

  const dict = getDict(locale);
  const parsed = pool.hours ? parseOpeningHours(pool.hours, locale) : null;
  const nearby = nearestPools(pool, 6 + removed.size).filter((p) => !removed.has(p.id)).slice(0, 6);
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

  const basins = pool.basins.map((b) => dict.basinLabels[b] ?? dict.basinFallback(b)).join(", ");

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
        <PoolHours pool={pool}>
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
              {parsed.seasons.map((s) => (
                <WeekList
                  key={formatPeriodBounds(s, locale)}
                  week={s.week}
                  title={formatPeriodBounds(s, locale)}
                  locale={locale}
                  closed={dict.timelineClosed}
                />
              ))}
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
        </PoolHours>
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
          <PoolKindRows pool={pool} />
          {basins && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">{dict.detailBasins}</dt>
              <dd>{basins}</dd>
            </>
          )}
          {pool.phone && (
            <>
              <dt className="text-slate-500 dark:text-slate-400">
                <PhoneIcon className="inline-block h-4 w-4 align-[-0.15em]" />
              </dt>
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

      <TipJar locale={locale} className="mt-8" />

      <nav aria-label={dict.detailNearbyTitle} className="mt-8">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dict.detailNearbyTitle}</h2>
        <ul className="mt-2 text-sm">
          {nearby.map((p) => (
            <li key={p.id}>
              <Link
                href={poolPagePath(locale, p)}
                className="block py-1.5 text-slate-500 underline underline-offset-2 hover:text-fuchsia-700 dark:text-slate-300 dark:hover:text-fuchsia-300"
              >
                {p.name} ({p.city}) — {dict.detailNearbyAway(formatDistance(p.distanceKm, locale, p.country))}
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
