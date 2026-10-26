-- Multi-phone party games: "How well do you know…" quizzes and prediction
-- pools. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Server-only (service role); RLS on with no policies.

create table if not exists public.party_boards (
  id           text primary key,
  kind         text not null,               -- 'quiz' | 'pool'
  owner_token  text not null,
  title        text not null default '',
  config       jsonb not null,              -- questions + answers / pool fields
  result       jsonb,                       -- pool: the real answers once revealed
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null
);

create table if not exists public.party_board_entries (
  id          bigint generated always as identity primary key,
  board_id    text not null references public.party_boards(id) on delete cascade,
  name        text not null,
  payload     jsonb not null,
  score       integer,
  created_at  timestamptz not null default now()
);

alter table public.party_boards enable row level security;
alter table public.party_board_entries enable row level security;

create index if not exists party_board_entries_board_idx on public.party_board_entries (board_id, created_at);
