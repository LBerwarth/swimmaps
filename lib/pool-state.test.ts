import { describe, expect, it } from "vitest";
import { poolDayState, rangesForDay, slotsState } from "./pool-state";
import type { Pool } from "./types";

const base: Pool = {
  id: "T1",
  name: "Test",
  city: "Ville",
  cp: "00000",
  country: "FR",
  lat: 0,
  lon: 0,
  basins: [],
};

/** Un lundi 15 juin 2026 à l'heure donnée (heure locale). */
const monday = (h: number, m = 0) => new Date(2026, 5, 15, h, m);

describe("slotsState", () => {
  const ranges: Array<[number, number]> = [
    [9 * 60, 12 * 60],
    [14 * 60, 19 * 60],
  ];
  it("ouverte, ferme à la fin du créneau", () => {
    expect(slotsState(ranges, 10 * 60)).toEqual({ kind: "open", until: 12 * 60 });
  });
  it("entre deux créneaux : ouvre plus tard", () => {
    expect(slotsState(ranges, 13 * 60)).toEqual({ kind: "later", at: 14 * 60 });
  });
  it("après le dernier créneau : terminé", () => {
    expect(slotsState(ranges, 20 * 60)).toEqual({ kind: "done" });
  });
  it("aucun créneau : fermée", () => {
    expect(slotsState([], 10 * 60)).toEqual({ kind: "closed" });
  });
});

describe("poolDayState", () => {
  it("horaires inconnus → unknown", () => {
    expect(poolDayState(base, null, monday(10))).toEqual({ kind: "unknown" });
  });
  it("semaine type certaine → état calculé", () => {
    const pool = { ...base, hours: "Mo-Fr 09:00-19:00" };
    expect(poolDayState(pool, null, monday(10))).toEqual({ kind: "open", until: 19 * 60 });
    expect(poolDayState(pool, null, monday(8))).toEqual({ kind: "later", at: 9 * 60 });
  });
  it("fermeture saisonnière en cours prime", () => {
    const pool = { ...base, hours: "Mo-Su 09:00-19:00; Jun-Aug off" };
    expect(poolDayState(pool, null, monday(10))).toEqual({ kind: "seasonal" });
  });
  it("horaires de vacances scolaires : incertain → unknown", () => {
    const pool = { ...base, hours: "Mo-Fr 09:00-19:00; SH Mo-Su 10:00-18:00" };
    expect(poolDayState(pool, null, monday(10))).toEqual({ kind: "unknown" });
  });
  it("le statut live prime sur OSM", () => {
    const pool = { ...base, hours: "Mo-Fr 09:00-19:00" };
    const live = { openToday: false, slots: [], closureReason: "travaux", url: "", updatedAt: "" };
    expect(poolDayState(pool, live, monday(10))).toEqual({ kind: "closed" });
    const open = { ...live, openToday: true, slots: [{ start: "12:00", end: "20:30" }] };
    expect(poolDayState(pool, open, monday(13))).toEqual({ kind: "open", until: 20 * 60 + 30 });
  });
});

describe("rangesForDay", () => {
  it("créneaux du jour demandé, ou fermeture saisonnière", () => {
    const pool = { ...base, hours: "Mo-Fr 09:00-19:00; Sa 10:00-12:00" };
    expect(rangesForDay(pool, null, 5, false, monday(10))).toEqual({
      ranges: [[600, 720]],
      state: "known",
    });
    expect(rangesForDay(pool, null, 6, false, monday(10))).toEqual({ ranges: [], state: "known" });
    const seasonal = { ...base, hours: "Mo-Su 09:00-19:00; Jun-Aug off" };
    expect(rangesForDay(seasonal, null, 0, true, monday(10)).state).toBe("seasonal");
    expect(rangesForDay(base, null, 0, true, monday(10)).state).toBe("unknown");
  });
});
