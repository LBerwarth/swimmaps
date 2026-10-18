/**
 * Source Irlande du Nord : Active Places NI (Sport Northern Ireland, licence OGL v3),
 * extrait Open Data NI de 2017. Coordonnées en Irish Grid (EPSG:29902).
 */
import proj4 from "proj4";
import type { Pool } from "../../lib/types";

const CSV_URL =
  "https://admin.opendatani.gov.uk/dataset/c889255d-38e7-4a28-8dd5-0b8f16493cd1/resource/1b4b7dbe-f71b-419f-a6c6-a70805ab946d/download/open-data-ni-extract.csv";

const IRISH_GRID =
  "+proj=tmerc +lat_0=53.5 +lon_0=-8 +k=1.000035 +x_0=200000 +y_0=250000 +ellps=mod_airy " +
  "+towgs84=482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15 +units=m +no_defs";

/** Même philosophie que l'Angleterre : piscines publiques, pas les clubs privés ni les écoles. */
const PUBLIC_OWNERSHIP = new Set(["District Council", "Other"]);

/** Analyse CSV minimale : guillemets doubles, virgules dans les champs. */
function parseCsv(text: string): Array<Record<string, string>> {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field || row.length) rows.push([...row, field]);
  const [header, ...data] = rows.filter((r) => r.some((v) => v.trim()));
  const keys = header.map((h) => h.replace(/^﻿/, "").trim());
  return data.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

/** Identifiant stable sans id source : empreinte FNV-1a du nom et du code postal. */
function stableId(name: string, postcode: string): string {
  let h = 0x811c9dc5;
  for (const ch of `${name}|${postcode}`.toLowerCase()) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `GBNI${h.toString(36).toUpperCase()}`;
}

export async function loadNorthernIreland(): Promise<Pool[]> {
  console.log("Téléchargement Active Places NI (Sport NI)…");
  // Open Data NI refuse les clients sans User-Agent de navigateur et redirige une fois.
  const res = await fetch(CSV_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; swimmaps-build/1.0; +https://www.swimmaps.eu)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Active Places NI : HTTP ${res.status}`);
  const rows = parseCsv(await res.text());

  const pools: Pool[] = [];
  for (const r of rows) {
    if (r.SWIMMING !== "Yes" || !PUBLIC_OWNERSHIP.has(r.OWNERSHIP_TYPE)) continue;
    const e = Number(r.EASTING);
    const n = Number(r.NORTHING);
    if (!e || !n || !r.VENUE_NAME) continue;
    const [lon, lat] = proj4(IRISH_GRID, "WGS84", [e, n]);
    const phone = r.TELEPHONE.replace(/[^\d+ ()-]/g, "").trim();
    pools.push({
      id: stableId(r.VENUE_NAME, r.POST_CODE),
      name: r.VENUE_NAME,
      city: r.POST_TOWN,
      cp: r.POST_CODE,
      ...(r.ADDRESS_LINE_1 && { address: r.ADDRESS_LINE_1 }),
      country: "GB",
      lat: Math.round(lat * 1e5) / 1e5,
      lon: Math.round(lon * 1e5) / 1e5,
      basins: [],
      ...(phone.length >= 6 && { phone }),
    });
  }
  console.log(`Irlande du Nord : ${pools.length} piscines publiques sur ${rows.length} équipements`);
  return pools;
}
