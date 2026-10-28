import { useNavigate } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import Icon from "../components/Icon";
import Photo from "../components/Photo";
import SearchBar from "../components/SearchBar";
import { useAppState } from "../context/AppState";
import { destinations, EDITORIAL_PHOTO, getFeaturedHotels, HERO_PHOTO } from "../data/hotels";
import { useGoToStays, useOpenDestination } from "../hooks/useOpenDestination";
import { useTitle } from "../hooks/useTitle";
import { toQuery } from "../utils/search";

const reassurances = [
  {
    icon: "check",
    title: "Cancel in one tap",
    text: "Every stay can be cancelled from My Bookings before check-in.",
  },
  {
    icon: "calendar",
    title: "A total you can see",
    text: "The price updates as you change dates, guests, and rooms.",
  },
  {
    icon: "bed",
    title: "Rooms, not just hotels",
    text: "Choose the room that fits, then confirm with your details.",
  },
  {
    icon: "pin",
    title: "A short collection",
    text: "Cliff houses, city riads, lodges, and quiet resorts.",
  },
];

const steps = [
  {
    number: "01",
    title: "Search",
    text: "Set a destination, dates, and guests. Leave the place blank to see the full collection.",
  },
  {
    number: "02",
    title: "Compare",
    text: "Filter by price and rating, sort the list, and open a stay to choose a room.",
  },
  {
    number: "03",
    title: "Confirm",
    text: "Review the live total, add your details, and find the booking again whenever you need it.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { search, setSearch } = useAppState();
  const goToStays = useGoToStays();
  const openDestination = useOpenDestination();
  const featured = getFeaturedHotels();
  useTitle("Velora — Stay somewhere unforgettable");

  function onSearch(next) {
    setSearch(next);
    navigate(`/hotels?${toQuery(next)}`);
  }

  function exploreAll() {
    goToStays({ location: "" });
  }

  return (
    <main className="page">
      <section className="hero" style={{ "--hero": `url("${HERO_PHOTO}")` }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-inner">
          <p className="eyebrow rise">Curated stays</p>
          <h1 className="rise d1">
            Stay somewhere
            <br />
            <em>the light feels different.</em>
          </h1>
          <p className="lede rise d2">
            Cliff houses, city riads, and quiet resorts. Search a place, compare the room, and keep every booking close at hand.
          </p>
          <div className="rise d3">
            <SearchBar value={search} onSearch={onSearch} variant="hero" />
          </div>
        </div>
      </section>

      <section className="reassure" aria-label="Why Velora">
        {reassurances.map((item) => (
          <article key={item.title}>
            <Icon name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="section">
        <div className="section-head page-inline">
          <div>
            <p className="eyebrow">Featured</p>
            <h2>Chosen for the way they feel</h2>
          </div>
          <button type="button" className="link-arrow" onClick={exploreAll}>
            View all stays <Icon name="arrow" />
          </button>
        </div>
        <div className="card-grid">
          {featured.map((hotel, index) => (
            <HotelCard key={hotel.id} hotel={hotel} search={search} style={{ animationDelay: `${index * 80}ms` }} />
          ))}
        </div>
      </section>

      <section className="section tight">
        <div className="section-head page-inline">
          <div>
            <p className="eyebrow">Destinations</p>
            <h2>Go somewhere specific</h2>
          </div>
        </div>
        <div className="dest-grid">
          {destinations.map((place, index) => (
            <button
              key={place.city}
              type="button"
              className="tile rise"
              style={{ animationDelay: `${index * 40}ms` }}
              onClick={() => openDestination(place.city)}
            >
              <Photo src={place.image} alt="" />
              <span>
                <small>{place.country}</small>
                <strong>{place.city}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="editorial">
        <Photo src={EDITORIAL_PHOTO} alt="A quiet spa with warm stone and folded linen." />
        <div className="editorial-copy">
          <p className="eyebrow">The idea</p>
          <h2>Unhurried, on purpose.</h2>
          <p>
            Velora is a small collection of hotels with a sense of place. Prices update as you change dates and guests, and every confirmation stays in My Bookings on this browser.
          </p>
          <button type="button" className="btn" onClick={exploreAll}>
            Explore the collection
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-head page-inline">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>Three calm steps</h2>
          </div>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <article key={step.number} className="step">
              <p className="step-num">{step.number}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>The collection is open.</h2>
        <p>Search a coast, a city, or leave the place open and browse every stay.</p>
        <button type="button" className="btn btn-gold" onClick={exploreAll}>
          Explore stays
        </button>
      </section>
    </main>
  );
}
