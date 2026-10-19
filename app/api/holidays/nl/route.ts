export const runtime = "nodejs";

/** Vacances scolaires officielles des Pays-Bas, relayées : la Rijksoverheid ne répond pas au navigateur (CORS). */
export async function GET() {
  const res = await fetch("https://opendata.rijksoverheid.nl/v1/infotypes/schoolholidays?output=json", {
    next: { revalidate: 86_400 },
  }).catch(() => null);
  if (!res?.ok) return Response.json({ error: "unavailable" }, { status: 502 });
  return Response.json(await res.json(), {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
