-- Migration: Initial schema for profiles and eligibility_results
-- Timestamp: 20260920_001

-- ─── Profiles Table ───

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  education_level text,
  branch text,
  cgpa text,
  years_of_experience text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on row modification
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies: users can only access their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ─── Eligibility Results Table ───

create table if not exists public.eligibility_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null,
  profile jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

-- Index for efficient user-scoped queries ordered by date
create index if not exists idx_eligibility_results_user_created
  on public.eligibility_results (user_id, created_at desc);

-- Enable RLS
alter table public.eligibility_results enable row level security;

-- RLS Policies: users can only access their own results
create policy "Users can view own results"
  on public.eligibility_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own results"
  on public.eligibility_results for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own results"
  on public.eligibility_results for delete
  using (auth.uid() = user_id);
