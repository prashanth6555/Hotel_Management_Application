import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Photo from "../components/Photo";
import { useAppState } from "../context/AppState";
import { useTitle } from "../hooks/useTitle";
import { formatDate, formatWhen } from "../utils/dates";
import { formatMoney, guestLabel, nightLabel } from "../utils/format";

export default function MyBookings() {
  const { bookings, cancelBooking } = useAppState();
  const [pending, setPending] = useState(null);
  useTitle("My bookings · Velora");

  const confirmed = bookings.filter((booking) => booking.status === "confirmed");
  const cancelled = bookings.filter((booking) => booking.status === "cancelled");

  return (
    <main className="page bookings-page page-inline">
      <header className="page-intro">
        <p className="eyebrow">Your stays</p>
        <h1>My bookings</h1>
        <p className="lede">Confirmations are saved in this browser. Cancel a stay any time before you travel.</p>
      </header>

      {bookings.length === 0 ? (
        <section className="empty">
          <h2>No stays saved yet.</h2>
          <p>When you confirm a room, it will appear here.</p>
          <Link to="/hotels" className="btn">
            Browse stays
          </Link>
        </section>
      ) : null}

      {confirmed.length > 0 ? (
        <section className="block">
          <h2>Confirmed</h2>
          <div className="booking-list">
            {confirmed.map((booking) => (
              <BookingCard key={booking.id} booking={booking} onCancel={() => setPending(booking)} />
            ))}
          </div>
        </section>
      ) : null}

      {cancelled.length > 0 ? (
        <section className="block">
          <h2>Cancelled</h2>
          <div className="booking-list">
            {cancelled.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      ) : null}

      {pending ? (
        <Modal title="Cancel this stay?" onClose={() => setPending(null)}>
          <p>
            {pending.hotelName}, {pending.roomName} ({pending.id}) will be marked cancelled. The record stays in this browser.
          </p>
          <div className="button-row">
            <button
              type="button"
              className="btn btn-danger-solid"
              onClick={() => {
                cancelBooking(pending.id);
                setPending(null);
              }}
            >
              Cancel booking
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPending(null)}>
              Keep booking
            </button>
          </div>
        </Modal>
      ) : null}
    </main>
  );
}

function BookingCard({ booking, onCancel }) {
  const cancelled = booking.status === "cancelled";

  return (
    <article className={cancelled ? "booking-card is-cancelled" : "booking-card"}>
      <div className="booking-media">
        <Photo src={booking.hotelImage} alt="" />
      </div>
      <div className="booking-copy">
        <div className="booking-top">
          <p className="eyebrow">{booking.city}</p>
          <span className={cancelled ? "status status-cancelled" : "status status-confirmed"}>
            {cancelled ? "Cancelled" : "Confirmed"}
          </span>
        </div>
        <h3>{booking.hotelName}</h3>
        <p>{booking.roomName}</p>
        <p>
          {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} · {nightLabel(booking.nights)} · {guestLabel(booking.guests)}
        </p>
        <p className="booking-total">{formatMoney(booking.total)}</p>
        <dl className="booking-meta">
          <div>
            <dt>Confirmation</dt>
            <dd>{booking.id}</dd>
          </div>
          <div>
            <dt>Guest</dt>
            <dd>{booking.guestName}</dd>
          </div>
          <div>
            <dt>Booked</dt>
            <dd>{formatWhen(booking.createdAt)}</dd>
          </div>
        </dl>
        {booking.requests ? <p className="note">Request: {booking.requests}</p> : null}
        <div className="button-row">
          <Link className="btn btn-ghost" to={`/hotels/${booking.hotelId}`}>
            View stay
          </Link>
          {onCancel ? (
            <button type="button" className="btn btn-danger" onClick={onCancel}>
              Cancel booking
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
