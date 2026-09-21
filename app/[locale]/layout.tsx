import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { getDict, isLocale, LOCALES } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { THEME_COLOR, THEME_INIT_SCRIPT } from "@/lib/theme";
import { CLIENT_FLAGS_SCRIPT } from "@/lib/client-flags";
import { LocaleProvider } from "@/components/locale-provider";
import { PwaRegister } from "@/components/pwa-register";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: dict.metaTitle,
    description: dict.metaDescription,
    applicationName: SITE_NAME,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: SITE_NAME,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale}
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: CLIENT_FLAGS_SCRIPT }} />
        <link rel="ai-catalog" href="/ai-catalog.json" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Photo d'eau de piscine en fond, adoucie pour la lisibilité */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-[url('/eau.jpg')] bg-cover bg-center dark:brightness-[0.38]"
        />
        {/* Voile assombri mais non opaque en thème sombre : l'eau reste perceptible. */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-gradient-to-b from-[#e4f0fc]/86 via-[#cfe2f7]/93 to-[#bcd6f0]/98 dark:from-[#04141f]/66 dark:via-[#07182b]/72 dark:to-[#0d1430]/80"
        />
        <LocaleProvider locale={locale}>
          <PwaRegister />
          {children}
        </LocaleProvider>
        {/* Comptage d'audience de Vercel : agrégé, sans cookie (cf. page Confidentialité). */}
        <Analytics />
      </body>
    </html>
  );
}
