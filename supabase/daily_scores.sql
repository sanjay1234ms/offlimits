-- Daily puzzle leaderboards (Word Heist, Off the Map, Close Call).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Server-only (service role); RLS on with no policies.

create table if not exists public.daily_scores (
  puzzle      text not null,                -- 'word-heist' | 'off-the-map' | 'close-call'
  day         integer not null,             -- days since launch (No. 1 = day 0)
  device_id   text not null,
  name        text not null default '',
  rank_value  double precision not null,    -- lower is better
  label       text not null,                -- what the table shows, e.g. '4/6' or '812'
  ms          integer not null,             -- time from first input, tiebreak
  created_at  timestamptz not null default now(),
  primary key (puzzle, day, device_id)
);

alter table public.daily_scores enable row level security;

create index if not exists daily_scores_board_idx
  on public.daily_scores (puzzle, day, rank_value, ms);
