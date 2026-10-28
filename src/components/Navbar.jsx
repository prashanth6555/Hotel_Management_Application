import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppState } from "../context/AppState";
import { toQuery } from "../utils/search";
import Icon from "./Icon";

export default function Navbar() {
  const { pathname } = useLocation();
  const { search, bookings } = useAppState();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);
  const [open, setOpen] = useState(false);
  const activeCount = bookings.filter((booking) => booking.status === "confirmed").length;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) {
      setSolid(true);
      return undefined;
    }
    function onScroll() {
      setSolid(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const staysActive = pathname.startsWith("/hotels");
  const bookingsActive = pathname.startsWith("/bookings");

  return (
    <header className={solid || open ? "nav nav--solid" : "nav nav--clear"}>
      <Link to="/" className="logo" aria-label="Velora home" onClick={() => setOpen(false)}>
        <span className="logo-mark">V</span>
        Velora
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav className={open ? "nav-links is-open" : "nav-links"} aria-label="Primary">
        <Link
          to={`/hotels?${toQuery(search)}`}
          className={staysActive ? "active" : undefined}
          onClick={() => setOpen(false)}
        >
          Stays
        </Link>
        <Link
          to="/bookings"
          className={bookingsActive ? "active" : undefined}
          onClick={() => setOpen(false)}
        >
          My bookings
          {activeCount > 0 ? <span className="nav-badge">{activeCount}</span> : null}
        </Link>
      </nav>
    </header>
  );
}
