import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import PriceBreakdown from "../components/PriceBreakdown";
import TripEditor from "../components/TripEditor";
import { useAppState } from "../context/AppState";
import { getHotel, getRoom } from "../data/hotels";
import { useTitle } from "../hooks/useTitle";
import { buildBooking } from "../utils/booking";
import { formatDate } from "../utils/dates";
import { formatMoney, guestLabel } from "../utils/format";
import { calculateStay, EXTRA_GUEST_FEE, INCLUDED_GUESTS } from "../utils/pricing";
import { parseQuery, toQuery } from "../utils/search";
import { validateGuest, validateSearch } from "../utils/validation";

const emptyGuest = {
  fullName: "",
  email: "",
  phone: "",
  requests: "",
  policy: false,
};

export default function Booking() {
  const { hotelId, roomId } = useParams();
  const [params, setSearchParams] = useSearchParams();
  const { search, setSearch, addBooking } = useAppState();
  const hotel = getHotel(hotelId);
  const room = getRoom(hotel, roomId);
  const queryString = params.toString();
  const stay = queryString ? parseQuery(params) : search;
  const [guest, setGuest] = useState(emptyGuest);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);

  useTitle(hotel && room ? `Book ${hotel.name} · Velora` : "Booking · Velora");

  useEffect(() => {
    if (!queryString) return;
    setSearch(parseQuery(new URLSearchParams(queryString)));
  }, [queryString, setSearch]);

  if (!hotel || !room) {
    return (
      <main className="page empty page-inline">
        <h1>We could not find that room.</h1>
        <p>It may have been removed from the collection.</p>
        <Link to="/hotels" className="btn">
          Browse stays
        </Link>
      </main>
    );
  }

  const price = calculateStay({
    nightlyRate: room.price,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    guests: stay.guests,
  });
  const dateErrors = validateSearch(stay);
  const capacityError =
    room.maxGuests < Number(stay.guests)
      ? `This room sleeps ${room.maxGuests}. Lower the guest count or choose another room.`
      : "";
  const visibleErrors = {
    ...errors,
    ...dateErrors,
    ...(capacityError ? { capacity: capacityError } : {}),
  };

  function changeStay(partial) {
    const next = { ...stay, ...partial };
    setSearch(next);
    setSearchParams(new URLSearchParams(toQuery(next)), { replace: true });
    setErrors((current) => {
      const copy = { ...current };
      delete copy.checkIn;
      delete copy.checkOut;
      delete copy.guests;
      delete copy.capacity;
      return copy;
    });
  }

  function updateGuest(field, value) {
    setGuest((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const copy = { ...current };
      delete copy[field];
      return copy;
    });
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {
      ...validateSearch(stay),
      ...validateGuest(guest),
    };
    if (capacityError) nextErrors.capacity = capacityError;
    if (!guest.policy) nextErrors.policy = "Please accept the cancellation policy to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const booking = buildBooking({ hotel, room, stay, guest, price });
    addBooking(booking);
    setConfirmed(booking);
  }

  if (confirmed) {
    return (
      <main className="page book-success">
        <div className="success-mark">
          <Icon name="check" />
        </div>
        <p className="eyebrow">Booking confirmed</p>
        <h1>You are booked.</h1>
        <p className="confirm-code">{confirmed.id}</p>
        <p>
          {confirmed.hotelName} · {confirmed.roomName}
        </p>
        <p>
          {formatDate(confirmed.checkIn)} – {formatDate(confirmed.checkOut)} · {guestLabel(confirmed.guests)}
        </p>
        <p>Total {formatMoney(confirmed.total)}</p>
        <p className="muted">Saved for {confirmed.guestName} in My Bookings on this browser.</p>
        <div className="button-row">
          <Link className="btn" to="/bookings">
            View my bookings
          </Link>
          <Link className="btn btn-ghost" to="/hotels">
            Browse more stays
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page booking-page">
      <div className="page-inline booking-intro">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/hotels/${hotel.id}`}> {hotel.name}</Link>
          <span aria-hidden="true">/</span>
          <span>Book</span>
        </nav>
        <h1>Confirm your stay</h1>
        <p className="lede">The total updates as you change dates and guests.</p>
      </div>

      <div className="book-layout page-inline">
        <form id="booking-form" className="panel" onSubmit={submit} noValidate>
          <h2>Guest details</h2>
          <label className="field" htmlFor="fullName">
            Full name
            <input
              id="fullName"
              value={guest.fullName}
              autoComplete="name"
              onChange={(event) => updateGuest("fullName", event.target.value)}
              aria-invalid={Boolean(visibleErrors.fullName)}
            />
            {visibleErrors.fullName ? <small className="field-error">{visibleErrors.fullName}</small> : null}
          </label>
          <label className="field" htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={guest.email}
              autoComplete="email"
              onChange={(event) => updateGuest("email", event.target.value)}
              aria-invalid={Boolean(visibleErrors.email)}
            />
            {visibleErrors.email ? <small className="field-error">{visibleErrors.email}</small> : null}
          </label>
          <label className="field" htmlFor="phone">
            Phone
            <input
              id="phone"
              type="tel"
              value={guest.phone}
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              onChange={(event) => updateGuest("phone", event.target.value)}
              aria-invalid={Boolean(visibleErrors.phone)}
            />
            {visibleErrors.phone ? <small className="field-error">{visibleErrors.phone}</small> : null}
          </label>
          <label className="field" htmlFor="requests">
            Special requests
            <textarea
              id="requests"
              value={guest.requests}
              maxLength={240}
              rows={4}
              placeholder="Arrival time, extra pillows, a quiet room"
              onChange={(event) => updateGuest("requests", event.target.value)}
            />
            <small className="muted">{guest.requests.trim().length}/240</small>
            {visibleErrors.requests ? <small className="field-error">{visibleErrors.requests}</small> : null}
          </label>
          <label className="check-row">
            <input
              type="checkbox"
              checked={guest.policy}
              onChange={(event) => updateGuest("policy", event.target.checked)}
            />
            <span>I understand I can cancel this stay from My Bookings any time before check-in.</span>
          </label>
          {visibleErrors.policy ? <p className="field-error">{visibleErrors.policy}</p> : null}
        </form>

        <aside className="panel stay-card">
          <div className="summary-hotel">
            <Photo src={hotel.photos[0]} alt="" />
            <div>
              <p className="eyebrow">{hotel.city}</p>
              <h2>{hotel.name}</h2>
              <p>{room.name}</p>
            </div>
          </div>
          <TripEditor value={stay} onChange={changeStay} errors={visibleErrors} />
          <PriceBreakdown price={price} roomName={room.name} />
          <p className="fine-print">
            Includes the room, a ${EXTRA_GUEST_FEE} nightly fee after {INCLUDED_GUESTS} guests, and taxes.
          </p>
          <button form="booking-form" className="btn btn-block" type="submit">
            Confirm booking
          </button>
          <Link className="text-link dark" to={`/hotels/${hotel.id}`}>
            Choose a different room
          </Link>
        </aside>
      </div>
    </main>
  );
}
