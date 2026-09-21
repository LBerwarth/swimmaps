import { describe, expect, it } from "vitest";
import { poolPagePath, poolSlug, slugify } from "./slug";

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
