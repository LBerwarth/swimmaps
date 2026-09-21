import { describe, expect, it } from "vitest";
import { DEFAULT_PRESET, readFilterPreset, retoggle } from "./filters";

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
