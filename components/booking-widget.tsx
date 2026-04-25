"use client";

import { useMemo, useState } from "react";
import { BillingModel, BookingMode, ParkingSpace } from "@/lib/types";
import { currency, durationHours, listingPrice } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";
const ghostButtonClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95";

export function BookingWidget({ listing }: { listing: ParkingSpace }) {
  const { addBooking, currentUser } = useApp();
  const [date, setDate] = useState("2026-04-20");
  const [startTime, setStartTime] = useState(listing.availabilityStart);
  const [endTime, setEndTime] = useState(listing.availabilityEnd);
  const [bookingMode, setBookingMode] = useState<BookingMode>(listing.instantBook ? "instant" : "request");
  const [billingModel, setBillingModel] = useState<BillingModel>("hour");
  const [message, setMessage] = useState<string | null>(null);

  const total = useMemo(() => {
    if (billingModel === "hour") {
      return listingPrice(listing, billingModel) * durationHours(startTime, endTime);
    }

    return listingPrice(listing, billingModel);
  }, [billingModel, endTime, listing, startTime]);

  async function handleBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await addBooking({
      parkingId: listing.id,
      date,
      startTime,
      endTime,
      bookingMode,
      billingModel,
      totalCost: total
    });
    setMessage(result.message);
  }

  return (
    <aside className="sticky top-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">Book this space</h3>
          <p className="text-sm leading-6 text-slate-500">Simple 3-step flow: pick time, review price, confirm payment.</p>
        </div>
        <strong className="whitespace-nowrap text-base font-bold text-indigo-600">{currency(listing.priceHour)}/hr</strong>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleBooking}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Date</span>
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Booking type</span>
            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white" value={bookingMode} onChange={(event) => setBookingMode(event.target.value as BookingMode)}>
              <option value="instant">Instant booking</option>
              <option value="request">Request booking</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Billing</span>
            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white" value={billingModel} onChange={(event) => setBillingModel(event.target.value as BillingModel)}>
              <option value="hour">Per hour</option>
              <option value="day">Per day</option>
              <option value="month">Per month</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Start time</span>
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>End time</span>
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-indigo-300 focus:bg-white" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
          </label>
        </div>

        <div className="space-y-4 rounded-[2rem] bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Parking charge</span>
            <strong className="text-base font-bold text-indigo-600">{currency(total)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Payment method</span>
            <span className="text-slate-900">UPI mock checkout</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-500">Status after pay</span>
            <span className="text-slate-900">{bookingMode === "instant" ? "Confirmed" : "Pending host approval"}</span>
          </div>
        </div>

        <button className={`${primaryButtonClass} w-full`} disabled={!currentUser} type="submit">
          Pay with UPI
        </button>
        {!currentUser ? <p className="text-sm text-slate-500">Please sign in to complete a booking.</p> : null}
        {message ? <p className="text-sm font-medium text-indigo-600">{message}</p> : null}
        <a
          className={`${ghostButtonClass} w-full`}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${listing.latitude},${listing.longitude}`
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Open navigation in Google Maps
        </a>
      </form>
    </aside>
  );
}

