import { addDays, todayISO } from "../utils/dates";
import GuestStepper from "./GuestStepper";

export default function TripEditor({ value, onChange, errors = {} }) {
  return (
    <div className="trip-editor">
      <label className={errors.checkIn ? "field has-error" : "field"}>
        <span>Check in</span>
        <input
          type="date"
          value={value.checkIn}
          min={todayISO()}
          onChange={(event) => onChange({ checkIn: event.target.value })}
        />
        {errors.checkIn ? <small className="field-error">{errors.checkIn}</small> : null}
      </label>
      <label className={errors.checkOut ? "field has-error" : "field"}>
        <span>Check out</span>
        <input
          type="date"
          value={value.checkOut}
          min={value.checkIn ? addDays(value.checkIn, 1) : todayISO()}
          onChange={(event) => onChange({ checkOut: event.target.value })}
        />
        {errors.checkOut ? <small className="field-error">{errors.checkOut}</small> : null}
      </label>
      <div className={errors.guests || errors.capacity ? "field has-error" : "field"}>
        <span>Guests</span>
        <GuestStepper value={Number(value.guests) || 1} onChange={(guests) => onChange({ guests })} />
        {errors.guests ? <small className="field-error">{errors.guests}</small> : null}
        {errors.capacity ? <small className="field-error">{errors.capacity}</small> : null}
      </div>
    </div>
  );
}
