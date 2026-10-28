import { describe, expect, it } from "vitest";
import { buildBooking, createBookingId } from "./booking.js";

describe("booking ids", () => {
  it("creates a readable confirmation code", () => {
    expect(createBookingId()).toMatch(/^VL-[A-Z2-9]{6}$/);
  });

  it("snapshots the price onto the booking", () => {
    const booking = buildBooking({
      hotel: {
        id: "caldera-house",
        name: "Caldera House",
        photos: ["photo.jpg"],
        city: "Santorini",
        country: "Greece",
      },
      room: { id: "cave-suite", name: "Cave Suite" },
      stay: { checkIn: "2027-06-01", checkOut: "2027-06-04", guests: 2 },
      guest: {
        fullName: "  Maya Ellison ",
        email: " maya@example.com ",
        phone: " 5551234567 ",
        requests: " High floor ",
      },
      price: { nights: 3, nightlyRate: 420, extraFee: 0, taxes: 151, total: 1411 },
    });

    expect(booking.guestName).toBe("Maya Ellison");
    expect(booking.email).toBe("maya@example.com");
    expect(booking.total).toBe(1411);
    expect(booking.status).toBe("confirmed");
    expect(booking.id).toMatch(/^VL-/);
  });
});
