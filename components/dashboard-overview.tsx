"use client";

import Link from "next/link";
import { HostListingForm } from "@/components/host-listing-form";
import { currency } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95";

export function DashboardOverview() {
  const { bookings, currentUser, parkingSpaces } = useApp();

  if (!currentUser) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Please sign in first</h2>
          <p className="max-w-2xl text-base leading-7 text-slate-500">
            Once signed in, drivers can book parking and hosts can publish spaces.
          </p>
          <Link className={primaryButtonClass} href="/auth">
            Go to login
          </Link>
        </div>
      </section>
    );
  }

  if (currentUser.role === "host") {
    const ownedSpaces = parkingSpaces.filter((space) => space.ownerId === currentUser.id);
    const ownedBookings = bookings.filter((booking) => ownedSpaces.some((space) => space.id === booking.parkingId));
    const monthlyPotential = ownedSpaces.reduce((sum, space) => sum + space.priceMonth, 0);

    return (
      <div className="space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-white px-8 py-8">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Host overview
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Keep your listings polished, visible, and ready to book.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Manage supply, monitor demand, and publish new spaces with a layout that matches the marketplace feel.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Live listings</p>
              <strong className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">{ownedSpaces.length}</strong>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Booking pipeline</p>
              <strong className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">{ownedBookings.length}</strong>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Monthly potential</p>
              <strong className="mt-2 block text-3xl font-bold tracking-tight text-indigo-600">{currency(monthlyPotential)}</strong>
            </div>
          </div>
        </section>
        <HostListingForm />
      </div>
    );
  }

  const myBookings = bookings.filter((booking) => booking.userId === currentUser.id);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-white px-8 py-8">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Driver overview
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your next parking stop, kept in one clean view.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            Review your upcoming reservations, check current supply, and jump right back into booking.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Upcoming bookings</p>
            <strong className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">{myBookings.length}</strong>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Available spaces</p>
            <strong className="mt-2 block text-3xl font-bold tracking-tight text-slate-900">{parkingSpaces.length}</strong>
          </div>
          <div className="flex items-center">
            <Link className={`${primaryButtonClass} w-full`} href="/#marketplace">
              Book another space
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Your bookings</h3>
          <p className="text-base leading-7 text-slate-500">Keep tabs on confirmed parking and payment receipts.</p>
        </div>
        <div className="mt-6 space-y-4">
          {myBookings.length ? (
            myBookings.map((booking) => {
              const listing = parkingSpaces.find((space) => space.id === booking.parkingId);
              return (
                <article
                  key={booking.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <strong className="text-base font-semibold text-slate-900">{listing?.title ?? "Parking space"}</strong>
                    <p className="text-sm text-slate-500">
                      {booking.date} - {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {booking.status}
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">{currency(booking.totalCost)}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">No bookings yet. Start from the marketplace to reserve your first space.</p>
          )}
        </div>
      </section>
    </div>
  );
}

