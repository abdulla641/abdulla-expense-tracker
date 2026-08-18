-- ITDesk Cloud V2 schema
-- Run this once in Supabase SQL Editor.

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  model text,
  asset_id text,
  serial text,
  ip text,
  location text,
  warranty date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assets_user_id_idx on public.assets(user_id);
create index if not exists assets_warranty_idx on public.assets(warranty);

alter table public.assets enable row level security;

drop policy if exists "Users can view their own assets" on public.assets;
drop policy if exists "Users can insert their own assets" on public.assets;
drop policy if exists "Users can update their own assets" on public.assets;
drop policy if exists "Users can delete their own assets" on public.assets;

create policy "Users can view their own assets"
  on public.assets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assets"
  on public.assets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own assets"
  on public.assets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own assets"
  on public.assets for delete
  using (auth.uid() = user_id);

-- Keep updated_at current when an asset changes.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assets_set_updated_at on public.assets;
create trigger assets_set_updated_at
before update on public.assets
for each row execute function public.set_updated_at();
