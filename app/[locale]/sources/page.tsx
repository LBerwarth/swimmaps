import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return {
    title: `${dict.sources.title} — Swimmaps`,
    description: dict.sources.subtitle,
    alternates: {
      canonical: `/${locale}/sources`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/sources`])),
    },
  };
}

const LINK = "break-words underline underline-offset-2 hover:text-fuchsia-700 dark:hover:text-fuchsia-300";

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const s = dict.sources;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <PageHeader locale={locale} path="/sources" title={s.title} subtitle={s.subtitle} />

      <div className="rounded-3xl bg-card p-5 shadow-lg shadow-pink-100/60 dark:shadow-none dark:ring-1 dark:ring-white/10 sm:p-7">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{s.intro}</p>

        {s.groups.map((group) => (
          <section key={group.title} className="mt-6">
            <h2 className="text-base font-semibold text-violet-800 dark:text-violet-200">{group.title}</h2>
            <ul className="mt-1.5 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {group.items.map((item) => (
                <li key={item.url + item.label}>
                  <a href={item.url} target="_blank" rel="noreferrer" className={`font-medium ${LINK}`}>
                    {item.label}
                  </a>
                  {item.detail && <span className="text-slate-500 dark:text-slate-400"> — {item.detail}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-6">
          <h2 className="text-base font-semibold text-violet-800 dark:text-violet-200">{s.howTitle}</h2>
          <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {s.how.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-300">
          <Link href={`/${locale}`} className={LINK}>
            {dict.backHome}
          </Link>
          {" · "}
          <Link href={`/${locale}/privacy`} className={LINK}>
            {dict.navPrivacy}
          </Link>
        </p>
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
