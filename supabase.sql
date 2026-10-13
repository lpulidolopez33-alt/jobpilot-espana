-- Execute in Supabase SQL Editor. Never expose service_role keys in the browser.
create table if not exists public.jobpilot_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{}'::jsonb,
 version bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.jobpilot_state enable row level security;
create policy "Users read own state" on public.jobpilot_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own state" on public.jobpilot_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own state" on public.jobpilot_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
