import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getDict, isLocale, LOCALES, PRIVACY_UPDATED } from "@/lib/i18n";
import { CONTACT_EMAIL } from "@/lib/site";
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
    title: `${dict.privacy.title} — Swimmaps`,
    description: dict.privacy.intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/privacy`])),
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-violet-800 dark:text-violet-200">{title}</h2>
      <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  const p = dict.privacy;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <PageHeader locale={locale} path="/privacy" title={p.title} subtitle={p.subtitle}>
        <p className="mt-3 text-xs text-pink-100/80">{p.updated(formatDate(PRIVACY_UPDATED, locale))}</p>
      </PageHeader>

      <div className="rounded-3xl bg-card p-5 shadow-lg shadow-pink-100/60 dark:shadow-none dark:ring-1 dark:ring-white/10 sm:p-7">
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.intro}</p>

        {p.sections.map((section) => (
          <Section key={section.title} title={section.title}>
            {section.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </Section>
        ))}

        <Section title={p.contactTitle}>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-fuchsia-700 underline underline-offset-2 dark:text-fuchsia-300"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <Section title={p.changesTitle}>
          <p>{p.changes}</p>
        </Section>
      </div>

      <div className="mt-6 text-center">
        <Link
          href={`/${locale}`}
          className="text-sm font-medium text-violet-700 underline underline-offset-2 hover:text-fuchsia-700 dark:text-violet-300 dark:hover:text-fuchsia-300"
        >
          ← {dict.backHome}
        </Link>
      </div>

      <SiteFooter locale={locale} />
    </main>
  );
}
