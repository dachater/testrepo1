-- Run this once in Supabase > SQL Editor.

create table public.items (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 200),
  quantity       integer not null default 1 check (quantity >= 0),
  room           text,
  category       text,
  notes          text,
  purchase_price numeric(10,2) check (purchase_price >= 0),
  purchase_date  date,
  photo_path     text,
  created_at     timestamptz not null default now()
);

create index items_user_idx on public.items (user_id, created_at desc);

alter table public.items enable row level security;

create policy "own items: select" on public.items for select using (user_id = auth.uid());
create policy "own items: insert" on public.items for insert with check (user_id = auth.uid());
create policy "own items: update" on public.items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own items: delete" on public.items for delete using (user_id = auth.uid());

-- Private photo bucket; files live under <user_id>/<filename>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('item-photos', 'item-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "own photos: select" on storage.objects for select
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos: insert" on storage.objects for insert
  with check (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos: delete" on storage.objects for delete
  using (bucket_id = 'item-photos' and (storage.foldername(name))[1] = auth.uid()::text);
