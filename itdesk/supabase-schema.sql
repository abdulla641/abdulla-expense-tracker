-- ITDesk V2 database schema for Supabase
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  model text default '',
  asset_id text default '',
  serial text default '',
  ip text default '',
  location text default '',
  warranty date,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assets enable row level security;

-- V2 starter policy: authenticated users can manage assets.
-- Add company/user ownership policies before commercial multi-tenant launch.
create policy "authenticated users can read assets" on public.assets
  for select to authenticated using (true);
create policy "authenticated users can insert assets" on public.assets
  for insert to authenticated with check (true);
create policy "authenticated users can update assets" on public.assets
  for update to authenticated using (true) with check (true);
create policy "authenticated users can delete assets" on public.assets
  for delete to authenticated using (true);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists assets_updated_at on public.assets;
create trigger assets_updated_at before update on public.assets
for each row execute function public.set_updated_at();
