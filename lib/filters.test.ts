import { describe, expect, it } from "vitest";
import { DEFAULT_PRESET, isRadiusOption, milesToKm, readFilterPreset, retoggle } from "./filters";
import { formatDistance } from "./geo";

describe("readFilterPreset", () => {
  it("sans paramètre : préréglage par défaut", () => {
    expect(readFilterPreset(new URLSearchParams(""))).toEqual(DEFAULT_PRESET);
  });
  it("lit les raccourcis du lanceur", () => {
    expect(readFilterPreset(new URLSearchParams("open=now&type=outdoor&length=50&fav=1&radius=10"))).toEqual({
      env: "ext",
      len: 50,
      open: "now",
      fav: true,
      radiusKm: 10,
    });
  });
  it("ignore les valeurs inconnues", () => {
    expect(readFilterPreset(new URLSearchParams("open=never&type=x&length=33&radius=7"))).toEqual(DEFAULT_PRESET);
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
