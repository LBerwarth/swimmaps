import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchToulouseLive, formatSlotTime, isOpenNowLive, toulouseUrl } from "./toulouse-live";

const apiPool = (slug: string, extra: Record<string, unknown> = {}) => ({
  slug,
  name: slug,
  url: `https://piscines-toulouse.fr/piscine/${slug}`,
  ok: true,
  openToday: true,
  slots: [{ start: "09:00", end: "19:00" }],
  closureReason: null,
  ...extra,
});

function mockApi(pools: ReturnType<typeof apiPool>[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      json: async () => ({ updatedAt: "2026-09-21T10:00:00.000Z", pools }),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchToulouseLive", () => {
  it("indexe les statuts par id Data ES, Toulouse et agglomération comprises", async () => {
    mockApi([apiPool("piscine-leo-lagrange"), apiPool("piscine-balma"), apiPool("piscine-aqualudia")]);
    const live = await fetchToulouseLive();
    expect([...live.keys()].sort()).toEqual(["I310440003", "I313950005", "I315550227"]);
    expect(live.get("I310440003")?.url).toContain("piscine-balma");
  });

  it("fusionne Nakache été et hiver : ouverte si l'une des deux l'est", async () => {
    mockApi([
      apiPool("piscine-alfred-nakache-ete", { openToday: false, slots: [], closureReason: "hors saison" }),
      apiPool("piscine-alfred-nakache-hiver", { slots: [{ start: "12:00", end: "20:00" }] }),
    ]);
    const live = await fetchToulouseLive();
    const nakache = live.get("I315550226-nakache")!;
    expect(nakache.openToday).toBe(true);
    expect(nakache.slots).toEqual([{ start: "12:00", end: "20:00" }]);
    expect(nakache.closureReason).toBeNull();
  });

  it("garde le motif de fermeture quand aucun bassin n'ouvre", async () => {
    mockApi([
      apiPool("piscine-castex", { openToday: false, slots: [], closureReason: "Pas d'ouverture le lundi" }),
    ]);
    const live = await fetchToulouseLive();
    expect(live.get("I315550226-castex")).toMatchObject({
      openToday: false,
      closureReason: "Pas d'ouverture le lundi",
    });
  });

  it("date le statut du relevé le plus ancien, à défaut du rapport", async () => {
    mockApi([
      apiPool("piscine-alfred-nakache-ete", { fetchedAt: "2026-09-19T08:00:00.000Z" }),
      apiPool("piscine-alfred-nakache-hiver", { fetchedAt: "2026-09-21T09:45:00.000Z" }),
      apiPool("piscine-balma"),
    ]);
    const live = await fetchToulouseLive();
    expect(live.get("I315550226-nakache")?.updatedAt).toBe("2026-09-19T08:00:00.000Z");
    expect(live.get("I310440003")?.updatedAt).toBe("2026-09-21T10:00:00.000Z");
  });

  it("écarte les piscines non relevées (ok faux, statut inconnu) et les slugs inconnus", async () => {
    mockApi([
      apiPool("piscine-papus", { ok: false }),
      apiPool("piscine-balma", { openToday: null }),
      apiPool("piscine-inexistante"),
    ]);
    expect((await fetchToulouseLive()).size).toBe(0);
  });

  it("propage l'échec HTTP", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 503 })));
    await expect(fetchToulouseLive()).rejects.toThrow("503");
  });
});

describe("toulouseUrl", () => {
  it("pointe vers la fiche piscines-toulouse.fr, sinon null", () => {
    expect(toulouseUrl("I315820005")).toBe(
      "https://piscines-toulouse.fr/piscine/villefranche-de-lauragais",
    );
    expect(toulouseUrl("I310440003")).toBe("https://piscines-toulouse.fr/piscine/balma");
    expect(toulouseUrl("I999999999")).toBeNull();
  });
});

describe("isOpenNowLive", () => {
  const status = {
    openToday: true,
    slots: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "19:30" },
    ],
    closureReason: null,
    url: "",
    updatedAt: "",
  };
  const at = (h: number, m = 0) => new Date(2026, 8, 21, h, m);

  it("ouverte pendant un créneau, bornes comprises côté début", () => {
    expect(isOpenNowLive(status, at(9))).toBe(true);
    expect(isOpenNowLive(status, at(19, 29))).toBe(true);
  });
  it("fermée entre les créneaux et à l'heure de fermeture", () => {
    expect(isOpenNowLive(status, at(13))).toBe(false);
    expect(isOpenNowLive(status, at(12))).toBe(false);
  });
  it("fermée toute la journée", () => {
    expect(isOpenNowLive({ ...status, openToday: false }, at(10))).toBe(false);
  });
});

describe("formatSlotTime", () => {
  it("« 12:00 » → « 12h », « 09:30 » → « 9h30 »", () => {
    expect(formatSlotTime("12:00")).toBe("12h");
    expect(formatSlotTime("09:30")).toBe("9h30");
  });
});
