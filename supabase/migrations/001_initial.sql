-- Users (level auto-computed from XP via trigger)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Warrior',
  xp int not null default 0 check (xp >= 0),
  level int not null default 1 check (level >= 1),
  total_reps int not null default 0,
  total_battles int not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.compute_level(p_xp int) returns int as $$
begin
  return greatest(1, floor(power(p_xp::numeric / 100.0, 2.0/3.0))::int);
end;
$$ language plpgsql immutable;

create or replace function public.sync_level() returns trigger as $$
begin
  NEW.level := public.compute_level(NEW.xp);
  return NEW;
end;
$$ language plpgsql;

create trigger trg_sync_level
  before insert or update of xp on public.users
  for each row execute function public.sync_level();

create table public.bosses (
  id text primary key,
  name text not null,
  hp int not null,
  time_limit_secs int not null,
  xp_reward int not null,
  difficulty text not null check (difficulty in ('easy','medium','hard','boss')),
  required_level int not null default 1,
  is_free boolean not null default true,
  exercise_type text not null default 'any',
  metadata jsonb not null default '{}'
);

create table public.battles (
  id uuid primary key default gen_random_uuid(),
  idempotency_key uuid unique,
  user_id uuid not null references public.users(id) on delete cascade,
  boss_id text not null references public.bosses(id),
  result text not null check (result in ('victory','defeat','fled')),
  exercise_type text not null,
  reps_completed int not null default 0,
  time_elapsed_secs int not null default 0,
  xp_earned int not null default 0,
  form_score_avg real,
  played_at timestamptz not null default now()
);

create index idx_battles_user_history on public.battles(user_id, played_at desc);
create index idx_battles_boss_result on public.battles(boss_id, result);

alter table public.users enable row level security;
alter table public.bosses enable row level security;
alter table public.battles enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "bosses_public_read" on public.bosses for select using (true);
create policy "battles_select_own" on public.battles for select using (auth.uid() = user_id);
create policy "battles_insert_own" on public.battles for insert with check (auth.uid() = user_id);
