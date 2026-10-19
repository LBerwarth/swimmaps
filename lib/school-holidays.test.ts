import { describe, expect, it } from "vitest";
import { academyOf, pickMinistryHoliday, pickOpenHoliday, subdivisionOf } from "./school-holidays";

describe("academyOf", () => {
  it("rattache le département à son académie", () => {
    expect(academyOf("31")).toBe("Toulouse");
    expect(academyOf("2A")).toBe("Corse");
    expect(academyOf("99")).toBeNull();
  });
});

describe("subdivisionOf", () => {
  it("traduit la région Photon en code OpenHolidays", () => {
    expect(subdivisionOf("DE", "Bayern")).toBe("DE-BY");
    expect(subdivisionOf("AT", "Wien")).toBe("AT-WI");
    expect(subdivisionOf("BE", "Liège")).toBe("BE-FR");
  });
  it("laisse Bruxelles sans calendrier", () => {
    expect(subdivisionOf("BE", "Région de Bruxelles-Capitale - Brussels Hoofdstedelijk Gewest")).toBeNull();
  });
});

describe("pickMinistryHoliday", () => {
  const toussaint = {
    description: "Vacances de la Toussaint",
    start_date: "2026-10-16T22:00:00+00:00",
    end_date: "2026-11-01T23:00:00+00:00",
  };
  it("donne le dernier jour, veille de la reprise", () => {
    expect(pickMinistryHoliday([toussaint], new Date("2026-10-19T10:00:00Z"))).toEqual({
      name: "Vacances de la Toussaint",
      lastDay: "2026-11-01",
    });
  });
  it("écarte les ponts", () => {
    const pont = { ...toussaint, description: "Pont de l'Ascension" };
    expect(pickMinistryHoliday([pont], new Date("2026-10-19T10:00:00Z"))).toBeNull();
  });
});

describe("pickOpenHoliday", () => {
  const herbst = {
    startDate: "2026-10-05",
    endDate: "2026-10-17",
    name: [{ language: "DE", text: "Herbstferien" }, { language: "EN", text: "Autumn holidays" }],
    nationwide: false,
    subdivisions: [{ code: "DE-HE" }],
  };
  it("garde la subdivision demandée, dans la langue de l'utilisateur", () => {
    expect(pickOpenHoliday([herbst], "DE-HE", "2026-10-10", "de")).toEqual({
      name: "Herbstferien",
      lastDay: "2026-10-17",
    });
    expect(pickOpenHoliday([herbst], "DE-HE", "2026-10-10", "fr")?.name).toBe("Autumn holidays");
  });
  it("ignore les autres Länder", () => {
    expect(pickOpenHoliday([herbst], "DE-BY", "2026-10-10", "de")).toBeNull();
  });
});
