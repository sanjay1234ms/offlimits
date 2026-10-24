-- Secret Santa draws. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Only the site's server (service role key) touches this table. Row Level
-- Security is on with no policies, so the public anon key can't read pairings.

create table if not exists public.secret_santa_draws (
  id              text primary key,
  organiser_token text not null,
  title           text not null default '',
  names           jsonb not null,
  receivers       jsonb not null,
  currency        text not null default '',
  budget          text not null default '',
  exchange_date   text not null default '',
  message         text not null default '',
  opened          jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null
);

alter table public.secret_santa_draws enable row level security;

create index if not exists secret_santa_draws_expires_idx
  on public.secret_santa_draws (expires_at);

-- Optional tidy-up: delete expired draws daily (needs the pg_cron extension,
-- Database -> Extensions -> pg_cron). Safe to skip; expired draws are hidden anyway.
-- select cron.schedule('santa-cleanup', '0 4 * * *',
--   $$delete from public.secret_santa_draws where expires_at < now()$$);
