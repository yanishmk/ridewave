create extension if not exists pgcrypto;

create table if not exists public.jet_skis (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  brand text not null,
  model text not null,
  year integer not null check (year >= 1990),
  type text not null check (type in ('Sport', 'Familial', 'Premium', 'Débutant')),
  location text not null,
  area text not null,
  coordinate_x numeric not null check (coordinate_x >= 0 and coordinate_x <= 100),
  coordinate_y numeric not null check (coordinate_y >= 0 and coordinate_y <= 100),
  passengers integer not null check (passengers >= 1 and passengers <= 4),
  horsepower integer not null check (horsepower > 0),
  price_per_day integer not null check (price_per_day >= 0),
  weekend_price integer not null check (weekend_price >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  deposit integer not null default 0 check (deposit >= 0),
  service_fee integer not null default 0 check (service_fee >= 0),
  distance_km integer not null default 0 check (distance_km >= 0),
  rating numeric(3, 2) not null default 5 check (rating >= 0 and rating <= 5),
  reviews integer not null default 0 check (reviews >= 0),
  delivery_available boolean not null default false,
  cancellation text not null check (cancellation in ('Flexible', 'Modérée', 'Stricte')),
  status text not null default 'active' check (status in ('active', 'paused')),
  host_name text not null,
  host_avatar text not null,
  host_rating numeric(3, 2) not null default 5 check (host_rating >= 0 and host_rating <= 5),
  host_response_time text not null,
  host_verified boolean not null default false,
  host_phone text not null,
  images text[] not null default '{}',
  features text[] not null default '{}',
  equipment text[] not null default '{}',
  rules text[] not null default '{}',
  description text not null,
  navigation_zone text not null,
  created_at timestamptz not null default now()
);

alter table public.jet_skis enable row level security;

grant select on public.jet_skis to anon;
grant select on public.jet_skis to authenticated;

drop policy if exists "public can read active jet skis" on public.jet_skis;

create policy "public can read active jet skis"
on public.jet_skis
for select
to anon, authenticated
using (status = 'active');

create index if not exists jet_skis_status_idx on public.jet_skis (status);
create index if not exists jet_skis_location_idx on public.jet_skis (location);
create index if not exists jet_skis_type_idx on public.jet_skis (type);
create index if not exists jet_skis_price_per_day_idx on public.jet_skis (price_per_day);
