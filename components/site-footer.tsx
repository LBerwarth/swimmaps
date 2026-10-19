import Link from "next/link";
import { getDict, type Locale } from "@/lib/i18n";
import { FEEDBACK_ANCHOR } from "@/lib/feedback";

const LINK = "underline underline-offset-2 hover:text-fuchsia-700 dark:hover:text-fuchsia-300";

export function SiteFooter({
  locale,
  withFeedback = false,
}: {
  locale: Locale;
  withFeedback?: boolean;
}) {
  const dict = getDict(locale);
  return (
    <footer className="mt-12 space-y-2 text-center text-xs text-slate-500 dark:text-slate-300">
      <p>
        {dict.footerData}{" "}
        <a className={LINK} href="https://equipements.sports.gouv.fr" target="_blank" rel="noreferrer">
          Data ES
        </a>{" "}
        {dict.footerLicenceFR} ·{" "}
        <a className={LINK} href="https://www.activeplacespower.com" target="_blank" rel="noreferrer">
          Active Places
        </a>{" "}
        {dict.footerLicenceGB} ·{" "}
        <a
          className={LINK}
          href="https://admin.opendatani.gov.uk/dataset/active-places-ni-sports-facilities-database"
          target="_blank"
          rel="noreferrer"
        >
          Active Places NI
        </a>{" "}
        {dict.footerLicenceGB} ·{" "}
        <a className={LINK} href="https://baederleben.de" target="_blank" rel="noreferrer">
          Bäderleben
        </a>{" "}
        {dict.footerLicenceDE} ·{" "}
        <a
          className={LINK}
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          {dict.footerOsm}
        </a>{" "}
        (ODbL)
      </p>
      <p>{dict.footerDisclaimer}</p>
      <p>{dict.footerIndependent}</p>
      <p>
        <Link href={`/${locale}/about`} className={LINK}>
          {dict.navAbout}
        </Link>
        {" · "}
        <Link href={`/${locale}/sources`} className={LINK}>
          {dict.navSources}
        </Link>
        {" · "}
        <Link href={`/${locale}/privacy`} className={LINK}>
          {dict.navPrivacy}
        </Link>
        {withFeedback && (
          <>
            {" · "}
            <a href={`#${FEEDBACK_ANCHOR}`} className={LINK}>
              {dict.navFeedback}
            </a>
          </>
        )}
      </p>
    </footer>
  );
}
