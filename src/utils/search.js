import { addDays, nightsBetween, todayISO } from "./dates.js";

export function defaultDates() {
  const checkIn = addDays(todayISO(), 14);
  return {
    checkIn,
    checkOut: addDays(checkIn, 3),
  };
}

export function buildStaySearch(current = {}, overrides = {}, options = {}) {
  const today = todayISO();
  const valid =
    current.checkIn &&
    current.checkOut &&
    current.checkIn >= today &&
    nightsBetween(current.checkIn, current.checkOut) > 0;
  const dates = valid
    ? { checkIn: current.checkIn, checkOut: current.checkOut }
    : options.fillDates
      ? defaultDates()
      : { checkIn: current.checkIn || "", checkOut: current.checkOut || "" };

  const guests = Number(overrides.guests ?? current.guests ?? 2);

  return {
    location: overrides.location ?? current.location ?? "",
    checkIn: overrides.checkIn ?? dates.checkIn,
    checkOut: overrides.checkOut ?? dates.checkOut,
    guests: Number.isInteger(guests) ? Math.min(8, Math.max(1, guests)) : 2,
  };
}

export function toQuery(search) {
  const params = new URLSearchParams();
  if (search.location) params.set("location", search.location);
  if (search.checkIn) params.set("checkIn", search.checkIn);
  if (search.checkOut) params.set("checkOut", search.checkOut);
  params.set("guests", String(search.guests || 2));
  return params.toString();
}

export function parseQuery(params) {
  const guests = Number(params.get("guests"));
  return {
    location: params.get("location") || "",
    checkIn: params.get("checkIn") || "",
    checkOut: params.get("checkOut") || "",
    guests: Number.isInteger(guests) && guests >= 1 && guests <= 8 ? guests : 2,
  };
}
