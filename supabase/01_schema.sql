create extension if not exists pgcrypto;

create table if not exists public.jet_skis (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
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

alter table public.jet_skis
  add column if not exists owner_id uuid references auth.users(id) on delete set null;

alter table public.jet_skis enable row level security;

grant select on public.jet_skis to anon;
grant select on public.jet_skis to authenticated;
grant insert, update on public.jet_skis to authenticated;

drop policy if exists "public can read active jet skis" on public.jet_skis;

create policy "public can read active jet skis"
on public.jet_skis
for select
to anon, authenticated
using (status = 'active');

drop policy if exists "owners can read own jet skis" on public.jet_skis;
drop policy if exists "owners can insert own jet skis" on public.jet_skis;
drop policy if exists "owners can update own jet skis" on public.jet_skis;

create policy "owners can read own jet skis"
on public.jet_skis
for select
to authenticated
using (owner_id = auth.uid());

create policy "owners can insert own jet skis"
on public.jet_skis
for insert
to authenticated
with check (owner_id = auth.uid());

create policy "owners can update own jet skis"
on public.jet_skis
for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create index if not exists jet_skis_status_idx on public.jet_skis (status);
create index if not exists jet_skis_owner_id_idx on public.jet_skis (owner_id);
create index if not exists jet_skis_location_idx on public.jet_skis (location);
create index if not exists jet_skis_type_idx on public.jet_skis (type);
create index if not exists jet_skis_price_per_day_idx on public.jet_skis (price_per_day);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  phone text,
  role text not null default 'client' check (role in ('client', 'owner', 'both')),
  boating_card text,
  preference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "users can read own profile" on public.profiles;
drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;

create policy "users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'client')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

create table if not exists public.rental_requests (
  id text primary key default ('RW-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  client_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete set null,
  listing_slug text references public.jet_skis(slug) on delete set null,
  listing_name text not null,
  client_name text not null default '',
  start_date date,
  end_date date,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  location text not null default '',
  estimate_total integer not null default 0 check (estimate_total >= 0),
  mode text not null default 'delivery' check (mode in ('delivery', 'pickup')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rental_requests enable row level security;
grant select, insert, update on public.rental_requests to authenticated;

drop policy if exists "request participants can read" on public.rental_requests;
drop policy if exists "clients can create requests" on public.rental_requests;
drop policy if exists "participants can update requests" on public.rental_requests;

create policy "request participants can read"
on public.rental_requests
for select
to authenticated
using (client_id = auth.uid() or owner_id = auth.uid());

create policy "clients can create requests"
on public.rental_requests
for insert
to authenticated
with check (client_id = auth.uid());

create policy "participants can update requests"
on public.rental_requests
for update
to authenticated
using (client_id = auth.uid() or owner_id = auth.uid())
with check (client_id = auth.uid() or owner_id = auth.uid());

drop trigger if exists rental_requests_set_updated_at on public.rental_requests;
create trigger rental_requests_set_updated_at
before update on public.rental_requests
for each row execute function public.set_updated_at();

create index if not exists rental_requests_client_id_idx on public.rental_requests (client_id);
create index if not exists rental_requests_owner_id_idx on public.rental_requests (owner_id);
create index if not exists rental_requests_status_idx on public.rental_requests (status);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_slug text not null references public.jet_skis(slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_slug)
);

alter table public.favorites enable row level security;
grant select, insert, delete on public.favorites to authenticated;

drop policy if exists "users can manage own favorites" on public.favorites;

create policy "users can manage own favorites"
on public.favorites
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references auth.users(id) on delete cascade,
  owner_id uuid references auth.users(id) on delete set null,
  listing_slug text references public.jet_skis(slug) on delete set null,
  listing_name text not null,
  client_name text not null default '',
  owner_name text not null default '',
  status text not null default 'request' check (status in ('request', 'confirmed', 'open')),
  unread_for_client integer not null default 0 check (unread_for_client >= 0),
  unread_for_owner integer not null default 0 check (unread_for_owner >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
grant select, insert, update on public.conversations to authenticated;

drop policy if exists "conversation participants can read" on public.conversations;
drop policy if exists "conversation participants can create" on public.conversations;
drop policy if exists "conversation participants can update" on public.conversations;

create policy "conversation participants can read"
on public.conversations
for select
to authenticated
using (client_id = auth.uid() or owner_id = auth.uid());

create policy "conversation participants can create"
on public.conversations
for insert
to authenticated
with check (client_id = auth.uid() or owner_id = auth.uid());

create policy "conversation participants can update"
on public.conversations
for update
to authenticated
using (client_id = auth.uid() or owner_id = auth.uid())
with check (client_id = auth.uid() or owner_id = auth.uid());

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

create index if not exists conversations_client_id_idx on public.conversations (client_id);
create index if not exists conversations_owner_id_idx on public.conversations (owner_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
grant select, insert on public.messages to authenticated;

drop policy if exists "message participants can read" on public.messages;
drop policy if exists "message participants can create" on public.messages;

create policy "message participants can read"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.client_id = auth.uid() or c.owner_id = auth.uid())
  )
);

create policy "message participants can create"
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.client_id = auth.uid() or c.owner_id = auth.uid())
  )
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);
