import { Link } from "react-router-dom";
import { nightsBetween } from "../utils/dates";
import { formatMoney, nightLabel } from "../utils/format";
import { calculateStay } from "../utils/pricing";
import Icon from "./Icon";
import Photo from "./Photo";

export default function HotelCard({ hotel, search, style }) {
  const ready = nightsBetween(search.checkIn, search.checkOut) > 0;
  const price = ready
    ? calculateStay({
        nightlyRate: hotel.priceFrom,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests,
      })
    : null;

  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card rise" style={style}>
      <div className="media">
        <Photo src={hotel.photos[0]} alt={`${hotel.name} in ${hotel.city}`} />
        <span className="type-chip">{hotel.type}</span>
        <span className="rating-pill">
          <Icon name="star" />
          {hotel.rating.toFixed(1)}
        </span>
      </div>
      <div className="hotel-body">
        <p className="hotel-loc">
          <Icon name="pin" />
          {hotel.location}
        </p>
        <h3>{hotel.name}</h3>
        <p className="amenity-line">{hotel.amenities.slice(0, 3).join(" · ")}</p>
        <p className="price">
          <strong>{formatMoney(hotel.priceFrom)}</strong>
          <span>/ night</span>
        </p>
        {price && price.nights > 0 ? (
          <p className="price-note">
            From {formatMoney(price.total)} for {nightLabel(price.nights)}
          </p>
        ) : null}
        <span className="view-link">
          View stay <Icon name="arrow" />
        </span>
      </div>
    </Link>
  );
}
