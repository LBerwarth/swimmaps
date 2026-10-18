import { sitemapIndex } from "@/lib/sitemap";

export const revalidate = 86400;

export function GET() {
  return new Response(sitemapIndex(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
