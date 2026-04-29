-- LaPrincesse — Supabase Schema
-- Auth is handled by Cloudflare Access (not Supabase Auth).
-- user_id columns store the Cloudflare Access subject UUID (payload.sub).
-- RLS is disabled — Cloudflare Access edge policies + Worker-side JWT verification
-- control access instead of Supabase row-level security.
-- Run this in: Supabase → SQL Editor → New Query → Paste → Run

-- ── Designs ──────────────────────────────────────────────────
create table if not exists designs (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,                  -- CF Access sub UUID
  name text not null default 'My Design',
  shape text not null,
  length text not null,
  material text not null,
  gems jsonb default '{}',
  created_at timestamptz default now()
);
-- No RLS: access controlled at Cloudflare Access edge + server function JWT validation

-- ── Artists ───────────────────────────────────────────────────
create table if not exists artists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  studio text,
  rating numeric(4,2) default 5.00,
  bio text,
  avatar_url text,
  location text,
  specialties text[] default '{}',
  available boolean default true,
  created_at timestamptz default now()
);

-- Seed artists
insert into artists (name, studio, rating, bio, location, specialties) values
  ('Ines M.',    'Studio Marais',       4.96, 'Specialist in chrome finishes and gel extensions. 8 years in luxury nail art across Paris and Milan.', 'Paris · 4e', array['Chrome','Gel Extensions','Nail Art']),
  ('Sofia R.',   'Atelier Pigalle',     4.89, 'Master of minimalist design and gem placement. Trained at École de Beauté Paris.',                       'Paris · 9e', array['Minimalist','Gems','Pastels']),
  ('Camille V.', 'Nail Bar Bastille',   4.92, '3D nail art and glass effect specialist. Known for avant-garde editorial work.',                          'Paris · 11e', array['3D Art','Glass Effect','Ombré']),
  ('Léa D.',     'La Princesse Studio', 5.00, 'Head artist at LaPrincesse. Expert in all techniques, specialising in bridal and editorial.',             'Paris · 2e', array['Bridal','Editorial','All Techniques'])
on conflict do nothing;

-- ── Appointments ─────────────────────────────────────────────
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,                  -- CF Access sub UUID
  artist_id uuid references artists not null,
  design_id uuid references designs on delete set null,
  date date not null,
  time_slot text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  price numeric(10,2) not null,
  notes text,
  created_at timestamptz default now()
);
-- No RLS: protected at Cloudflare Access edge

-- ── Indexes (performance) ─────────────────────────────────────
create index if not exists designs_user_id_idx on designs(user_id);
create index if not exists appointments_user_id_idx on appointments(user_id);
create index if not exists appointments_date_idx on appointments(date);
create index if not exists appointments_status_idx on appointments(status);

