"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPanel } from "@/components/map-panel";
import { SearchFilters } from "@/lib/types";
import { currency, getListingMetrics } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

const initialFilters: SearchFilters = {
  query: "",
  maxPrice: 120,
  type: "All",
  day: "Any",
  time: ""
};

export function SearchMarketplace() {
  const { parkingSpaces, reviews } = useApp();
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [selectedId, setSelectedId] = useState<string | undefined>(parkingSpaces[0]?.id);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredListings = useMemo(() => {
    return parkingSpaces.filter((listing) => {
      const query = filters.query.trim().toLowerCase();
      const matchesQuery =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.address.toLowerCase().includes(query) ||
        listing.city.toLowerCase().includes(query);
      const matchesPrice = listing.priceHour <= filters.maxPrice;
      const matchesType = filters.type === "All" || listing.type === filters.type;
      const matchesDay = filters.day === "Any" || listing.availabilityDays.includes(filters.day);
      const matchesTime = !filters.time || (filters.time >= listing.availabilityStart && filters.time <= listing.availabilityEnd);

      return matchesQuery && matchesPrice && matchesType && matchesDay && matchesTime;
    });
  }, [filters, parkingSpaces]);

  const selectedListing = filteredListings.find((listing) => listing.id === selectedId) ?? filteredListings[0];

  return (
    <section className="market-shell" id="marketplace">
      <div className="section-heading">
        <div>
          <h2>Find nearby parking in minutes</h2>
          <p>Search by area, compare prices, and switch between map and list without breaking the flow.</p>
        </div>
        <div className="segmented-control">
          <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
            List view
          </button>
          <button className={viewMode === "map" ? "active" : ""} onClick={() => setViewMode("map")}>
            Map view
          </button>
        </div>
      </div>

      <div className="filters">
        <label>
          Search
          <input
            value={filters.query}
            onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
            placeholder="Metro, locality, landmark"
          />
        </label>
        <label>
          Max hourly price
          <input
            type="range"
            min="40"
            max="200"
            step="5"
            value={filters.maxPrice}
            onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) }))}
          />
          <span className="range-value">{currency(filters.maxPrice)}</span>
        </label>
        <label>
          Parking type
          <select value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value as SearchFilters["type"] }))}>
            <option value="All">All</option>
            <option value="Garage">Garage</option>
            <option value="Open">Open</option>
            <option value="Covered">Covered</option>
          </select>
        </label>
        <label>
          Day
          <select value={filters.day} onChange={(event) => setFilters((prev) => ({ ...prev, day: event.target.value }))}>
            <option value="Any">Any day</option>
            <option value="Mon">Mon</option>
            <option value="Tue">Tue</option>
            <option value="Wed">Wed</option>
            <option value="Thu">Thu</option>
            <option value="Fri">Fri</option>
            <option value="Sat">Sat</option>
            <option value="Sun">Sun</option>
          </select>
        </label>
        <label>
          Time
          <input type="time" value={filters.time} onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))} />
        </label>
      </div>

      <div className="market-grid">
        {viewMode === "map" ? (
          <MapPanel listings={filteredListings} selectedId={selectedListing?.id} onSelect={(listing) => setSelectedId(listing.id)} />
        ) : (
          <div className="listing-grid">
            {filteredListings.map((listing) => {
              const metrics = getListingMetrics(listing, reviews);

              return (
                <article
                  key={listing.id}
                  className={`listing-card ${listing.id === selectedListing?.id ? "selected" : ""}`}
                  onMouseEnter={() => setSelectedId(listing.id)}
                >
                  <div className="listing-image-wrap">
                    <Image
                      src={listing.images[0] || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"}
                      alt={listing.title}
                      fill
                      className="listing-image"
                    />
                    <span className="badge overlay">{listing.type}</span>
                  </div>
                  <div className="stack compact">
                    <div className="inline-row spread">
                      <h3>{listing.title}</h3>
                      <strong>{currency(listing.priceHour)}/hr</strong>
                    </div>
                    <p className="muted">{listing.address}</p>
                    <div className="inline-row spread">
                      <span>
                        {metrics.reviewCount ? `${metrics.averageRating.toFixed(1)}?` : "New"} - {listing.availabilityStart} - {listing.availabilityEnd}
                      </span>
                      <span>{listing.instantBook ? "Instant book" : "Request"}</span>
                    </div>
                    <div className="tag-list">
                      {listing.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="filter-chip active">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="inline-row">
                      <Link className="primary-button" href={`/listings/${listing.id}`}>
                        View details
                      </Link>
                      <button className="ghost-button" onClick={() => setViewMode("map")}>
                        See on map
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <aside className="card stack detail-card">
          {selectedListing ? (
            <>
              <span className="eyebrow">Selected space</span>
              <h3>{selectedListing.title}</h3>
              <p>{selectedListing.description}</p>
              <div className="summary-block">
                <div className="summary-row">
                  <span>Address</span>
                  <strong>{selectedListing.address}</strong>
                </div>
                <div className="summary-row">
                  <span>Pricing</span>
                  <strong>{currency(selectedListing.priceHour)}/hr - {currency(selectedListing.priceDay)}/day</strong>
                </div>
                <div className="summary-row">
                  <span>Availability</span>
                  <strong>
                    {selectedListing.availabilityDays.join(", ")} - {selectedListing.availabilityStart}-{selectedListing.availabilityEnd}
                  </strong>
                </div>
              </div>
              <div className="inline-row">
                <Link className="primary-button" href={`/listings/${selectedListing.id}`}>
                  Book now
                </Link>
                <a
                  className="ghost-button anchor-button"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedListing.latitude},${selectedListing.longitude}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Navigate
                </a>
              </div>
            </>
          ) : (
            <p className="muted">Try widening the filters to see more available parking spaces.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

