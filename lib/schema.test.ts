import { describe, expect, it } from "vitest";
import { parseOpeningHours } from "./opening-hours";
import { openingHoursSpec } from "./schema";

describe("openingHoursSpec", () => {
  it("une spécification par créneau, jours schema.org", () => {
    const parsed = parseOpeningHours("Mo-Tu 09:00-19:00; Sa 10:00-12:30,14:00-18:00")!;
    const spec = openingHoursSpec(parsed.week);
    expect(spec).toHaveLength(4);
    expect(spec[0]).toEqual({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "https://schema.org/Monday",
      opens: "09:00",
      closes: "19:00",
    });
    expect(spec[3]).toMatchObject({ dayOfWeek: "https://schema.org/Saturday", opens: "14:00", closes: "18:00" });
  });
  it("24/7 : minuit devient 23:59", () => {
    const spec = openingHoursSpec(parseOpeningHours("24/7")!.week);
    expect(spec[0]).toMatchObject({ opens: "00:00", closes: "23:59" });
  });
});
