import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { FirstVisit } from "@/components/first-visit";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const a = getDict(locale).about;
  return {
    title: `${a.title} — SwimMaps`,
    description: a.intro,
    alternates: {
      canonical: `/${locale}/about`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/about`])),
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const a = dict.about;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <FirstVisit markOnly />
      <PageHeader locale={locale} path="/about" title={a.title} subtitle={a.subtitle} />

      <div className="rounded-3xl bg-card p-5 shadow-lg shadow-pink-100/60 dark:shadow-none dark:ring-1 dark:ring-white/10 sm:p-7">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{a.intro}</p>

        {a.sections.map((section) => (
          <section key={section.title} className="mt-6">
            <h2 className="text-base font-semibold text-violet-800 dark:text-violet-200">{section.title}</h2>
            <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 marker:text-fuchsia-400 dark:text-slate-300">
              {section.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="mt-8 text-center">
          <Link
            href={`/${locale}`}
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-pink-600 hover:to-fuchsia-700"
          >
            {a.cta}
          </Link>
        </p>
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
