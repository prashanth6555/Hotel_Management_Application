import { describe, expect, it } from "vitest";
import { addDays, todayISO } from "./dates.js";
import { validateGuest, validateSearch } from "./validation.js";

describe("validateSearch", () => {
  it("accepts a future stay", () => {
    const checkIn = addDays(todayISO(), 10);
    const checkOut = addDays(checkIn, 3);
    expect(validateSearch({ checkIn, checkOut, guests: 2 })).toEqual({});
  });

  it("requires dates and a real stay length", () => {
    const errors = validateSearch({ checkIn: "", checkOut: "", guests: 2 });
    expect(errors.checkIn).toMatch(/check-in/i);
    expect(errors.checkOut).toMatch(/check-out/i);
  });

  it("rejects a check-out on or before check-in", () => {
    const checkIn = addDays(todayISO(), 4);
    const errors = validateSearch({ checkIn, checkOut: checkIn, guests: 2 });
    expect(errors.checkOut).toMatch(/after/i);
  });

  it("rejects a past check-in", () => {
    const checkIn = addDays(todayISO(), -2);
    const errors = validateSearch({
      checkIn,
      checkOut: addDays(todayISO(), 2),
      guests: 2,
    });
    expect(errors.checkIn).toMatch(/past/i);
  });

  it("limits the guest count", () => {
    const checkIn = addDays(todayISO(), 2);
    const checkOut = addDays(checkIn, 1);
    expect(validateSearch({ checkIn, checkOut, guests: 0 }).guests).toBeTruthy();
    expect(validateSearch({ checkIn, checkOut, guests: 9 }).guests).toBeTruthy();
  });
});

describe("validateGuest", () => {
  it("accepts a normal guest", () => {
    expect(
      validateGuest({
        fullName: "José Martin",
        email: "jose@example.com",
        phone: "+1 (555) 123-4567",
        requests: "Late arrival",
      }),
    ).toEqual({});
  });

  it("rejects a short name, a broken email, and a short phone number", () => {
    const errors = validateGuest({
      fullName: "A",
      email: "not-an-email",
      phone: "123",
      requests: "",
    });
    expect(errors.fullName).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
  });

  it("rejects notes that are too long", () => {
    const errors = validateGuest({
      fullName: "Mary Jane",
      email: "mary@example.com",
      phone: "5551234567",
      requests: "a".repeat(241),
    });
    expect(errors.requests).toBeTruthy();
  });
});
