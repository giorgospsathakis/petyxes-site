-- ============================================================
-- Supabase setup για τη δημόσια σελίδα του φροντιστηρίου
-- Τρέξε ολόκληρο αυτό το script στο SQL Editor του νέου Supabase project
-- ============================================================

-- 1. Roles
-- --------------------------------------------------
create type public.app_role as enum ('admin', 'teacher', 'parent');

-- 2. User roles table (πάντα ξεχωριστός πίνακας από profiles)
-- --------------------------------------------------
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role public.app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

-- Ο χρήστης βλέπει μόνο τα δικά του roles
-- Δεν χρειάζεται να βλέπει άλλων, αλλά το αφήνουμε ασφαλές

create policy "Users can read own roles" on public.user_roles
for select
  to authenticated
  using (auth.uid() = user_id);

-- 3. Security definer helper για admin έλεγχο
-- --------------------------------------------------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- 4. Site posts table (ανακοινώσεις, δράσεις, επιτυχίες)
-- --------------------------------------------------
create table public.site_posts (
    id uuid primary key default gen_random_uuid(),
    category text not null default 'announcement' check (category in ('announcement', 'activity', 'success')),
    title text not null,
    body text,
    image_path text,
    event_date date,
    published boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

grant select, insert, update, delete on public.site_posts to authenticated;
grant all on public.site_posts to service_role;
grant select on public.site_posts to anon;

alter table public.site_posts enable row level security;

-- Οποιοσδήποτε μπορεί να διαβάσει τα published posts

create policy "Public can read published posts" on public.site_posts
for select
  to anon, authenticated
  using (published = true);

-- Admin μπορεί να διαβάζει/γράφει/σβήνει όλα

create policy "Admins can manage all posts" on public.site_posts
for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 5. Storage policies για το bucket site-media
--    Υποθέτουμε ότι το bucket έχει ήδη δημιουργηθεί ως Private.
-- --------------------------------------------------

-- Ανώνυμοι μπορούν να διαβάσουν (μέσω signed URLs) μόνο από public bucket.
-- Επειδή το bucket είναι private, αφήνουμε SELECT μόνο σε authenticated.

-- Enable RLS on storage.objects (default είναι ήδη enabled, αλλά για σιγουριά)

-- Admin: upload

create policy "Admins can upload site media" on storage.objects
for insert
  to authenticated
  with check (
    bucket_id = 'site-media'
    and public.has_role(auth.uid(), 'admin')
  );

-- Admin: update/delete

create policy "Admins can update or delete site media" on storage.objects
for all
  to authenticated
  using (
    bucket_id = 'site-media'
    and public.has_role(auth.uid(), 'admin')
  );

-- 6. Extension / helper για updated_at
-- --------------------------------------------------
create extension if not exists moddatetime schema extensions;

-- Trigger για αυτόματο updated_at

create trigger handle_updated_at_site_posts
  before update on public.site_posts
  for each row
  execute function extensions.moddatetime (updated_at);

-- ============================================================
-- Τέλος script
-- Μετά από αυτό, φτιάξε τον admin χρήστη και τρέξε:
-- insert into public.user_roles (user_id, role) values ('UUID', 'admin');
-- ============================================================
