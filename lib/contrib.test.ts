import { describe, expect, it } from "vitest";
import { applyContrib, parseContribution } from "./contrib";
import type { Pool } from "./types";

const pool: Pool = { id: "NLN1", name: "Hofbad", city: "Den Haag", cp: "", country: "NL", lat: 52, lon: 4, basins: [] };

describe("contributions", () => {
  it("valide la saisie", () => {
    expect(parseContribution({ id: "NLN1", env: "int" })).toEqual({ id: "NLN1", env: "int" });
    expect(parseContribution({ id: "NLN1", len: 25 })).toEqual({ id: "NLN1", len: 25 });
    expect(parseContribution({ id: "NLN1", env: "sauna" })).toBeNull();
    expect(parseContribution({ id: "NLN1", len: 500 })).toBeNull();
    expect(parseContribution({ id: "../x", env: "int" })).toBeNull();
  });

  it("complète sans jamais écraser la source", () => {
    const c = { env: "ext" as const, lens: [25], at: "" };
    expect(applyContrib(pool, c)).toMatchObject({ env: "ext", lens: [25], contributed: ["env", "lens"] });
    expect(applyContrib({ ...pool, env: "int" }, c)).toMatchObject({ env: "int", lens: [25], contributed: ["lens"] });
    expect(applyContrib({ ...pool, env: "int", lens: [50] }, c).contributed).toBeUndefined();
  });
});
