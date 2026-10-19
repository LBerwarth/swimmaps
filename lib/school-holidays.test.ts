import { describe, expect, it } from "vitest";
import {
  academyOf,
  nlRegion,
  pickNlHoliday,
  pickMinistryHoliday,
  pickOpenHoliday,
  subdivisionByPostcode,
  subdivisionOf,
  type NlHolidayYear,
} from "./school-holidays";

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

describe("subdivisionOf (Suisse)", () => {
  it("lit les noms bilingues de Photon", () => {
    expect(subdivisionOf("CH", "Bern/Berne")).toBe("CH-BE");
    expect(subdivisionOf("CH", "Valais/Wallis")).toBe("CH-VS");
    expect(subdivisionOf("CH", "Zürich")).toBe("CH-ZH");
  });
  it("écarte les Grisons, découpés par région", () => {
    expect(subdivisionOf("CH", "Graubünden/Grigioni/Grischun")).toBeNull();
  });
});

describe("nlRegion", () => {
  it("suit la page « regio's schoolvakantie »", () => {
    expect(nlRegion("Noord-Holland", "Amsterdam", "Amsterdam")).toBe("noord");
    expect(nlRegion("Flevoland", "Zeewolde", "Zeewolde")).toBe("midden");
    expect(nlRegion("Utrecht", "De Ronde Venen", "Abcoude")).toBe("noord");
    expect(nlRegion("Gelderland", "Nijmegen", "Nijmegen")).toBe("zuid");
    expect(nlRegion("Gelderland", "Tiel", "Tiel")).toBe("midden");
    expect(nlRegion("Gelderland", "Montferland", "Didam")).toBe("zuid");
    expect(nlRegion("Gelderland", "Hattem", "Hattem")).toBe("noord");
    expect(nlRegion("Noord-Brabant", "Altena", "Werkendam")).toBe("midden");
    expect(nlRegion("Noord-Brabant", "Altena", "Dussen")).toBe("zuid");
    expect(nlRegion("Limburg", "Maastricht", "Maastricht")).toBe("zuid");
  });
});

describe("pickNlHoliday", () => {
  const years: NlHolidayYear[] = [
    {
      content: [
        {
          vacations: [
            {
              type: "\n  Herfstvakantie \n",
              regions: [
                { region: "noord", startdate: "2026-10-10T00:00:00.000Z", enddate: "2026-10-18T21:59:00.000Z" },
                { region: "zuid", startdate: "2026-10-17T00:00:00.000Z", enddate: "2026-10-25T22:59:00.000Z" },
              ],
            },
            {
              type: "Kerstvakantie",
              regions: [
                { region: "heel Nederland", startdate: "2026-12-19T00:00:00.000Z", enddate: "2027-01-03T22:59:00.000Z" },
              ],
            },
          ],
        },
      ],
    },
  ];
  it("prend la région demandée, jour civil d'Amsterdam", () => {
    expect(pickNlHoliday(years, "zuid", "2026-10-19")).toEqual({ name: "Herfstvakantie", lastDay: "2026-10-25" });
    expect(pickNlHoliday(years, "noord", "2026-10-19")).toBeNull();
  });
  it("applique « heel Nederland » partout", () => {
    expect(pickNlHoliday(years, "midden", "2026-12-24")?.name).toBe("Kerstvakantie");
  });
});

describe("subdivisionByPostcode", () => {
  it("lit la province espagnole et la région italienne dans le code postal", () => {
    expect(subdivisionByPostcode("ES", "41004")).toBe("ES-AN-SE");
    expect(subdivisionByPostcode("ES", "48008")).toBe("ES-PV");
    expect(subdivisionByPostcode("IT", "20122")).toBe("IT-LO");
    expect(subdivisionByPostcode("IT", "39100")).toBe("IT-TR-BZ");
    expect(subdivisionByPostcode("IT", "00184")).toBe("IT-LA");
  });
  it("ignore un code postal absent ou mal formé", () => {
    expect(subdivisionByPostcode("ES", "")).toBeNull();
    expect(subdivisionByPostcode("IT", "2012")).toBeNull();
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
  it("applique les vacances d'une région à ses provinces", () => {
    const aragon = { ...herbst, name: [{ language: "ES", text: "Navidad" }], subdivisions: [{ code: "ES-AR" }] };
    expect(pickOpenHoliday([aragon], "ES-AR-HU", "2026-10-10", "es")?.name).toBe("Navidad");
    expect(pickOpenHoliday([aragon], "ES-ARX", "2026-10-10", "es")).toBeNull();
  });
});
