import { nightsBetween, todayISO } from "./dates.js";

export function validateSearch({ checkIn, checkOut, guests }) {
  const errors = {};
  const today = todayISO();

  if (!checkIn) {
    errors.checkIn = "Choose a check-in date.";
  } else if (checkIn < today) {
    errors.checkIn = "Check-in cannot be in the past.";
  }

  if (!checkOut) {
    errors.checkOut = "Choose a check-out date.";
  } else if (checkIn && !errors.checkIn && nightsBetween(checkIn, checkOut) < 1) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  const count = Number(guests);
  if (!Number.isInteger(count) || count < 1) {
    errors.guests = "Add at least 1 guest.";
  } else if (count > 8) {
    errors.guests = "You can search for up to 8 guests.";
  }

  return errors;
}

export function validateGuest({ fullName, email, phone, requests }) {
  const errors = {};
  const name = (fullName || "").trim();
  const mail = (email || "").trim();
  const digits = (phone || "").replace(/\D/g, "");
  const note = (requests || "").trim();

  if (!/^[\p{L}][\p{L}\s'.-]{1,60}$/u.test(name)) {
    errors.fullName = "Enter a full name using letters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
    errors.email = "Enter a valid email address.";
  }

  if (digits.length < 8 || digits.length > 15) {
    errors.phone = "Enter a phone number with 8 to 15 digits.";
  }

  if (note.length > 240) {
    errors.requests = "Keep requests to 240 characters.";
  }

  return errors;
}
