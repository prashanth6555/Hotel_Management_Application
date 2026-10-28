import { describe, expect, it } from "vitest";
import { addDays, nightsBetween } from "./dates.js";
import { calculateStay } from "./pricing.js";

describe("calculateStay", () => {
  it("prices a stay for the included guests", () => {
    const price = calculateStay({
      nightlyRate: 200,
      checkIn: "2027-04-10",
      checkOut: "2027-04-12",
      guests: 2,
    });

    expect(price.nights).toBe(2);
    expect(price.roomTotal).toBe(400);
    expect(price.extraFee).toBe(0);
    expect(price.taxes).toBe(48);
    expect(price.total).toBe(448);
  });

  it("adds a nightly fee for each guest beyond two", () => {
    const price = calculateStay({
      nightlyRate: 200,
      checkIn: "2027-04-10",
      checkOut: "2027-04-12",
      guests: 5,
    });

    expect(price.extraGuests).toBe(3);
    expect(price.extraFee).toBe(150);
    expect(price.subtotal).toBe(550);
    expect(price.taxes).toBe(66);
    expect(price.total).toBe(616);
  });

  it("returns zero nights when the dates are not a stay", () => {
    expect(
      calculateStay({
        nightlyRate: 420,
        checkIn: "2027-04-10",
        checkOut: "2027-04-10",
        guests: 2,
      }).nights,
    ).toBe(0);
    expect(nightsBetween("2027-05-02", "2027-05-01")).toBe(0);
  });

  it("counts nights across a month boundary", () => {
    expect(nightsBetween("2026-10-28", "2026-11-02")).toBe(5);
    expect(addDays("2026-10-28", 5)).toBe("2026-11-02");
  });
});
