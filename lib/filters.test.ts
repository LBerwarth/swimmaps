import { describe, expect, it } from "vitest";
import { DEFAULT_PRESET, isRadiusOption, matchesHours, milesToKm, readFilterPreset, retoggle } from "./filters";
import { formatDistance } from "./geo";

describe("readFilterPreset", () => {
  it("sans paramètre : préréglage par défaut", () => {
    expect(readFilterPreset(new URLSearchParams(""))).toEqual(DEFAULT_PRESET);
  });
  it("lit les raccourcis du lanceur", () => {
    expect(readFilterPreset(new URLSearchParams("open=now&hours=late&type=outdoor&length=50&fav=1&radius=10"))).toEqual({
      env: "ext",
      len: 50,
      open: "now",
      hours: "late",
      fav: true,
      radiusKm: 10,
    });
  });
  it("ignore les valeurs inconnues", () => {
    expect(readFilterPreset(new URLSearchParams("open=never&hours=x&type=x&length=33&radius=7"))).toEqual(DEFAULT_PRESET);
  });
});

describe("retoggle", () => {
  it("recliquer la pastille active la relâche", () => {
    expect(retoggle<"all" | 25 | 50>(25, 25)).toBe("all");
    expect(retoggle<"all" | 25 | 50>(25, 50)).toBe(50);
    expect(retoggle<"all" | "int">("all", "all")).toBe("all");
  });
});

describe("miles pour les piscines britanniques", () => {
  it("affiche les distances en miles au Royaume-Uni, en km ailleurs", () => {
    expect(formatDistance(1.609344, "en", "GB")).toBe("1.0 mi");
    expect(formatDistance(32.2, "en", "GB")).toBe("20 mi");
    expect(formatDistance(3.2, "en", "FR")).toBe("3.2 km");
    expect(formatDistance(0.85, "de")).toBe("850 m");
  });

  it("reconnaît les rayons des deux grilles", () => {
    expect(isRadiusOption(5)).toBe(true);
    expect(isRadiusOption(milesToKm(3))).toBe(true);
    expect(isRadiusOption(7)).toBe(false);
  });
});

describe("matchesHours", () => {
  const h = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  it("avant 9 h : 8 h 30 oui, 9 h pile non", () => {
    expect(matchesHours([[h("08:30"), h("12:00")]], "early")).toBe(true);
    expect(matchesHours([[h("09:00"), h("12:00")]], "early")).toBe(false);
  });
  it("12–14 h : au moins une heure dans la fenêtre", () => {
    expect(matchesHours([[h("07:00"), h("13:00")]], "noon")).toBe(true);
    expect(matchesHours([[h("13:30"), h("19:30")]], "noon")).toBe(false);
  });
  it("après 19 h : jusqu'à 20 h au moins", () => {
    expect(matchesHours([[h("12:00"), h("20:00")]], "late")).toBe(true);
    expect(matchesHours([[h("12:00"), h("19:30")]], "late")).toBe(false);
  });
});
