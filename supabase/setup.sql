-- Run once in Supabase → SQL Editor.
-- Everything here is members-only: anyone signed in can read and add; people can
-- only change or remove what they created themselves.

-- ------------------------------------------------------------------
-- 1. Photo storage (private bucket, read through signed URLs)
-- ------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'archive-photos',
  'archive-photos',
  false,
  15728640, -- 15 MB, matches MAX_PHOTO_BYTES in src/lib/supabase.ts
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do nothing;

create policy "Members can view archive photos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'archive-photos');

create policy "Members can upload archive photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'archive-photos');

create policy "Uploaders can delete their own archive photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'archive-photos' and owner_id = auth.uid()::text);

-- ------------------------------------------------------------------
-- 2. RSVPs for the next lunch
-- ------------------------------------------------------------------

create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  year        integer not null check (year >= 1964),
  name        text not null check (char_length(name) between 1 and 120),
  guests      integer not null default 0 check (guests between 0 and 10),
  note        text check (note is null or char_length(note) <= 500),
  created_at  timestamptz not null default now(),
  unique (user_id, year)
);

alter table public.rsvps enable row level security;

create policy "Members can see who is coming"
  on public.rsvps for select
  to authenticated
  using (true);

create policy "Members can confirm for themselves"
  on public.rsvps for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Members can update their own confirmation"
  on public.rsvps for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Members can cancel their own confirmation"
  on public.rsvps for delete
  to authenticated
  using (user_id = auth.uid());

-- ------------------------------------------------------------------
-- 3. Accounts: disable public sign-ups in Authentication → Providers → Email
--    and invite members from Authentication → Users → Invite.
-- ------------------------------------------------------------------
