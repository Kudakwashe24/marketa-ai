-- Run this migration once in the Supabase SQL editor.

create table if not exists public.business_profiles (
  user_id text primary key,
  business_name text,
  business_type text,
  custom_business_type text,
  description text,
  target_audience text,
  location text,
  phone text,
  website text,
  instagram text,
  brand_voice text not null default 'Friendly',
  primary_color text not null default '#4f46e5',
  secondary_color text not null default '#0f172a',
  preferred_cta text,
  logo_url text,
  brand_images jsonb not null default '[]'::jsonb
    check (jsonb_typeof(brand_images) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Business profiles and brand uploads are accessed only from authenticated
-- Next.js API routes using the Supabase secret key.
