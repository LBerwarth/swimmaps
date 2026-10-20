import { describe, expect, it } from "vitest";
import { isIndexable, pageLocales, poolPagePath, poolSlug, slugify } from "./slug";

describe("pageLocales", () => {
  it("langue(s) du pays + anglais, sans doublon", () => {
    expect(pageLocales({ country: "DE" })).toEqual(["de", "en"]);
    expect(pageLocales({ country: "CH" })).toEqual(["de", "fr", "it", "en"]);
    expect(pageLocales({ country: "BE" })).toEqual(["fr", "nl", "en"]);
    expect(pageLocales({ country: "GB" })).toEqual(["en"]);
    expect(pageLocales({ country: "IE" })).toEqual(["en"]);
  });
});

describe("isIndexable", () => {
  it("horaires requis, puis langue de la fiche", () => {
    expect(isIndexable({ country: "DE", hours: "Mo-Fr 08:00-20:00" })).toBe(true);
    expect(isIndexable({ country: "DE" })).toBe(false);
    expect(isIndexable({ country: "DE", hours: "Mo 08:00-20:00" }, "en")).toBe(true);
    expect(isIndexable({ country: "DE", hours: "Mo 08:00-20:00" }, "pt")).toBe(false);
  });
});

describe("slugify", () => {
  it("normalise accents, ß et ponctuation", () => {
    expect(slugify("Centre Nautique Laure Manaudou")).toBe("centre-nautique-laure-manaudou");
    expect(slugify("Piscine de l'Île du Ramier (été)")).toBe("piscine-de-l-ile-du-ramier-ete");
    expect(slugify("Straßenbad")).toBe("strassenbad");
  });
});

describe("poolSlug", () => {
  it("suffixe l'id en minuscules, y compris avec tiret", () => {
    expect(poolSlug({ id: "I315550226-castex", name: "Piscine Castex" })).toBe("piscine-castex-i315550226-castex");
    expect(poolSlug({ id: "DE1", name: "Bad 1" })).toBe("bad-1-de1");
  });
  it("nom vide : repli « piscine »", () => {
    expect(poolSlug({ id: "GB1", name: "***" })).toBe("piscine-gb1");
  });
  it("chemin localisé", () => {
    expect(poolPagePath("en", { id: "GB1000098", name: "Y Club Manchester" })).toBe(
      "/en/piscine/y-club-manchester-gb1000098",
    );
  });
});
