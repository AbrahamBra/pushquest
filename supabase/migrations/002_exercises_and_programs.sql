-- ============================================================
-- Migration 002: Exercises catalog + Training Programs system
-- ============================================================

-- Exercise catalog (imported from free-exercise-db, public domain)
create table public.exercises (
  id text primary key,
  name text not null,
  force text check (force in ('push', 'pull', 'static')),
  level text not null check (level in ('beginner', 'intermediate', 'expert')),
  mechanic text check (mechanic in ('compound', 'isolation')),
  equipment text,
  category text not null check (category in ('strength', 'plyometrics', 'cardio', 'powerlifting', 'stretching', 'olympic weightlifting', 'strongman')),
  primary_muscles text[] not null,
  secondary_muscles text[] not null default '{}',
  instructions text[] not null default '{}',
  images text[] not null default '{}',
  -- PushQuest-specific: AI detection config (null = not AI-detectable)
  detection_config jsonb
);

alter table public.exercises enable row level security;
create policy "exercises_public_read" on public.exercises for select using (true);
create index idx_exercises_category on public.exercises(category);
create index idx_exercises_equipment on public.exercises(equipment);
create index idx_exercises_level on public.exercises(level);
create index idx_exercises_muscles on public.exercises using gin(primary_muscles);

-- Training programs (goal-based structured plans)
create table public.programs (
  id text primary key,
  name text not null,
  description text not null,
  goal text not null check (goal in ('hypertrophy', 'strength', 'endurance', 'cut', 'general')),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  duration_weeks int not null check (duration_weeks > 0),
  days_per_week int not null check (days_per_week between 1 and 7),
  split text not null check (split in ('full_body', 'upper_lower', 'ppl', 'bro_split', 'custom')),
  equipment_needed text[] not null default '{"body only"}',
  is_free boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.programs enable row level security;
create policy "programs_public_read" on public.programs for select using (true);

-- Program phases (periodization blocks within a program)
create table public.program_phases (
  id text primary key,
  program_id text not null references public.programs(id) on delete cascade,
  name text not null,
  description text not null default '',
  phase_order int not null,
  week_start int not null,
  week_end int not null,
  intensity text not null check (intensity in ('light', 'moderate', 'high', 'max')),
  unique (program_id, phase_order)
);

alter table public.program_phases enable row level security;
create policy "phases_public_read" on public.program_phases for select using (true);

-- Session templates (a workout day within a phase)
create table public.program_sessions (
  id text primary key,
  phase_id text not null references public.program_phases(id) on delete cascade,
  name text not null,           -- e.g. 'Push Day', 'Upper Body A', 'Full Body'
  day_of_week int,              -- 1=Mon...7=Sun, null=flexible
  session_order int not null,   -- order within the phase
  rest_between_exercises_secs int not null default 90,
  unique (phase_id, session_order)
);

alter table public.program_sessions enable row level security;
create policy "sessions_public_read" on public.program_sessions for select using (true);

-- Exercise prescriptions within a session
create table public.session_exercises (
  id serial primary key,
  session_id text not null references public.program_sessions(id) on delete cascade,
  exercise_id text not null references public.exercises(id),
  exercise_order int not null,
  sets int not null check (sets > 0),
  reps text not null,            -- e.g. '8-12', '5', '15-20', 'AMRAP'
  rest_secs int not null default 90,
  rpe real check (rpe between 1 and 10),  -- Rate of Perceived Exertion
  tempo text,                    -- e.g. '3-1-2-0' (eccentric-pause-concentric-pause)
  notes text,                    -- e.g. 'superset with next', 'drop set on last set'
  progression_rule text,         -- e.g. 'add_weight_when_top_reps', 'add_reps', 'add_set'
  unique (session_id, exercise_order)
);

alter table public.session_exercises enable row level security;
create policy "session_exercises_public_read" on public.session_exercises for select using (true);

-- User program enrollment (tracks which program a user is following)
create table public.user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  program_id text not null references public.programs(id),
  current_phase_id text references public.program_phases(id),
  current_week int not null default 1,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  is_active boolean not null default true
);

alter table public.user_programs enable row level security;
create policy "user_programs_select_own" on public.user_programs for select using (auth.uid() = user_id);
create policy "user_programs_insert_own" on public.user_programs for insert with check (auth.uid() = user_id);
create policy "user_programs_update_own" on public.user_programs for update using (auth.uid() = user_id);
create index idx_user_programs_active on public.user_programs(user_id) where is_active = true;

-- User exercise logs (individual set tracking)
create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  exercise_id text not null references public.exercises(id),
  session_date date not null default current_date,
  set_number int not null,
  reps_completed int not null,
  weight_kg real,
  rpe real check (rpe between 1 and 10),
  form_score real check (form_score between 0 and 1),
  notes text,
  logged_at timestamptz not null default now()
);

alter table public.exercise_logs enable row level security;
create policy "exercise_logs_select_own" on public.exercise_logs for select using (auth.uid() = user_id);
create policy "exercise_logs_insert_own" on public.exercise_logs for insert with check (auth.uid() = user_id);
create index idx_exercise_logs_user_date on public.exercise_logs(user_id, session_date desc);
create index idx_exercise_logs_exercise on public.exercise_logs(exercise_id, user_id);
