# ParkSpace

ParkSpace is a mobile-first MVP for a peer-to-peer parking marketplace. Drivers can search and book nearby parking spaces, while hosts can list unused parking areas and earn from them.

## What is included

- Next.js App Router frontend
- Supabase-ready auth and database integration
- Demo mode fallback using local state and localStorage
- Host listing flow for parking space creation
- Driver search flow with filters and a visual map panel
- Booking flow with dynamic pricing and mock UPI payment
- Ratings and reviews
- Responsive Airbnb-inspired UI

## Routes

- `/` landing page + marketplace search
- `/auth` login and signup with role selection
- `/dashboard` role-based dashboard
- `/listings/[id]` parking space details, booking, reviews

## Tech stack

- Next.js
- React
- TypeScript
- Supabase (`@supabase/supabase-js`)
- Supabase Storage for parking image uploads

## Local setup

1. Install dependencies:
   - `npm install`
2. Copy envs:
   - Duplicate `.env.example` to `.env.local`
3. Add your Supabase project values if you want live backend mode.
4. Optional: set `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` if you want a bucket name other than `parking-images`.
5. Run the app:
   - `npm run dev`

If no Supabase credentials are provided, ParkSpace automatically runs in demo mode with seeded users, spaces, bookings, and reviews.

## Demo accounts

- Driver: `driver@parkspace.demo`
- Host: `host@parkspace.demo`
- In demo mode, any password is accepted for existing seeded users.

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run `C:\Users\HP\OneDrive\Desktop\ParkSpace\supabase\schema.sql`.
4. Create a public Storage bucket named `parking-images` in Supabase, or set `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` to your chosen bucket.
5. Add a Storage policy that allows authenticated users to upload and read parking images in that bucket.
6. Add your project URL and anon key to `.env.local`.
7. Restart the app.

## Notes

- Payments are mocked with a simple UPI-style confirmation flow for MVP speed.
- Host image uploads now use Supabase Storage when configured, and fall back to browser-local previews in demo mode.
- The map is implemented as a lightweight interactive neighbourhood visualization so the app works even without extra map API setup.
- Navigation uses Google Maps deep links.
- The code is structured so you can replace the demo map with Mapbox or Google Maps later without rewriting the booking flows.
