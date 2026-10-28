const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createBookingId() {
  let body = "";
  for (let index = 0; index < 6; index += 1) {
    body += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `VL-${body}`;
}

export function buildBooking({ hotel, room, stay, guest, price }) {
  return {
    id: createBookingId(),
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelImage: hotel.photos[0],
    city: hotel.city,
    country: hotel.country,
    roomId: room.id,
    roomName: room.name,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    guests: Number(stay.guests),
    nights: price.nights,
    nightlyRate: price.nightlyRate,
    extraFee: price.extraFee,
    taxes: price.taxes,
    total: price.total,
    guestName: guest.fullName.trim(),
    email: guest.email.trim(),
    phone: guest.phone.trim(),
    requests: guest.requests.trim(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}
