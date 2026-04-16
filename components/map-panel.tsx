"use client";

import { ParkingSpace } from "@/lib/types";

interface MapPanelProps {
  listings: ParkingSpace[];
  selectedId?: string;
  onSelect?: (listing: ParkingSpace) => void;
}

export function MapPanel({ listings, selectedId, onSelect }: MapPanelProps) {
  if (!listings.length) {
    return (
      <div className="map-panel empty">
        <p>No spaces match these filters yet.</p>
      </div>
    );
  }

  const minLat = Math.min(...listings.map((listing) => listing.latitude));
  const maxLat = Math.max(...listings.map((listing) => listing.latitude));
  const minLng = Math.min(...listings.map((listing) => listing.longitude));
  const maxLng = Math.max(...listings.map((listing) => listing.longitude));

  return (
    <div className="map-panel">
      <div className="map-grid" />
      {listings.map((listing) => {
        const top = 12 + ((maxLat - listing.latitude) / Math.max(maxLat - minLat, 0.01)) * 72;
        const left = 12 + ((listing.longitude - minLng) / Math.max(maxLng - minLng, 0.01)) * 72;
        const active = listing.id === selectedId;

        return (
          <button
            key={listing.id}
            className={`marker ${active ? "active" : ""}`}
            style={{ top: `${top}%`, left: `${left}%` }}
            onClick={() => onSelect?.(listing)}
          >
            {listing.priceHour}
          </button>
        );
      })}
      <div className="map-caption">
        <strong>Live neighbourhood map</strong>
        <p>Select a price pin to inspect the listing and open turn-by-turn navigation.</p>
      </div>
    </div>
  );
}
