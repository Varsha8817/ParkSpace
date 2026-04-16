export type UserRole = "driver" | "host";
export type ParkingType = "Garage" | "Open" | "Covered";
export type BillingModel = "hour" | "day" | "month";
export type BookingMode = "instant" | "request";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ParkingSpace {
  id: string;
  ownerId: string;
  title: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  description: string;
  type: ParkingType;
  images: string[];
  amenities: string[];
  priceHour: number;
  priceDay: number;
  priceMonth: number;
  availabilityDays: string[];
  availabilityStart: string;
  availabilityEnd: string;
  instantBook: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  parkingId: string;
  date: string;
  startTime: string;
  endTime: string;
  bookingMode: BookingMode;
  billingModel: BillingModel;
  totalCost: number;
  status: "confirmed" | "pending";
  paymentStatus: "paid" | "awaiting";
  upiReference: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  parkingId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface ListingMetrics {
  averageRating: number;
  reviewCount: number;
}

export interface SearchFilters {
  query: string;
  maxPrice: number;
  type: "All" | ParkingType;
  day: string;
  time: string;
}
