export const SEARCH_KEY = "velora-search";
export const BOOKINGS_KEY = "velora-bookings";

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full disk should not block the page.
  }
}

function isDate(value) {
  return value === "" || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export function defaultSearch() {
  return { location: "", checkIn: "", checkOut: "", guests: 2 };
}

export function loadSearch() {
  const data = readStorage(SEARCH_KEY, null);
  if (!data || typeof data !== "object") return defaultSearch();
  const guests = Number(data.guests);
  return {
    location: typeof data.location === "string" ? data.location : "",
    checkIn: isDate(data.checkIn) ? data.checkIn : "",
    checkOut: isDate(data.checkOut) ? data.checkOut : "",
    guests: Number.isInteger(guests) ? Math.min(8, Math.max(1, guests)) : 2,
  };
}

function isBooking(value) {
  return Boolean(
    value &&
      typeof value.id === "string" &&
      typeof value.hotelName === "string" &&
      typeof value.roomName === "string" &&
      typeof value.checkIn === "string" &&
      typeof value.total === "number",
  );
}

export function loadBookings() {
  const data = readStorage(BOOKINGS_KEY, []);
  if (!Array.isArray(data)) return [];
  return data.filter(isBooking).map((booking) => ({
    ...booking,
    status: booking.status === "cancelled" ? "cancelled" : "confirmed",
  }));
}
