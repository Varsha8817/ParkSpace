import { Booking, ParkingSpace, Review } from "@/lib/types";

export function currency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getListingMetrics(listing: ParkingSpace, reviews: Review[]) {
  const listingReviews = reviews.filter((review) => review.parkingId === listing.id);

  if (!listingReviews.length) {
    return {
      averageRating: 0,
      reviewCount: 0
    };
  }

  const total = listingReviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    averageRating: total / listingReviews.length,
    reviewCount: listingReviews.length
  };
}

export function listingPrice(listing: ParkingSpace, billingModel: Booking["billingModel"]) {
  if (billingModel === "day") return listing.priceDay;
  if (billingModel === "month") return listing.priceMonth;
  return listing.priceHour;
}

export function durationHours(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  return Math.max(1, (end - start) / 60);
}
