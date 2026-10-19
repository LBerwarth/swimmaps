import { isLocale, LOCALES } from "@/lib/i18n";
import { localeSitemap } from "@/lib/sitemap";

export const revalidate = 86400;
export const dynamicParams = false;
// La lecture Redis (piscines ajoutées) rendait chaque sitemap de 12 Mo à chaque passage de robot.
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((l) => ({ file: `${l}.xml` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.xml$/, "");
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  return new Response(await localeSitemap(locale), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
