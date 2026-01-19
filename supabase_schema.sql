-- 1. Enable RLS (Row Level Security)
-- This ensures users can ONLY see/edit their own data.

-- COLLECTION TABLE
create table public.collection (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  card_id text not null, -- Scryfall ID
  quantity integer default 1,
  card_data jsonb not null, -- Full Scryfall object
  added_at bigint default (extract(epoch from now()) * 1000)
);

alter table public.collection enable row level security;

create policy "Users can view their own collection"
  on public.collection for select
  using (auth.uid() = user_id);

create policy "Users can insert into their own collection"
  on public.collection for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own collection"
  on public.collection for update
  using (auth.uid() = user_id);

create policy "Users can delete from their own collection"
  on public.collection for delete
  using (auth.uid() = user_id);


-- DECKS TABLE
create table public.decks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  cards jsonb default '[]'::jsonb, -- Array of card objects with quantity
  created_at bigint default (extract(epoch from now()) * 1000)
);

alter table public.decks enable row level security;

create policy "Users can view their own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own decks"
  on public.decks for delete
  using (auth.uid() = user_id);
