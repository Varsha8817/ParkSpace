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
      <div className="flex min-h-[580px] items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white text-sm text-slate-500">
        No spaces match these filters yet.
      </div>
    );
  }

  const minLat = Math.min(...listings.map((listing) => listing.latitude));
  const maxLat = Math.max(...listings.map((listing) => listing.latitude));
  const minLng = Math.min(...listings.map((listing) => listing.longitude));
  const maxLng = Math.max(...listings.map((listing) => listing.longitude));

  return (
    <div className="relative min-h-[580px] overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-indigo-50 shadow-sm shadow-slate-200/60">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.12),transparent_18%),radial-gradient(circle_at_80%_35%,rgba(79,70,229,0.08),transparent_20%),radial-gradient(circle_at_40%_80%,rgba(148,163,184,0.12),transparent_18%)]" />
      {listings.map((listing) => {
        const top = 12 + ((maxLat - listing.latitude) / Math.max(maxLat - minLat, 0.01)) * 72;
        const left = 12 + ((listing.longitude - minLng) / Math.max(maxLng - minLng, 0.01)) * 72;
        const active = listing.id === selectedId;

        return (
          <button
            key={listing.id}
            className={`absolute z-10 inline-flex h-10 min-w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition-all active:scale-95 ${active ? "bg-slate-900" : "bg-indigo-600 hover:bg-indigo-500"}`}
            style={{ top: `${top}%`, left: `${left}%` }}
            onClick={() => onSelect?.(listing)}
          >
            {listing.priceHour}
          </button>
        );
      })}
      <div className="absolute inset-x-5 bottom-5 z-10 rounded-3xl border border-white/70 bg-white/90 p-5 backdrop-blur-sm">
        <strong className="text-sm font-semibold tracking-tight text-slate-900">Live neighbourhood map</strong>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Select a price pin to inspect the listing and open turn-by-turn navigation.
        </p>
      </div>
    </div>
  );
}

