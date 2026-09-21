import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/** « / » → /fr, /en ou /de selon la langue du navigateur ; la requête (?open=now…) est conservée. */
export function proxy(request: NextRequest) {
  const accepted = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => part.trim().slice(0, 2).toLowerCase());
  const locale =
    accepted.find((code) => (LOCALES as string[]).includes(code)) ??
    DEFAULT_LOCALE;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
