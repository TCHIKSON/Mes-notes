create extension if not exists "pgcrypto";

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  titre text not null check (char_length(trim(titre)) between 1 and 80),
  contenu text not null default '',
  cree_le timestamptz not null default now()
);

alter table public.notes enable row level security;

drop policy if exists "notes_select_public" on public.notes;
drop policy if exists "notes_insert_public" on public.notes;
drop policy if exists "notes_update_public" on public.notes;
drop policy if exists "notes_delete_public" on public.notes;

create policy "notes_select_public"
on public.notes
for select
using (true);

create policy "notes_insert_public"
on public.notes
for insert
with check (true);

create policy "notes_update_public"
on public.notes
for update
using (true)
with check (true);

create policy "notes_delete_public"
on public.notes
for delete
using (true);

create index if not exists notes_cree_le_idx
on public.notes (cree_le desc);
