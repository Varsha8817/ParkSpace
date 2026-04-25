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

const buttonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95";
const ghostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95";
const fieldClass =
  "h-12 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-300";

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
    <section className="space-y-8" id="marketplace">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Find nearby parking in minutes</h2>
        <p className="text-base leading-7 text-slate-500 sm:text-lg">
          Search by area, compare pricing, and switch between map and list views without leaving the flow.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-4 shadow-2xl shadow-slate-200/70">
        <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11" cy="11" r="6" />
        </svg>
        <input
          className="w-full border-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          value={filters.query}
          onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
          placeholder="Search by metro, locality, landmark, or neighborhood"
        />
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Price</span>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  className="w-full accent-indigo-600"
                  type="range"
                  min="40"
                  max="200"
                  step="5"
                  value={filters.maxPrice}
                  onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) }))}
                />
                <span className="mt-2 block text-sm font-medium normal-case tracking-normal text-slate-500">
                  Up to {currency(filters.maxPrice)}
                </span>
              </div>
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Type</span>
              <select className={fieldClass} value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value as SearchFilters["type"] }))}>
                <option value="All">All</option>
                <option value="Garage">Garage</option>
                <option value="Open">Open</option>
                <option value="Covered">Covered</option>
              </select>
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Day</span>
              <select className={fieldClass} value={filters.day} onChange={(event) => setFilters((prev) => ({ ...prev, day: event.target.value }))}>
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
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <span>Time</span>
              <input className={fieldClass} type="time" value={filters.time} onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))} />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2">
            <p className="text-sm text-slate-500">{filteredListings.length} spaces available</p>
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 ${viewMode === "map" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                onClick={() => setViewMode("map")}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {viewMode === "map" ? (
            <MapPanel listings={filteredListings} selectedId={selectedListing?.id} onSelect={(listing) => setSelectedId(listing.id)} />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => {
                const metrics = getListingMetrics(listing, reviews);

                return (
                  <article
                    key={listing.id}
                    className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/70 ${listing.id === selectedListing?.id ? "ring-2 ring-indigo-100" : ""}`}
                    onMouseEnter={() => setSelectedId(listing.id)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={listing.images[0] || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                        {listing.type}
                      </span>
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold tracking-tight text-slate-900">{listing.title}</h3>
                          <p className="text-sm text-slate-500">{listing.address}</p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-bold text-indigo-600">{currency(listing.priceHour)}/hr</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                        <span>{metrics.reviewCount ? `${metrics.averageRating.toFixed(1)} stars` : "New"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{listing.availabilityStart} - {listing.availabilityEnd}</span>
                        <span className="text-slate-300">•</span>
                        <span>{listing.instantBook ? "Instant book" : "Request"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {listing.amenities.slice(0, 3).map((amenity) => (
                          <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <Link className={buttonClass} href={`/listings/${listing.id}`}>
                          View details
                        </Link>
                        <button className={ghostButtonClass} onClick={() => setViewMode("map")}>
                          See on map
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/60">
            {selectedListing ? (
              <div className="space-y-5">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  Selected space
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{selectedListing.title}</h3>
                  <p className="leading-7 text-slate-500">{selectedListing.description}</p>
                </div>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-slate-500">Address</span>
                    <strong className="max-w-[220px] text-right text-slate-900">{selectedListing.address}</strong>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-slate-500">Pricing</span>
                    <strong className="text-right text-indigo-600">{currency(selectedListing.priceHour)}/hr · {currency(selectedListing.priceDay)}/day</strong>
                  </div>
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-slate-500">Availability</span>
                    <strong className="max-w-[220px] text-right text-slate-900">
                      {selectedListing.availabilityDays.join(", ")} · {selectedListing.availabilityStart}-{selectedListing.availabilityEnd}
                    </strong>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link className={buttonClass} href={`/listings/${selectedListing.id}`}>
                    Book now
                  </Link>
                  <a
                    className={ghostButtonClass}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${selectedListing.latitude},${selectedListing.longitude}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Navigate
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Try widening the filters to see more available parking spaces.</p>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

