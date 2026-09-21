import { describe, expect, it } from "vitest";
import { foldText, matchesQuery } from "./search";

const pool = { name: "Piscine de l'Île du Ramier", city: "Toulouse", cp: "31400" };

describe("foldText", () => {
  it("retire accents, apostrophes et déplie « St »", () => {
    expect(foldText("L’Union")).toBe("lunion");
    expect(foldText("St-Orens")).toBe("saint-orens");
    expect(foldText("Straße")).toBe("strasse");
  });
});

describe("matchesQuery", () => {
  it("ignore les mots vides et la casse", () => {
    expect(matchesQuery(pool, "piscine ile du ramier")).toBe(true);
    expect(matchesQuery(pool, "RAMIER")).toBe(true);
  });
  it("cherche aussi la commune et le code postal", () => {
    expect(matchesQuery(pool, "toulouse")).toBe(true);
    expect(matchesQuery(pool, "31400")).toBe(true);
  });
  it("exige chaque mot utile", () => {
    expect(matchesQuery(pool, "ramier blagnac")).toBe(false);
  });
  it("mots vides anglais et allemands", () => {
    expect(matchesQuery({ name: "Senner Waldbad", city: "Bielefeld" }, "das Freibad in Bielefeld")).toBe(true);
    expect(matchesQuery({ name: "Y Club", city: "Manchester" }, "the swimming pool of manchester")).toBe(true);
  });
});
