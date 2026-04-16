import { AppUser, Booking, ParkingSpace, Review } from "@/lib/types";

export const demoUsers: AppUser[] = [
  {
    id: "host-1",
    name: "Ananya Host",
    email: "host@parkspace.demo",
    role: "host"
  },
  {
    id: "driver-1",
    name: "Rahul Driver",
    email: "driver@parkspace.demo",
    role: "driver"
  }
];

export const demoParkingSpaces: ParkingSpace[] = [
  {
    id: "space-1",
    ownerId: "host-1",
    title: "Covered slot near MG Road Metro",
    address: "12 Residency Road, Bengaluru",
    city: "Bengaluru",
    latitude: 12.9719,
    longitude: 77.6077,
    description: "Gated covered parking with CCTV, ideal for office commuters and weekend city visits.",
    type: "Covered",
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["CCTV", "Gated", "EV nearby"],
    priceHour: 80,
    priceDay: 450,
    priceMonth: 6200,
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    availabilityStart: "07:00",
    availabilityEnd: "22:00",
    instantBook: true
  },
  {
    id: "space-2",
    ownerId: "host-1",
    title: "Open family driveway in Koramangala",
    address: "88 6th Block, Koramangala, Bengaluru",
    city: "Bengaluru",
    latitude: 12.9345,
    longitude: 77.6119,
    description: "Spacious open driveway with easy in-and-out access, perfect for hatchbacks and sedans.",
    type: "Open",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Wide access", "Residential lane"],
    priceHour: 60,
    priceDay: 350,
    priceMonth: 5000,
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    availabilityStart: "06:00",
    availabilityEnd: "23:00",
    instantBook: false
  },
  {
    id: "space-3",
    ownerId: "host-1",
    title: "Private garage close to Indiranagar 100 Ft Road",
    address: "22 CMH Road, Indiranagar, Bengaluru",
    city: "Bengaluru",
    latitude: 12.9783,
    longitude: 77.6408,
    description: "Secure private garage with weather protection and direct road access.",
    type: "Garage",
    images: [
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Indoor", "Covered", "Secure gate"],
    priceHour: 95,
    priceDay: 520,
    priceMonth: 7000,
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    availabilityStart: "08:00",
    availabilityEnd: "20:00",
    instantBook: true
  }
];

export const demoBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "driver-1",
    parkingId: "space-1",
    date: "2026-04-18",
    startTime: "10:00",
    endTime: "14:00",
    bookingMode: "instant",
    billingModel: "hour",
    totalCost: 320,
    status: "confirmed",
    paymentStatus: "paid",
    upiReference: "UPI-DEMO-48122",
    createdAt: "2026-04-15T10:00:00.000Z"
  }
];

export const demoReviews: Review[] = [
  {
    id: "review-1",
    userId: "driver-1",
    parkingId: "space-1",
    rating: 5,
    comment: "Smooth entry, safe area, and very close to the metro.",
    userName: "Rahul Driver",
    createdAt: "2026-04-12T08:30:00.000Z"
  },
  {
    id: "review-2",
    userId: "driver-1",
    parkingId: "space-2",
    rating: 4,
    comment: "Easy to find and host was responsive. Slightly tight for larger SUVs.",
    userName: "Rahul Driver",
    createdAt: "2026-04-09T12:15:00.000Z"
  }
];
