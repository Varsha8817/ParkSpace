create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('driver', 'host')),
  created_at timestamptz not null default now()
);

create table if not exists public.parking_spaces (
  id text primary key,
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  address text not null,
  city text not null,
  latitude double precision not null,
  longitude double precision not null,
  description text not null,
  type text not null check (type in ('Garage', 'Open', 'Covered')),
  images text[] not null default '{}',
  amenities text[] not null default '{}',
  price_hour integer not null,
  price_day integer not null,
  price_month integer not null,
  availability_days text[] not null default '{}',
  availability_start text not null,
  availability_end text not null,
  instant_book boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  parking_id text not null references public.parking_spaces(id) on delete cascade,
  date date not null,
  start_time text not null,
  end_time text not null,
  booking_mode text not null check (booking_mode in ('instant', 'request')),
  billing_model text not null check (billing_model in ('hour', 'day', 'month')),
  total_cost integer not null,
  status text not null check (status in ('confirmed', 'pending')),
  payment_status text not null check (payment_status in ('paid', 'awaiting')),
  upi_reference text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  parking_id text not null references public.parking_spaces(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  user_name text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.parking_spaces enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "users readable" on public.users;
drop policy if exists "users insert own profile" on public.users;
drop policy if exists "users update own profile" on public.users;
create policy "users readable" on public.users for select using (true);
create policy "users insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "users update own profile" on public.users for update using (auth.uid() = id);

drop policy if exists "spaces readable" on public.parking_spaces;
drop policy if exists "hosts manage own spaces" on public.parking_spaces;
create policy "spaces readable" on public.parking_spaces for select using (true);
create policy "hosts manage own spaces" on public.parking_spaces for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "bookings readable to parties" on public.bookings;
drop policy if exists "drivers create bookings" on public.bookings;
create policy "bookings readable to parties" on public.bookings for select using (
  auth.uid() = user_id or
  exists (
    select 1 from public.parking_spaces spaces
    where spaces.id = parking_id and spaces.owner_id = auth.uid()
  )
);
create policy "drivers create bookings" on public.bookings for insert with check (auth.uid() = user_id);

drop policy if exists "reviews readable" on public.reviews;
drop policy if exists "reviewers create reviews" on public.reviews;
create policy "reviews readable" on public.reviews for select using (true);
create policy "reviewers create reviews" on public.reviews for insert with check (auth.uid() = user_id);
