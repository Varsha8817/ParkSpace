"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { BookingWidget } from "@/components/booking-widget";
import { Header } from "@/components/header";
import { ReviewSection } from "@/components/review-section";
import { currency, getListingMetrics } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

export default function ListingDetailsPage() {
  const params = useParams<{ id: string }>();
  const { parkingSpaces, reviews } = useApp();
  const listing = parkingSpaces.find((space) => space.id === params.id);

  if (!listing) {
    return (
      <>
        <Header />
        <main className="shell">
          <section className="card">
            <h1>Listing not found</h1>
            <p className="muted">This parking space may have been removed or not loaded yet.</p>
          </section>
        </main>
      </>
    );
  }

  const metrics = getListingMetrics(listing, reviews);

  return (
    <>
      <Header />
      <main className="shell stack">
        <section className="listing-hero">
          <div className="listing-hero-image">
            <Image
              src={listing.images[0] || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"}
              alt={listing.title}
              fill
              className="listing-image"
            />
          </div>
          <div className="listing-hero-copy">
            <span className="eyebrow">{listing.type}</span>
            <h1>{listing.title}</h1>
            <p>{listing.address}</p>
            <div className="summary-block">
              <div className="summary-row">
                <span>Pricing</span>
                <strong>
                  {currency(listing.priceHour)}/hr - {currency(listing.priceDay)}/day - {currency(listing.priceMonth)}/month
                </strong>
              </div>
              <div className="summary-row">
                <span>Availability</span>
                <strong>
                  {listing.availabilityDays.join(", ")} - {listing.availabilityStart}-{listing.availabilityEnd}
                </strong>
              </div>
              <div className="summary-row">
                <span>Rating</span>
                <strong>{metrics.reviewCount ? `${metrics.averageRating.toFixed(1)} stars from ${metrics.reviewCount} reviews` : "New listing"}</strong>
              </div>
            </div>
            <p>{listing.description}</p>
            <div className="tag-list">
              {listing.amenities.map((amenity) => (
                <span className="filter-chip active" key={amenity}>
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="detail-layout">
          <ReviewSection parkingId={listing.id} reviews={reviews} />
          <BookingWidget listing={listing} />
        </section>
      </main>
    </>
  );
}
