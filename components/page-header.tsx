import Link from "next/link";
import { getDict, LOCALES, type Locale } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Bandeau commun : titre, sous-titre, sélecteur de langue (même page dans
 * l'autre langue) et bascule de thème. `path` = chemin sans préfixe de langue.
 */
export function PageHeader({
  locale,
  path,
  title,
  subtitle,
  back,
  children,
}: {
  locale: Locale;
  path: string;
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  const dict = getDict(locale);
  return (
    <header className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-fuchsia-600 to-violet-800 px-5 py-6 text-white shadow-lg shadow-pink-200/60 dark:from-pink-700 dark:via-fuchsia-800 dark:to-violet-900 dark:shadow-black/40 sm:px-7 sm:py-8">
      <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
        <nav className="flex gap-1 text-xs font-semibold" aria-label={dict.langAria}>
          {LOCALES.map((code) => (
            <Link
              key={code}
              href={`/${code}${path}`}
              hrefLang={code}
              aria-current={code === locale ? "page" : undefined}
              className={`rounded-full px-2 py-0.5 uppercase transition ${
                code === locale
                  ? "bg-white/90 text-fuchsia-700"
                  : "bg-white/20 text-white hover:bg-white/40"
              }`}
            >
              {code}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      {back && (
        <p className="mb-2 pr-36">
          <Link href={back.href} className="inline-flex items-center gap-2 text-sm hover:text-white">
            <span aria-hidden className="text-xl leading-none">←</span>
            <span className="underline decoration-pink-200/60 underline-offset-4">{back.label}</span>
          </Link>
        </p>
      )}
      <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${back ? "" : "pr-36"}`}>{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm font-light text-pink-50">{subtitle}</p>}
      {children}
      {/* Vagues décoratives */}
      <svg
        className="pointer-events-none absolute -bottom-1 left-0 w-full text-white/15"
        viewBox="0 0 400 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 25 Q 25 15 50 25 T 100 25 T 150 25 T 200 25 T 250 25 T 300 25 T 350 25 T 400 25 V 40 H 0 Z"
          fill="currentColor"
        />
        <path
          d="M0 32 Q 25 24 50 32 T 100 32 T 150 32 T 200 32 T 250 32 T 300 32 T 350 32 T 400 32 V 40 H 0 Z"
          fill="currentColor"
        />
      </svg>
    </header>
  );
}
