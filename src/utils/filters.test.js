import { describe, expect, it } from "vitest";
import { hotels } from "../data/hotels.js";
import { filterAndSortHotels } from "./filters.js";

describe("filterAndSortHotels", () => {
  it("matches a city, country, or region", () => {
    expect(filterAndSortHotels(hotels, { location: "Santorini" }).map((hotel) => hotel.id)).toEqual([
      "caldera-house",
    ]);
    expect(filterAndSortHotels(hotels, { location: "italy" }).map((hotel) => hotel.id)).toEqual(["casa-lido"]);
    expect(filterAndSortHotels(hotels, { location: "amalfi" }).map((hotel) => hotel.id)).toEqual(["casa-lido"]);
  });

  it("filters by nightly price and rating", () => {
    expect(filterAndSortHotels(hotels, { maxPrice: 200 }).map((hotel) => hotel.id).sort()).toEqual([
      "casa-sol",
      "riad-noor",
    ]);
    expect(filterAndSortHotels(hotels, { minRating: 4.8 })).toHaveLength(5);
    expect(filterAndSortHotels(hotels, { minRating: 4.8 }).some((hotel) => hotel.id === "casa-sol")).toBe(false);
  });

  it("sorts by price without changing the source list", () => {
    const before = hotels.map((hotel) => hotel.id);
    const sorted = filterAndSortHotels(hotels, { sort: "price-asc" }).map((hotel) => hotel.id);
    expect(sorted).toEqual([
      "riad-noor",
      "casa-sol",
      "kumo-house",
      "aurora-lodge",
      "pine-reserve",
      "casa-lido",
      "caldera-house",
      "reef-pavilion",
    ]);
    expect(hotels.map((hotel) => hotel.id)).toEqual(before);
  });

  it("puts featured stays first when sorting by recommended", () => {
    expect(filterAndSortHotels(hotels, { sort: "recommended" }).map((hotel) => hotel.id)).toEqual([
      "caldera-house",
      "reef-pavilion",
      "kumo-house",
      "casa-lido",
      "pine-reserve",
      "aurora-lodge",
      "riad-noor",
      "casa-sol",
    ]);
  });
});
