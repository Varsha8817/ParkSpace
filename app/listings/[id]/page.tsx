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
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Listing not found</h1>
            <p className="mt-3 text-base leading-7 text-slate-500">This parking space may have been removed or not loaded yet.</p>
          </section>
        </main>
      </>
    );
  }

  const metrics = getListingMetrics(listing, reviews);

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div className="space-y-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-sm shadow-slate-200/60">
              <Image
                src={listing.images[0] || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {listing.type}
                </span>
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{listing.title}</h1>
                  <p className="text-base leading-7 text-slate-500">{listing.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Pricing</p>
                  <strong className="mt-2 block text-lg font-bold text-indigo-600">
                    {currency(listing.priceHour)}/hr
                  </strong>
                  <p className="mt-1 text-sm text-slate-500">{currency(listing.priceDay)}/day · {currency(listing.priceMonth)}/month</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Availability</p>
                  <strong className="mt-2 block text-base font-semibold text-slate-900">
                    {listing.availabilityStart}-{listing.availabilityEnd}
                  </strong>
                  <p className="mt-1 text-sm text-slate-500">{listing.availabilityDays.join(", ")}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Rating</p>
                  <strong className="mt-2 block text-base font-semibold text-slate-900">
                    {metrics.reviewCount ? `${metrics.averageRating.toFixed(1)} stars` : "New listing"}
                  </strong>
                  <p className="mt-1 text-sm text-slate-500">
                    {metrics.reviewCount ? `${metrics.reviewCount} reviews` : "No reviews yet"}
                  </p>
                </div>
              </div>

              <p className="max-w-3xl text-base leading-8 text-slate-500">{listing.description}</p>

              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <BookingWidget listing={listing} />
        </section>

        <ReviewSection parkingId={listing.id} reviews={reviews} />
      </main>
    </>
  );
}

