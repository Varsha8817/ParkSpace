"use client";

import { useMemo, useState } from "react";
import { BillingModel, BookingMode, ParkingSpace } from "@/lib/types";
import { currency, durationHours, listingPrice } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

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
    <aside className="card stack sticky-card">
      <div className="section-heading">
        <div>
          <h3>Book this space</h3>
          <p>Simple 3-step flow: pick time, review price, confirm payment.</p>
        </div>
        <strong>{currency(listing.priceHour)}/hr</strong>
      </div>

      <form className="stack" onSubmit={handleBooking}>
        <div className="form-grid">
          <label>
            Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label>
            Booking type
            <select value={bookingMode} onChange={(event) => setBookingMode(event.target.value as BookingMode)}>
              <option value="instant">Instant booking</option>
              <option value="request">Request booking</option>
            </select>
          </label>
          <label>
            Billing
            <select value={billingModel} onChange={(event) => setBillingModel(event.target.value as BillingModel)}>
              <option value="hour">Per hour</option>
              <option value="day">Per day</option>
              <option value="month">Per month</option>
            </select>
          </label>
          <label>
            Start time
            <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
          </label>
          <label>
            End time
            <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
          </label>
        </div>

        <div className="summary-block">
          <div className="summary-row">
            <span>Parking charge</span>
            <strong>{currency(total)}</strong>
          </div>
          <div className="summary-row">
            <span>Payment method</span>
            <span>UPI mock checkout</span>
          </div>
          <div className="summary-row">
            <span>Status after pay</span>
            <span>{bookingMode === "instant" ? "Confirmed" : "Pending host approval"}</span>
          </div>
        </div>

        <button className="primary-button" disabled={!currentUser} type="submit">
          Pay with UPI
        </button>
        {!currentUser ? <p className="muted">Please sign in to complete a booking.</p> : null}
        {message ? <p className="success-text">{message}</p> : null}
        <a
          className="ghost-button anchor-button"
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
