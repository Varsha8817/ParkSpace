"use client";

import Link from "next/link";
import { HostListingForm } from "@/components/host-listing-form";
import { currency } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

export function DashboardOverview() {
  const { bookings, currentUser, parkingSpaces } = useApp();

  if (!currentUser) {
    return (
      <section className="card stack">
        <h2>Please sign in first</h2>
        <p className="muted">Once signed in, drivers can book parking and hosts can publish spaces.</p>
        <Link className="primary-button" href="/auth">
          Go to login
        </Link>
      </section>
    );
  }

  if (currentUser.role === "host") {
    const ownedSpaces = parkingSpaces.filter((space) => space.ownerId === currentUser.id);
    const ownedBookings = bookings.filter((booking) => ownedSpaces.some((space) => space.id === booking.parkingId));
    const monthlyPotential = ownedSpaces.reduce((sum, space) => sum + space.priceMonth, 0);

    return (
      <div className="stack">
        <section className="stats-grid">
          <article className="stat-card">
            <span>Live listings</span>
            <strong>{ownedSpaces.length}</strong>
          </article>
          <article className="stat-card">
            <span>Booking pipeline</span>
            <strong>{ownedBookings.length}</strong>
          </article>
          <article className="stat-card">
            <span>Monthly earning potential</span>
            <strong>{currency(monthlyPotential)}</strong>
          </article>
        </section>
        <HostListingForm />
      </div>
    );
  }

  const myBookings = bookings.filter((booking) => booking.userId === currentUser.id);

  return (
    <div className="stack">
      <section className="stats-grid">
        <article className="stat-card">
          <span>Upcoming bookings</span>
          <strong>{myBookings.length}</strong>
        </article>
        <article className="stat-card">
          <span>Search-ready spaces</span>
          <strong>{parkingSpaces.length}</strong>
        </article>
      </section>

      <section className="card stack">
        <div className="section-heading">
          <div>
            <h3>Your bookings</h3>
            <p>Keep tabs on confirmed parking and payment receipts.</p>
          </div>
          <Link className="primary-button" href="/#marketplace">
            Book another space
          </Link>
        </div>
        {myBookings.length ? (
          myBookings.map((booking) => {
            const listing = parkingSpaces.find((space) => space.id === booking.parkingId);
            return (
              <article key={booking.id} className="booking-card">
                <div>
                  <strong>{listing?.title ?? "Parking space"}</strong>
                  <p className="muted">
                    {booking.date} - {booking.startTime}-{booking.endTime}
                  </p>
                </div>
                <div className="inline-row">
                  <span className="badge">{booking.status}</span>
                  <span>{currency(booking.totalCost)}</span>
                </div>
              </article>
            );
          })
        ) : (
          <p className="muted">No bookings yet. Start from the marketplace to reserve your first space.</p>
        )}
      </section>
    </div>
  );
}

