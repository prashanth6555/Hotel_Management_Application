import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import SearchBar from "../components/SearchBar";
import { useAppState } from "../context/AppState";
import { hotels } from "../data/hotels";
import { useTitle } from "../hooks/useTitle";
import { formatDate, nightsBetween } from "../utils/dates";
import { filterAndSortHotels } from "../utils/filters";
import { guestLabel } from "../utils/format";
import { parseQuery, toQuery } from "../utils/search";

const RATINGS = [
  { value: 0, label: "Any" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
  { value: 4.8, label: "4.8+" },
];

export default function Hotels() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { search, setSearch } = useAppState();
  const queryString = params.toString();
  const activeSearch = queryString ? parseQuery(params) : search;
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useTitle(activeSearch.location ? `Stays in ${activeSearch.location} · Velora` : "All stays · Velora");

  useEffect(() => {
    if (!queryString) return;
    setSearch(parseQuery(new URLSearchParams(queryString)));
  }, [queryString, setSearch]);

  const results = useMemo(
    () =>
      filterAndSortHotels(hotels, {
        location: activeSearch.location,
        minPrice,
        maxPrice,
        minRating,
        sort,
      }),
    [activeSearch.location, minPrice, maxPrice, minRating, sort],
  );

  function handleSearch(next) {
    setSearch(next);
    navigate(`/hotels?${toQuery(next)}`);
  }

  function resetFilters() {
    setMinPrice(100);
    setMaxPrice(1200);
    setMinRating(0);
    setSort("recommended");
  }

  const dated = nightsBetween(activeSearch.checkIn, activeSearch.checkOut) > 0;
  const title = activeSearch.location ? `Stays in ${activeSearch.location}` : "All stays";
  const subtitle = dated
    ? `${formatDate(activeSearch.checkIn)} – ${formatDate(activeSearch.checkOut)} · ${guestLabel(activeSearch.guests)}`
    : "Add dates to see a full price for each stay.";

  return (
    <main className="page listing-page">
      <header className="list-header page-inline">
        <div>
          <p className="eyebrow">The collection</p>
          <h1>{title}</h1>
          <p className="lede">{subtitle}</p>
        </div>
        <SearchBar value={activeSearch} onSearch={handleSearch} variant="bar" />
      </header>

      <div className="listing-layout page-inline">
        <aside className={filtersOpen ? "filters is-open" : "filters"}>
          <div className="filter-block">
            <h2>Price per night</h2>
            <p className="filter-value">
              ${minPrice} – ${maxPrice}
            </p>
            <label>
              Minimum ${minPrice}
              <input
                type="range"
                min="100"
                max="1200"
                step="10"
                value={minPrice}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setMinPrice(value);
                  if (value > maxPrice) setMaxPrice(value);
                }}
              />
            </label>
            <label>
              Maximum ${maxPrice}
              <input
                type="range"
                min="100"
                max="1200"
                step="10"
                value={maxPrice}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setMaxPrice(value);
                  if (value < minPrice) setMinPrice(value);
                }}
              />
            </label>
          </div>
          <div className="filter-block">
            <h2>Rating</h2>
            <div className="chip-row">
              {RATINGS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={minRating === option.value ? "chip-btn is-on" : "chip-btn"}
                  aria-pressed={minRating === option.value}
                  onClick={() => setMinRating(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="btn btn-ghost filter-reset" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        <section>
          <div className="results-bar">
            <p className="result-count" aria-live="polite">
              {results.length} {results.length === 1 ? "stay" : "stays"}
              {activeSearch.location ? ` for ${activeSearch.location}` : ""}
            </p>
            <div className="results-actions">
              <button
                type="button"
                className="btn btn-ghost filter-toggle"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
              >
                {filtersOpen ? "Hide filters" : "Filters"}
              </button>
              <label className="sort">
                <span>Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <h2>No stays match.</h2>
              <p>Try another destination, a wider price range, or a lower rating.</p>
              <div className="button-row">
                <button type="button" className="btn" onClick={resetFilters}>
                  Reset filters
                </button>
                {activeSearch.location ? (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleSearch({ ...activeSearch, location: "" })}
                  >
                    Search all destinations
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="hotel-grid">
              {results.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  search={activeSearch}
                  style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
