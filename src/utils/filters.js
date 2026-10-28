export function filterAndSortHotels(list, criteria = {}) {
  const {
    location = "",
    minPrice = 0,
    maxPrice = Number.POSITIVE_INFINITY,
    minRating = 0,
    sort = "recommended",
  } = criteria;

  const query = location.trim().toLowerCase();
  const filtered = list.filter((hotel) => {
    const haystack = [hotel.name, hotel.city, hotel.country, hotel.region, hotel.location]
      .join(" ")
      .toLowerCase();
    const matchesPlace = !query || haystack.includes(query);
    const matchesPrice = hotel.priceFrom >= minPrice && hotel.priceFrom <= maxPrice;
    const matchesRating = hotel.rating >= minRating;
    return matchesPlace && matchesPrice && matchesRating;
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (sort === "price-asc") return a.priceFrom - b.priceFrom || a.name.localeCompare(b.name);
    if (sort === "price-desc") return b.priceFrom - a.priceFrom || a.name.localeCompare(b.name);
    if (sort === "rating") return b.rating - a.rating || b.reviews - a.reviews;
    return (
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      b.rating - a.rating ||
      b.reviews - a.reviews
    );
  });

  return sorted;
}
