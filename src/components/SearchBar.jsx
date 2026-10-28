import { useEffect, useId, useState } from "react";
import { locationSuggestions } from "../data/hotels";
import { addDays, todayISO } from "../utils/dates";
import { validateSearch } from "../utils/validation";
import GuestStepper from "./GuestStepper";
import Icon from "./Icon";

export default function SearchBar({ value, onSearch, variant = "hero" }) {
  const formId = useId();
  const [location, setLocation] = useState(value.location || "");
  const [checkIn, setCheckIn] = useState(value.checkIn || "");
  const [checkOut, setCheckOut] = useState(value.checkOut || "");
  const [guests, setGuests] = useState(value.guests || 2);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocation(value.location || "");
    setCheckIn(value.checkIn || "");
    setCheckOut(value.checkOut || "");
    setGuests(value.guests || 2);
  }, [value.location, value.checkIn, value.checkOut, value.guests]);

  function update(setter, field, next) {
    setter(next);
    setErrors((current) => {
      if (!current[field]) return current;
      const copy = { ...current };
      delete copy[field];
      return copy;
    });
  }

  function submit(event) {
    event.preventDefault();
    const next = {
      location: location.trim(),
      checkIn,
      checkOut,
      guests,
    };
    const nextErrors = validateSearch(next);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSearch(next);
  }

  const errorItems = Object.entries(errors);

  return (
    <form className={`search-form search-form--${variant}`} onSubmit={submit} noValidate>
      <div className="search-field">
        <label htmlFor={`${formId}-where`}>Where</label>
        <input
          id={`${formId}-where`}
          list={`${formId}-places`}
          value={location}
          placeholder="Anywhere"
          autoComplete="off"
          onChange={(event) => update(setLocation, "location", event.target.value)}
        />
        <datalist id={`${formId}-places`}>
          {locationSuggestions.map((place) => (
            <option key={place} value={place} />
          ))}
        </datalist>
      </div>
      <div className={errors.checkIn ? "search-field has-error" : "search-field"}>
        <label htmlFor={`${formId}-in`}>Check in</label>
        <input
          id={`${formId}-in`}
          type="date"
          value={checkIn}
          min={todayISO()}
          onChange={(event) => update(setCheckIn, "checkIn", event.target.value)}
        />
      </div>
      <div className={errors.checkOut ? "search-field has-error" : "search-field"}>
        <label htmlFor={`${formId}-out`}>Check out</label>
        <input
          id={`${formId}-out`}
          type="date"
          value={checkOut}
          min={checkIn ? addDays(checkIn, 1) : todayISO()}
          onChange={(event) => update(setCheckOut, "checkOut", event.target.value)}
        />
      </div>
      <div className={errors.guests ? "search-field has-error" : "search-field"}>
        <span className="field-label">Guests</span>
        <GuestStepper value={guests} onChange={(next) => update(setGuests, "guests", next)} />
      </div>
      <button className="btn search-submit" type="submit">
        <Icon name="search" />
        Search
      </button>
      {errorItems.length > 0 ? (
        <div className="search-errors" role="alert">
          {errorItems.map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      ) : null}
    </form>
  );
}
