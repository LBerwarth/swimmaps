import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getDict, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import { getIndex } from "@/lib/pools-server";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { FinderView } from "@/components/finder-view";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { IosBanner } from "@/components/ios-banner";
import { OfflineBanner } from "@/components/offline-banner";
import { UpdateInfo } from "@/components/update-info";
import { FeedbackForm } from "@/components/feedback-form";
import { TipJar } from "@/components/tip-jar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])), "x-default": "/fr" },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDict(locale);
  const index = getIndex();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: dict.metaDescription,
        inLanguage: LOCALES,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/${locale}#webpage`,
        url: `${SITE_URL}/${locale}`,
        name: dict.metaTitle,
        description: dict.metaDescription,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: dict.intlLocale,
        dateModified: index.updated,
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PageHeader locale={locale} path="" title={SITE_NAME} subtitle={dict.subtitle}>
        <p className="mt-3 text-xs text-pink-100/80">
          {dict.dataDate(formatDate(index.updated, locale))} ·{" "}
          <Link
            href={`/${locale}/sources`}
            className="underline decoration-pink-200/60 underline-offset-2 hover:text-white"
          >
            {dict.navSources}
          </Link>{" "}
          <UpdateInfo />
        </p>
      </PageHeader>

      <IosBanner />
      <OfflineBanner />

      <FinderView />

      <FeedbackForm />

      <TipJar locale={locale} />

      <SiteFooter locale={locale} withFeedback />
    </main>
  );
}
