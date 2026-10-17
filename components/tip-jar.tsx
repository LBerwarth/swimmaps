import { getDict, type Locale } from "@/lib/i18n";

const TIP_URL = "https://ko-fi.com/lenab71554";

// Rien ne se débloque en retour : paiement de pair à pair au sens de Google Play.
export function TipJar({ locale, className = "mt-4" }: { locale: Locale; className?: string }) {
  const dict = getDict(locale);
  return (
    <section className={`${className} rounded-2xl bg-card px-4 py-5 text-center shadow-md shadow-pink-100/50 dark:shadow-none dark:ring-1 dark:ring-white/10`}>
      <p className="text-sm font-semibold text-violet-800 dark:text-violet-200">☕ {dict.tipTitle}</p>
      <p className="mx-auto mt-2 max-w-md text-xs text-slate-600 dark:text-slate-300">{dict.tipDesc}</p>
      <a
        href={TIP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 dark:from-pink-600 dark:to-fuchsia-700"
      >
        {dict.tipButton}
      </a>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">{dict.tipNote}</p>
    </section>
  );
}
