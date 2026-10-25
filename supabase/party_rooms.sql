-- Party rooms (everyone plays on their own phone). Run once in Supabase:
-- SQL Editor -> New query -> paste -> Run.
-- Only the site's server (service role key) uses these tables. Row Level
-- Security is on with no policies, so the public anon key can't touch them.

create table if not exists public.party_rooms (
  code        text primary key,
  name        text not null default '',
  games       jsonb not null default '[]'::jsonb,
  host_id     text not null,
  phase       text not null default 'lobby',
  prompt_ids  jsonb not null default '[]'::jsonb,
  idx         integer not null default 0,
  created_at  timestamptz not null default now(),
  started_at  timestamptz
);

-- One row per player, so heartbeats from many phones never overwrite each
-- other's joins.
create table if not exists public.party_room_players (
  code       text not null references public.party_rooms(code) on delete cascade,
  player_id  text not null,
  name       text not null,
  last_seen  timestamptz not null default now(),
  joined_at  timestamptz not null default now(),
  primary key (code, player_id)
);

alter table public.party_rooms enable row level security;
alter table public.party_room_players enable row level security;

create index if not exists party_rooms_created_idx on public.party_rooms (created_at);
create index if not exists party_room_players_seen_idx on public.party_room_players (code, last_seen);
