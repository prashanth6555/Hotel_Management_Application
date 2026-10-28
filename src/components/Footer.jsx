import { Link } from "react-router-dom";
import { useGoToStays, useOpenDestination } from "../hooks/useOpenDestination";

const places = ["Santorini", "Kyoto", "Maldives", "Positano"];

export default function Footer() {
  const openDestination = useOpenDestination();
  const goToStays = useGoToStays();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Link to="/" className="logo" aria-label="Velora home">
            <span className="logo-mark">V</span>
            Velora
          </Link>
          <p>A small collection of hotels with a sense of place. Search, compare, and keep every confirmation on this browser.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <button type="button" className="text-link" onClick={() => goToStays({ location: "" })}>
            All stays
          </button>
          <Link to="/bookings">My bookings</Link>
        </div>
        <div>
          <h2>Places</h2>
          {places.map((city) => (
            <button key={city} type="button" className="text-link" onClick={() => openDestination(city)}>
              {city}
            </button>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Velora</span>
        <span>Bookings are stored in this browser.</span>
      </div>
    </footer>
  );
}
