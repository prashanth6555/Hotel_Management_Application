import { formatMoney } from "../utils/format";
import Photo from "./Photo";

export default function RoomCard({ room, selected, guests, onSelect }) {
  const fits = room.maxGuests >= Number(guests);

  return (
    <article className={`room-card ${selected ? "is-selected" : ""} ${fits ? "" : "is-disabled"}`}>
      <div className="room-media">
        <Photo src={room.image} alt="" />
      </div>
      <div className="room-copy">
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <p className="room-meta">
          {room.beds} · {room.size} · {room.view} · Sleeps {room.maxGuests}
        </p>
        {fits ? null : <p className="room-note">This room sleeps {room.maxGuests}. Your stay has {guests} guests.</p>}
      </div>
      <div className="room-price">
        <p>
          <strong>{formatMoney(room.price)}</strong>
          <span> / night</span>
        </p>
        <button type="button" className={selected ? "btn btn-gold" : "btn"} disabled={!fits} onClick={() => onSelect(room.id)}>
          {selected ? "Selected" : fits ? "Select room" : `Sleeps ${room.maxGuests}`}
        </button>
      </div>
    </article>
  );
}
