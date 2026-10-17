import { describe, expect, it } from "vitest";
import { getDict } from "./i18n";

describe("detailMetaDescription", () => {
  it("n'ajoute pas le type quand le nom le porte déjà", () => {
    expect(getDict("fr").detailMetaDescription("Piscine Municipale", "Balma")).toMatch(/^Piscine Municipale à Balma :/);
    expect(getDict("fr").detailMetaDescription("Les Tournesols", "Seilh")).toMatch(/^Piscine Les Tournesols à Seilh :/);
    expect(getDict("de").detailMetaDescription("Freibad Wörth", "Wörth")).toMatch(/^Freibad Wörth in Wörth:/);
    expect(getDict("de").detailMetaDescription("Piscine Municipale", "Balma")).toMatch(/^Schwimmbad Piscine Municipale/);
    expect(getDict("en").detailMetaDescription("Leisure Centre", "Leeds")).toMatch(/^Leisure Centre swimming pool in Leeds:/);
    expect(getDict("en").detailMetaDescription("Piscine Municipale", "Balma")).toMatch(/^Piscine Municipale in Balma:/);
  });
});
