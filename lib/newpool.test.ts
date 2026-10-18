import { describe, expect, it } from "vitest";
import { parseNewPool } from "./newpool";

describe("parseNewPool", () => {
  it("accepte une saisie complète et la nettoie", () => {
    expect(
      parseNewPool({ name: "  Zwembad\n De Blinkerd ", lat: 52.0812345, lon: 4.3, env: "int", len: 25, website: "denhaag.nl/blinkerd" }),
    ).toEqual({ name: "Zwembad De Blinkerd", lat: 52.08123, lon: 4.3, env: "int", len: 25, website: "https://denhaag.nl/blinkerd" });
  });

  it("accepte téléphone, horaires et tarif", () => {
    const week = [[["07:00", "21:00"]], [], [], [], [], [], []];
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, env: "nat", phone: "+31 70 123 45 67", week, prices: { adult: 5.5, ten: 45 } })).toEqual({
      name: "Bad", lat: 52, lon: 4, env: "nat", phone: "+31 70 123 45 67", week, prices: { adult: 5.5, ten: 45 },
    });
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, env: "ext", free: true })).toMatchObject({ free: true });
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, env: "ext", phone: "call me maybe" })).toBeNull();
  });

  it("refuse le reste", () => {
    expect(parseNewPool({ name: "ab", lat: 52, lon: 4, env: "int" })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: 99, lon: 4, env: "int" })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: "52", lon: 4, env: "int" })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, website: "javascript:alert(1)", env: "int" })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4 })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, env: "spa" })).toBeNull();
    expect(parseNewPool({ name: "Bad", lat: 52, lon: 4, env: "int", len: 900 })).toEqual({ name: "Bad", lat: 52, lon: 4, env: "int" });
  });
});
