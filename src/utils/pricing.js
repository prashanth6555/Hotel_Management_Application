import { nightsBetween } from "./dates.js";

export const EXTRA_GUEST_FEE = 25;
export const INCLUDED_GUESTS = 2;
export const TAX_RATE = 0.12;

export function calculateStay({ nightlyRate, checkIn, checkOut, guests }) {
  const nights = nightsBetween(checkIn, checkOut);
  const guestsNum = Number(guests) || 0;
  const rate = Number(nightlyRate) || 0;
  const extraGuests = Math.max(0, guestsNum - INCLUDED_GUESTS);
  const roomTotal = nights * rate;
  const extraFee = extraGuests * EXTRA_GUEST_FEE * nights;
  const subtotal = roomTotal + extraFee;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  return {
    nights,
    nightlyRate: rate,
    guests: guestsNum,
    extraGuests,
    extraFee,
    roomTotal,
    subtotal,
    taxes,
    total,
  };
}
