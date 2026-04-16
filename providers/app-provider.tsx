"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { demoBookings, demoParkingSpaces, demoReviews, demoUsers } from "@/lib/demo-data";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { createId } from "@/lib/utils";
import {
  AppUser,
  BillingModel,
  Booking,
  BookingMode,
  ParkingSpace,
  Review,
  UserRole
} from "@/lib/types";

const STORAGE_KEY = "parkspace-demo-state";
const SESSION_KEY = "parkspace-demo-session";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ListingPayload extends Omit<ParkingSpace, "id" | "ownerId"> {}

interface BookingPayload {
  parkingId: string;
  date: string;
  startTime: string;
  endTime: string;
  bookingMode: BookingMode;
  billingModel: BillingModel;
  totalCost: number;
}

interface ReviewPayload {
  parkingId: string;
  rating: number;
  comment: string;
}

interface AppContextValue {
  currentUser: AppUser | null;
  users: AppUser[];
  parkingSpaces: ParkingSpace[];
  bookings: Booking[];
  reviews: Review[];
  loading: boolean;
  demoMode: boolean;
  authError: string | null;
  signup: (payload: SignupPayload) => Promise<{ ok: boolean; message: string }>;
  login: (payload: LoginPayload) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  addParkingSpace: (payload: ListingPayload) => Promise<{ ok: boolean; message: string }>;
  addBooking: (payload: BookingPayload) => Promise<{ ok: boolean; message: string }>;
  addReview: (payload: ReviewPayload) => Promise<{ ok: boolean; message: string }>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function persistDemoState(users: AppUser[], parkingSpaces: ParkingSpace[], bookings: Booking[], reviews: Review[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      users,
      parkingSpaces,
      bookings,
      reviews
    })
  );
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(demoUsers);
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>(demoParkingSpaces);
  const [bookings, setBookings] = useState<Booking[]>(demoBookings);
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      if (!isSupabaseConfigured || !supabase) {
        if (typeof window !== "undefined") {
          const savedState = localStorage.getItem(STORAGE_KEY);
          const savedSession = localStorage.getItem(SESSION_KEY);

          if (savedState) {
            const parsed = JSON.parse(savedState);
            setUsers(parsed.users ?? demoUsers);
            setParkingSpaces(parsed.parkingSpaces ?? demoParkingSpaces);
            setBookings(parsed.bookings ?? demoBookings);
            setReviews(parsed.reviews ?? demoReviews);
          }

          if (savedSession) {
            const parsedUser = JSON.parse(savedSession) as AppUser;
            setCurrentUser(parsedUser);
          }
        }

        setLoading(false);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setAuthError(sessionError.message);
      }

      const sessionUserId = sessionData.session?.user?.id;

      const [{ data: userRows }, { data: listingRows }, { data: bookingRows }, { data: reviewRows }] =
        await Promise.all([
          supabase.from("users").select("*"),
          supabase.from("parking_spaces").select("*"),
          supabase.from("bookings").select("*"),
          supabase.from("reviews").select("*")
        ]);

      const mappedUsers = (userRows ?? []).map(
        (user): AppUser => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        })
      );

      const mappedListings = (listingRows ?? []).map(
        (listing): ParkingSpace => ({
          id: listing.id,
          ownerId: listing.owner_id,
          title: listing.title,
          address: listing.address,
          city: listing.city,
          latitude: listing.latitude,
          longitude: listing.longitude,
          description: listing.description,
          type: listing.type,
          images: listing.images ?? [],
          amenities: listing.amenities ?? [],
          priceHour: listing.price_hour,
          priceDay: listing.price_day,
          priceMonth: listing.price_month,
          availabilityDays: listing.availability_days ?? [],
          availabilityStart: listing.availability_start,
          availabilityEnd: listing.availability_end,
          instantBook: listing.instant_book
        })
      );

      const mappedBookings = (bookingRows ?? []).map(
        (booking): Booking => ({
          id: booking.id,
          userId: booking.user_id,
          parkingId: booking.parking_id,
          date: booking.date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          bookingMode: booking.booking_mode,
          billingModel: booking.billing_model,
          totalCost: booking.total_cost,
          status: booking.status,
          paymentStatus: booking.payment_status,
          upiReference: booking.upi_reference,
          createdAt: booking.created_at
        })
      );

      const mappedReviews = (reviewRows ?? []).map(
        (review): Review => ({
          id: review.id,
          userId: review.user_id,
          parkingId: review.parking_id,
          rating: review.rating,
          comment: review.comment,
          userName: review.user_name,
          createdAt: review.created_at
        })
      );

      setUsers(mappedUsers);
      setParkingSpaces(mappedListings.length ? mappedListings : demoParkingSpaces);
      setBookings(mappedBookings);
      setReviews(mappedReviews);

      if (sessionUserId) {
        const matchedUser = mappedUsers.find((user) => user.id === sessionUserId) ?? null;
        setCurrentUser(matchedUser);
      }

      setLoading(false);
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) return;
    persistDemoState(users, parkingSpaces, bookings, reviews);
  }, [users, parkingSpaces, bookings, reviews]);

  async function signup(payload: SignupPayload) {
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      const existing = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());

      if (existing) {
        return { ok: false, message: "This email is already registered in demo mode." };
      }

      const newUser: AppUser = {
        id: createId("user"),
        name: payload.name,
        email: payload.email,
        role: payload.role
      };

      const nextUsers = [newUser, ...users];
      setUsers(nextUsers);
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

      return { ok: true, message: "Demo account created and signed in." };
    }

    const authResult = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          role: payload.role
        }
      }
    });

    if (authResult.error || !authResult.data.user) {
      return { ok: false, message: authResult.error?.message ?? "Unable to create account." };
    }

    const newUser: AppUser = {
      id: authResult.data.user.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };

    await supabase.from("users").upsert({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    setUsers((prev) => [newUser, ...prev.filter((user) => user.id !== newUser.id)]);
    setCurrentUser(newUser);

    return { ok: true, message: "Account created successfully." };
  }

  async function login(payload: LoginPayload) {
    setAuthError(null);

    if (!isSupabaseConfigured || !supabase) {
      const matchedUser = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());

      if (!matchedUser) {
        return { ok: false, message: "Use host@parkspace.demo or driver@parkspace.demo in demo mode, or sign up." };
      }

      setCurrentUser(matchedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(matchedUser));
      return { ok: true, message: `Welcome back, ${matchedUser.name}.` };
    }

    const authResult = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (authResult.error || !authResult.data.user) {
      return { ok: false, message: authResult.error?.message ?? "Unable to sign in." };
    }

    const matchedUser =
      users.find((user) => user.id === authResult.data.user?.id) ??
      ({
        id: authResult.data.user.id,
        name: (authResult.data.user.user_metadata?.name as string) ?? "ParkSpace User",
        email: payload.email,
        role: (authResult.data.user.user_metadata?.role as UserRole) ?? "driver"
      } satisfies AppUser);

    setCurrentUser(matchedUser);
    setUsers((prev) => [matchedUser, ...prev.filter((user) => user.id !== matchedUser.id)]);

    return { ok: true, message: `Welcome back, ${matchedUser.name}.` };
  }

  async function logout() {
    if (!isSupabaseConfigured || !supabase) {
      setCurrentUser(null);
      localStorage.removeItem(SESSION_KEY);
      return;
    }

    await supabase.auth.signOut();
    setCurrentUser(null);
  }

  async function addParkingSpace(payload: ListingPayload) {
    if (!currentUser) {
      return { ok: false, message: "Please sign in before publishing a listing." };
    }

    const newSpace: ParkingSpace = {
      ...payload,
      id: createId("space"),
      ownerId: currentUser.id
    };

    if (!isSupabaseConfigured || !supabase) {
      setParkingSpaces((prev) => [newSpace, ...prev]);
      return { ok: true, message: "Listing published in demo mode." };
    }

    const result = await supabase.from("parking_spaces").insert({
      id: newSpace.id,
      owner_id: newSpace.ownerId,
      title: newSpace.title,
      address: newSpace.address,
      city: newSpace.city,
      latitude: newSpace.latitude,
      longitude: newSpace.longitude,
      description: newSpace.description,
      type: newSpace.type,
      images: newSpace.images,
      amenities: newSpace.amenities,
      price_hour: newSpace.priceHour,
      price_day: newSpace.priceDay,
      price_month: newSpace.priceMonth,
      availability_days: newSpace.availabilityDays,
      availability_start: newSpace.availabilityStart,
      availability_end: newSpace.availabilityEnd,
      instant_book: newSpace.instantBook
    });

    if (result.error) {
      return { ok: false, message: result.error.message };
    }

    setParkingSpaces((prev) => [newSpace, ...prev]);
    return { ok: true, message: "Listing published successfully." };
  }

  async function addBooking(payload: BookingPayload) {
    if (!currentUser) {
      return { ok: false, message: "Please sign in before booking a parking space." };
    }

    const newBooking: Booking = {
      id: createId("booking"),
      userId: currentUser.id,
      parkingId: payload.parkingId,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      bookingMode: payload.bookingMode,
      billingModel: payload.billingModel,
      totalCost: payload.totalCost,
      status: payload.bookingMode === "instant" ? "confirmed" : "pending",
      paymentStatus: "paid",
      upiReference: `UPI-${Math.random().toString().slice(2, 8)}`,
      createdAt: new Date().toISOString()
    };

    if (!isSupabaseConfigured || !supabase) {
      setBookings((prev) => [newBooking, ...prev]);
      return {
        ok: true,
        message:
          newBooking.status === "confirmed"
            ? "Booking confirmed and payment captured in demo mode."
            : "Booking request sent and payment marked as received in demo mode."
      };
    }

    const result = await supabase.from("bookings").insert({
      id: newBooking.id,
      user_id: newBooking.userId,
      parking_id: newBooking.parkingId,
      date: newBooking.date,
      start_time: newBooking.startTime,
      end_time: newBooking.endTime,
      booking_mode: newBooking.bookingMode,
      billing_model: newBooking.billingModel,
      total_cost: newBooking.totalCost,
      status: newBooking.status,
      payment_status: newBooking.paymentStatus,
      upi_reference: newBooking.upiReference,
      created_at: newBooking.createdAt
    });

    if (result.error) {
      return { ok: false, message: result.error.message };
    }

    setBookings((prev) => [newBooking, ...prev]);
    return { ok: true, message: "Booking created successfully." };
  }

  async function addReview(payload: ReviewPayload) {
    if (!currentUser) {
      return { ok: false, message: "Please sign in before leaving a review." };
    }

    const newReview: Review = {
      id: createId("review"),
      userId: currentUser.id,
      parkingId: payload.parkingId,
      rating: payload.rating,
      comment: payload.comment,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    if (!isSupabaseConfigured || !supabase) {
      setReviews((prev) => [newReview, ...prev]);
      return { ok: true, message: "Review added in demo mode." };
    }

    const result = await supabase.from("reviews").insert({
      id: newReview.id,
      user_id: newReview.userId,
      parking_id: newReview.parkingId,
      rating: newReview.rating,
      comment: newReview.comment,
      user_name: newReview.userName,
      created_at: newReview.createdAt
    });

    if (result.error) {
      return { ok: false, message: result.error.message };
    }

    setReviews((prev) => [newReview, ...prev]);
    return { ok: true, message: "Review added successfully." };
  }

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      users,
      parkingSpaces,
      bookings,
      reviews,
      loading,
      demoMode: !isSupabaseConfigured,
      authError,
      signup,
      login,
      logout,
      addParkingSpace,
      addBooking,
      addReview
    }),
    [authError, bookings, currentUser, loading, parkingSpaces, reviews, users]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
