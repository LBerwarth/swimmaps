import { describe, expect, it } from "vitest";
import {
  applyContrib,
  closureAt,
  contributionCount,
  envKey,
  nextClosure,
  normalizeTime,
  parseClosure,
  parseContribution,
  weekToOsm,
} from "./contrib";
import { parseOpeningHours, weekAt } from "./opening-hours";
import type { Pool } from "./types";

const pool: Pool = { id: "NLN1", name: "Hofbad", city: "Den Haag", cp: "", country: "NL", lat: 52, lon: 4, basins: [] };
const weekdays = Array.from({ length: 7 }, (_, d) => (d < 5 ? [["07:00", "21:00"]] : d === 5 ? [["08:00", "12:00"], ["14:00", "18:00"]] : []));

describe("contributions", () => {
  it("valide la saisie", () => {
    expect(parseContribution({ id: "NLN1", env: "int" })).toEqual({ id: "NLN1", env: "int" });
    expect(parseContribution({ id: "NLN1", len: 25 })).toEqual({ id: "NLN1", len: 25 });
    expect(parseContribution({ id: "NLN1", prices: { adult: 4.8, child: 3, bogus: 1 } })).toEqual({ id: "NLN1", prices: { adult: 4.8, child: 3 } });
    expect(parseContribution({ id: "NLN1", free: true })).toEqual({ id: "NLN1", free: true });
    expect(parseContribution({ id: "NLN1", week: weekdays })?.week?.[5]).toHaveLength(2);
    expect(parseContribution({ id: "NLN1", env: "sauna" })).toBeNull();
    expect(parseContribution({ id: "NLN1", len: 500 })).toBeNull();
    expect(parseContribution({ id: "NLN1", prices: { adult: -1 } })).toBeNull();
    expect(parseContribution({ id: "NLN1", week: [[["21:00", "07:00"]], [], [], [], [], [], []] })).toBeNull();
    expect(parseContribution({ id: "NLN1", week: [[["07:00", "21:00; PH off"]], [], [], [], [], [], []] })).toBeNull();
    expect(parseContribution({ id: "NLN1", week: [[], [], [], [], [], [], []] })).toBeNull();
    expect(parseContribution({ id: "../x", env: "int" })).toBeNull();
  });

  it("produit des horaires OSM que le parseur relit", () => {
    const osm = weekToOsm(weekdays as never);
    expect(osm).toBe("Mo-Fr 07:00-21:00; Sa 08:00-12:00,14:00-18:00; Su off");
    const parsed = parseOpeningHours(osm, "de");
    expect(parsed?.week[0]).toEqual([[420, 1260]]);
    expect(parsed?.week[5]).toHaveLength(2);
    expect(parsed?.week[6]).toEqual([]);
  });

  it("ajoute les horaires des vacances scolaires en règles SH", () => {
    const holiday = Array.from({ length: 7 }, () => [["10:00", "19:00"]]);
    const osm = weekToOsm(weekdays as never, holiday as never);
    expect(osm).toBe("Mo-Fr 07:00-21:00; Sa 08:00-12:00,14:00-18:00; Su off; SH Mo-Su 10:00-19:00");
    const parsed = parseOpeningHours(osm, "de");
    expect(parsed?.week[0]).toEqual([[420, 1260]]);
    expect(parsed?.holidayWeek?.[6]).toEqual([[600, 1140]]);
    expect(parseContribution({ id: "NLN1", week: weekdays, holiday })?.holiday).toHaveLength(7);
    expect(parseContribution({ id: "NLN1", holiday })).toBeNull();
  });

  it("ajoute une période d'été lue par le parseur", () => {
    const summer = Array.from({ length: 7 }, () => [["09:00", "20:00"]]);
    const input = parseContribution({ id: "NLN1", week: weekdays, season: { from: "07-01", to: "08-31", week: summer } });
    expect(input?.season?.from).toBe("07-01");
    const osm = weekToOsm(input!.week!, undefined, input!.season);
    expect(osm).toContain("Jul 01-Aug 31 Mo-Su 09:00-20:00");
    const parsed = parseOpeningHours(osm, "de")!;
    expect(weekAt(parsed, new Date(2026, 7, 2))[6]).toEqual([[540, 1200]]);
    expect(weekAt(parsed, new Date(2026, 9, 4))[6]).toEqual([]);
    expect(parseContribution({ id: "NLN1", week: weekdays, season: { from: "13-01", to: "08-31", week: summer } })?.season).toBeUndefined();
  });

  it("enregistre un Strandbad comme plein air à bassin naturel", () => {
    expect(parseContribution({ id: "NLN1", env: "nat" })).toEqual({ id: "NLN1", env: "nat" });
    const out = applyContrib(pool, { env: "ext", natural: true, at: "" });
    expect(out).toMatchObject({ env: "ext", basins: ["naturel"] });
    expect(envKey(out)).toBe("nat");
    expect(envKey({ ...pool, env: "ext" })).toBe("ext");
  });

  it("valide les fermetures temporaires et les applique", () => {
    const now = new Date(2026, 9, 18);
    expect(parseClosure({ from: "2026-11-01", to: "2026-12-31" }, now)).toEqual({ from: "2026-11-01", to: "2026-12-31" });
    expect(parseClosure({ from: "2026-12-31", to: "2026-11-01" }, now)).toBeUndefined();
    expect(parseClosure({ from: "2025-01-01", to: "2025-02-01" }, now)).toBeUndefined();
    expect(parseClosure({ from: "2026-11-01", to: "2030-01-01" }, now)).toBeUndefined();
    const closed = applyContrib(pool, { closures: [{ from: "2026-11-01", to: "2026-12-31" }], at: "" });
    expect(closureAt(closed, new Date(2026, 10, 15))?.to).toBe("2026-12-31");
    expect(closureAt(closed, now)).toBeUndefined();
    expect(nextClosure(closed, now)?.from).toBe("2026-11-01");
  });

  it("complète les heures saisies sans minutes", () => {
    expect(["16", "9", "16:30", "16.30", "16h30", "16h", "1630", "07:05", " 8 "].map(normalizeTime)).toEqual([
      "16:00", "09:00", "16:30", "16:30", "16:30", "16:00", "16:30", "07:05", "08:00",
    ]);
    expect(["24", "16:75", "abc", "", "123456"].map(normalizeTime)).toEqual(["", "", "", "", ""]);
  });

  it("téléphone et site : validés, appliqués seulement après correction validée", () => {
    expect(parseContribution({ id: "NLN1", phone: "+31 70 123 45 67", website: "denhaag.nl/zwemmen" })).toEqual({
      id: "NLN1", phone: "+31 70 123 45 67", website: "https://denhaag.nl/zwemmen",
    });
    expect(parseContribution({ id: "NLN1", phone: "ring me", website: "javascript:alert(1)" })).toBeNull();
    const c = { phone: "+31 70 000 00 00", website: "https://example.org/", at: "" };
    expect(applyContrib({ ...pool, phone: "+31 70 111 11 11" }, c).phone).toBe("+31 70 111 11 11");
    expect(applyContrib(pool, { ...c, corrected: ["phone", "website"] })).toMatchObject({ phone: "+31 70 000 00 00", website: "https://example.org/" });
  });

  it("accepte un signalement de retrait avec un motif connu", () => {
    expect(parseContribution({ id: "NLN1", removal: "private" })).toEqual({ id: "NLN1", removal: "private" });
    expect(parseContribution({ id: "NLN1", removal: "demolished" })).toBeNull();
  });

  it("compte chaque information saisie et chaque piscine ajoutée", () => {
    expect(contributionCount({ A: { lens: [50], at: "" }, B: { env: "int", hours: "24/7", free: true, at: "" } }, 2)).toBe(6);
    expect(contributionCount({}, 0)).toBe(0);
  });

  it("applique les corrections validées par-dessus la source", () => {
    const src = { ...pool, hours: "Mo-Fr 08:00-20:00", charge: "6,00 €", fee: true };
    const c = { hours: "Mo-Su 09:00-19:00", free: true, corrected: ["hours" as const, "price" as const], at: "" };
    const out = applyContrib(src, c);
    expect(out).toMatchObject({ hours: "Mo-Su 09:00-19:00", hoursFrom: "user", fee: false });
    expect(out.charge).toBeUndefined();
    expect(applyContrib(src, { ...c, corrected: undefined }).hours).toBe("Mo-Fr 08:00-20:00");
  });

  it("complète sans jamais écraser la source", () => {
    const c = { env: "ext" as const, lens: [25], hours: "Mo-Su 10:00-18:00", prices: { adult: 4.8, ten: 40 }, at: "" };
    expect(applyContrib(pool, c)).toMatchObject({
      env: "ext", lens: [25], hours: "Mo-Su 10:00-18:00", hoursFrom: "user", charge: "4,80 €", prices: { adult: 4.8, ten: 40 },
      contributed: ["env", "lens", "hours", "price"],
    });
    expect(applyContrib({ ...pool, country: "GB" }, c).charge).toBe("£4.80");
    expect(applyContrib({ ...pool, country: "CH" }, c).charge).toBe("CHF 4.80");
    expect(applyContrib({ ...pool, env: "int", hours: "24/7" }, c)).toMatchObject({ env: "int", hours: "24/7", contributed: ["lens", "price"] });
    expect(applyContrib({ ...pool, fee: true }, { free: true, at: "" }).contributed).toBeUndefined();
    expect(applyContrib({ ...pool, env: "int", lens: [50], hours: "24/7", fee: false }, c).contributed).toBeUndefined();
  });
});
