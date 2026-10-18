import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/**
 * « / » → la langue de l'appareil (Accept-Language) si elle est proposée, sinon l'anglais ;
 * sans en-tête (robots), la langue par défaut. La requête (?open=now…) est conservée.
 */
export function proxy(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const accepted = header.split(",").map((part) => part.trim().slice(0, 2).toLowerCase());
  const locale =
    accepted.find((code) => (LOCALES as string[]).includes(code)) ?? (header ? "en" : DEFAULT_LOCALE);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
