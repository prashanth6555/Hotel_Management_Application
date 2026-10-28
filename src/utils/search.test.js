import { describe, expect, it } from "vitest";
import { nightsBetween } from "./dates.js";
import { buildStaySearch, parseQuery, toQuery } from "./search.js";

describe("search helpers", () => {
  it("fills dates only when asked", () => {
    const stay = buildStaySearch({ guests: 4 }, { location: "Kyoto" }, { fillDates: true });
    expect(stay.location).toBe("Kyoto");
    expect(stay.guests).toBe(4);
    expect(nightsBetween(stay.checkIn, stay.checkOut)).toBe(3);
  });

  it("keeps a valid existing stay", () => {
    const stay = buildStaySearch(
      { location: "Rome", checkIn: "2027-01-01", checkOut: "2027-01-05", guests: 2 },
      { location: "Kyoto" },
      { fillDates: true },
    );
    expect(stay.checkIn).toBe("2027-01-01");
    expect(stay.checkOut).toBe("2027-01-05");
    expect(stay.location).toBe("Kyoto");
  });

  it("round-trips a search through the query string", () => {
    const search = { location: "Aspen", checkIn: "2027-02-02", checkOut: "2027-02-06", guests: 3 };
    const parsed = parseQuery(new URLSearchParams(toQuery(search)));
    expect(parsed).toEqual(search);
  });
});
