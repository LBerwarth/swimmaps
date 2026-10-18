import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { AddPoolForm } from "@/components/add-pool-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `${getDict(locale).addTitle} — SwimMaps`, robots: { index: false } };
}

export default async function AddPoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <PageHeader
        locale={locale}
        path="/ajouter"
        title={dict.addTitle}
        subtitle={dict.addSubtitle}
        back={{ href: `/${locale}`, label: dict.backHome }}
      />
      <div className="rounded-3xl bg-card p-5 shadow-lg shadow-pink-100/60 dark:shadow-none dark:ring-1 dark:ring-white/10 sm:p-7">
        <AddPoolForm />
      </div>
      <SiteFooter locale={locale} />
    </main>
  );
}
