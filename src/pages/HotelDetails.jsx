import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import PriceBreakdown from "../components/PriceBreakdown";
import RoomCard from "../components/RoomCard";
import TripEditor from "../components/TripEditor";
import { useAppState } from "../context/AppState";
import { getHotel } from "../data/hotels";
import { useTitle } from "../hooks/useTitle";
import { amenityIcon } from "../utils/amenities";
import { calculateStay, EXTRA_GUEST_FEE, INCLUDED_GUESTS } from "../utils/pricing";
import { toQuery } from "../utils/search";
import { validateSearch } from "../utils/validation";

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = getHotel(id);
  const { search, setSearch } = useAppState();
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [roomId, setRoomId] = useState(hotel?.rooms[0]?.id || "");
  const [attempted, setAttempted] = useState(false);

  useTitle(hotel ? `${hotel.name} · Velora` : "Stay not found · Velora");

  useEffect(() => {
    setActivePhoto(0);
    setLightbox(false);
    setAttempted(false);
  }, [id]);

  useEffect(() => {
    if (!hotel) return;
    setRoomId((current) => {
      const currentRoom = hotel.rooms.find((room) => room.id === current);
      if (currentRoom && currentRoom.maxGuests >= Number(search.guests)) return current;
      const fit = hotel.rooms.find((room) => room.maxGuests >= Number(search.guests));
      return (fit || hotel.rooms[0]).id;
    });
  }, [hotel, search.guests]);

  useEffect(() => {
    if (!lightbox || !hotel) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") {
        setActivePhoto((index) => (index + 1) % hotel.photos.length);
      }
      if (event.key === "ArrowLeft") {
        setActivePhoto((index) => (index - 1 + hotel.photos.length) % hotel.photos.length);
      }
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, hotel]);

  if (!hotel) {
    return (
      <main className="page empty page-inline">
        <h1>That stay is no longer listed.</h1>
        <p>Browse the collection to find another.</p>
        <Link to="/hotels" className="btn">
          Browse stays
        </Link>
      </main>
    );
  }

  const room = hotel.rooms.find((item) => item.id === roomId) || hotel.rooms[0];
  const price = calculateStay({
    nightlyRate: room.price,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    guests: search.guests,
  });
  const dateErrors = validateSearch(search);
  const capacityError =
    room.maxGuests < Number(search.guests)
      ? `This room sleeps ${room.maxGuests}. Choose another room or fewer guests.`
      : "";
  const showErrors = attempted || Boolean(search.checkIn || search.checkOut);
  const visibleErrors = showErrors ? { ...dateErrors, ...(capacityError ? { capacity: capacityError } : {}) } : {};

  function changeStay(partial) {
    setSearch({ ...search, ...partial });
  }

  function stepPhoto(delta) {
    setActivePhoto((index) => (index + delta + hotel.photos.length) % hotel.photos.length);
  }

  function reserve() {
    const nextErrors = { ...validateSearch(search) };
    if (capacityError) nextErrors.capacity = capacityError;
    if (Object.keys(nextErrors).length) {
      setAttempted(true);
      return;
    }
    navigate(`/book/${hotel.id}/${room.id}?${toQuery(search)}`);
  }

  return (
    <main className="page">
      <div className="details-layout">
        <div className="gallery-wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/hotels">Stays</Link>
            <span aria-hidden="true">/</span>
            <span>{hotel.name}</span>
          </nav>
          <div className="gallery">
            <div className="gallery-main">
              <Photo src={hotel.photos[activePhoto]} alt={`${hotel.name} photo ${activePhoto + 1}`} priority />
              <button type="button" className="gallery-nav prev" onClick={() => stepPhoto(-1)} aria-label="Previous photo">
                ‹
              </button>
              <button type="button" className="gallery-nav next" onClick={() => stepPhoto(1)} aria-label="Next photo">
                ›
              </button>
              <button type="button" className="gallery-expand" onClick={() => setLightbox(true)}>
                View photo
              </button>
            </div>
          </div>
          <div className="thumbs">
            {hotel.photos.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                className={index === activePhoto ? "is-active" : ""}
                onClick={() => setActivePhoto(index)}
                aria-label={`Show photo ${index + 1}`}
              >
                <Photo src={src} alt="" />
              </button>
            ))}
          </div>
          <header className="details-heading">
            <p className="eyebrow">{hotel.type}</p>
            <h1>{hotel.name}</h1>
            <p className="details-meta">
              <Icon name="pin" />
              {hotel.location}, {hotel.country}
              <span className="rating-inline">
                <Icon name="star" />
                {hotel.rating.toFixed(1)} · {hotel.reviews} reviews
              </span>
            </p>
          </header>
        </div>

        <aside className="stay-card">
          <h2>Your stay</h2>
          <TripEditor value={search} onChange={changeStay} errors={visibleErrors} />
          <PriceBreakdown price={price} roomName={room.name} />
          <p className="fine-print">
            The first {INCLUDED_GUESTS} guests are included. Each extra guest is ${EXTRA_GUEST_FEE} per night.
          </p>
          <button type="button" className="btn btn-block" onClick={reserve}>
            Reserve {room.name}
          </button>
        </aside>

        <div className="details-primary">
          <p className="details-copy">{hotel.description}</p>
          <ul className="highlights">
            {hotel.highlights.map((item) => (
              <li key={item}>
                <Icon name="check" />
                {item}
              </li>
            ))}
          </ul>

          <section className="block">
            <h2>Amenities</h2>
            <div className="amenity-grid">
              {hotel.amenities.map((amenity) => (
                <div key={amenity} className="amenity">
                  <Icon name={amenityIcon(amenity)} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="block">
            <h2>Rooms</h2>
            <div className="room-list">
              {hotel.rooms.map((item) => (
                <RoomCard
                  key={item.id}
                  room={item}
                  guests={search.guests}
                  selected={item.id === room.id}
                  onSelect={setRoomId}
                />
              ))}
            </div>
          </section>

          <section className="block">
            <h2>Guest notes</h2>
            <div className="review-grid">
              {hotel.guestReviews.map((review) => (
                <article key={review.name} className="review">
                  <p className="review-top">
                    <strong>{review.name}</strong>
                    <span>
                      <Icon name="star" /> {review.rating}.0
                    </span>
                  </p>
                  <p>{review.text}</p>
                  <p className="muted">{review.date}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {lightbox ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${hotel.name} photo`} onClick={() => setLightbox(false)}>
          <button type="button" className="lightbox-close" aria-label="Close photo" onClick={() => setLightbox(false)}>
            <Icon name="close" />
          </button>
          <img
            src={hotel.photos[activePhoto]}
            alt={`${hotel.name} photo ${activePhoto + 1}`}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </main>
  );
}
