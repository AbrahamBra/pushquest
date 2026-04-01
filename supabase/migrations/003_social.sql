-- ============================================================
-- Migration 003: Social — Friend codes, friendships, challenges, leaderboard
-- ============================================================

-- Add friend_code to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS friend_code text UNIQUE;

-- Generate 6-char friend code (no ambiguous chars: O/0/I/1/L)
CREATE OR REPLACE FUNCTION public.generate_friend_code() RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text := '';
  i int;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    -- Check uniqueness
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE friend_code = code);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Auto-assign friend_code on user creation
CREATE OR REPLACE FUNCTION public.auto_friend_code() RETURNS trigger AS $$
BEGIN
  IF NEW.friend_code IS NULL THEN
    NEW.friend_code := public.generate_friend_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_friend_code
  BEFORE INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_friend_code();

-- Backfill existing users without codes
UPDATE public.users SET friend_code = public.generate_friend_code() WHERE friend_code IS NULL;

-- ─── Friendships (bidirectional) ─────────────────────────

CREATE TABLE public.friendships (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "friendships_select_own" ON public.friendships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "friendships_delete_own" ON public.friendships FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_friendships_user ON public.friendships(user_id);

-- Lookup friend by code (public RPC)
CREATE OR REPLACE FUNCTION public.lookup_friend_code(code text)
RETURNS TABLE(id uuid, display_name text, level int) AS $$
BEGIN
  RETURN QUERY
    SELECT u.id, u.display_name, u.level
    FROM public.users u
    WHERE u.friend_code = upper(code)
    AND u.id <> auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add friend by code (bidirectional insert)
CREATE OR REPLACE FUNCTION public.add_friend(code text)
RETURNS json AS $$
DECLARE
  friend_uid uuid;
  friend_name text;
BEGIN
  SELECT u.id, u.display_name INTO friend_uid, friend_name
    FROM public.users u WHERE u.friend_code = upper(code) AND u.id <> auth.uid();

  IF friend_uid IS NULL THEN
    RETURN json_build_object('error', 'Code introuvable');
  END IF;

  -- Check if already friends
  IF EXISTS (SELECT 1 FROM public.friendships WHERE user_id = auth.uid() AND friend_id = friend_uid) THEN
    RETURN json_build_object('error', 'Deja amis');
  END IF;

  -- Bidirectional insert
  INSERT INTO public.friendships (user_id, friend_id) VALUES (auth.uid(), friend_uid);
  INSERT INTO public.friendships (user_id, friend_id) VALUES (friend_uid, auth.uid());

  RETURN json_build_object('success', true, 'friend_name', friend_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove friend (bidirectional delete)
CREATE OR REPLACE FUNCTION public.remove_friend(p_friend_id uuid)
RETURNS json AS $$
BEGIN
  DELETE FROM public.friendships WHERE user_id = auth.uid() AND friend_id = p_friend_id;
  DELETE FROM public.friendships WHERE user_id = p_friend_id AND friend_id = auth.uid();
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Challenges ─────────────────────────

CREATE TABLE public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  boss_id text NOT NULL REFERENCES public.bosses(id),
  exercise_type text NOT NULL,
  sender_reps int NOT NULL,
  sender_time_secs int NOT NULL,
  receiver_reps int,
  receiver_time_secs int,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  CHECK (sender_id <> receiver_id)
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challenges_select_own" ON public.challenges
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "challenges_insert_sender" ON public.challenges
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "challenges_update_receiver" ON public.challenges
  FOR UPDATE USING (auth.uid() = receiver_id);
CREATE INDEX idx_challenges_receiver ON public.challenges(receiver_id, status) WHERE status = 'pending';

-- ─── Referrals ─────────────────────────

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  xp_granted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_select_own" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Apply referral: +200 XP both
CREATE OR REPLACE FUNCTION public.apply_referral(referrer_code text)
RETURNS json AS $$
DECLARE
  referrer_uid uuid;
BEGIN
  SELECT u.id INTO referrer_uid
    FROM public.users u WHERE u.friend_code = upper(referrer_code) AND u.id <> auth.uid();

  IF referrer_uid IS NULL THEN
    RETURN json_build_object('error', 'Code introuvable');
  END IF;

  IF EXISTS (SELECT 1 FROM public.referrals WHERE referred_id = auth.uid()) THEN
    RETURN json_build_object('error', 'Deja parraine');
  END IF;

  INSERT INTO public.referrals (referrer_id, referred_id, xp_granted) VALUES (referrer_uid, auth.uid(), true);
  UPDATE public.users SET xp = xp + 200 WHERE id = referrer_uid;
  UPDATE public.users SET xp = xp + 200 WHERE id = auth.uid();

  -- Auto-friend
  INSERT INTO public.friendships (user_id, friend_id) VALUES (auth.uid(), referrer_uid) ON CONFLICT DO NOTHING;
  INSERT INTO public.friendships (user_id, friend_id) VALUES (referrer_uid, auth.uid()) ON CONFLICT DO NOTHING;

  RETURN json_build_object('success', true, 'xp_bonus', 200);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Weekly leaderboard view ─────────────────────────

CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT
  b.user_id,
  u.display_name,
  u.level,
  u.friend_code,
  date_trunc('week', b.played_at)::date AS week_start,
  COUNT(*) AS battles_count,
  SUM(b.reps_completed) AS total_reps,
  SUM(b.xp_earned) AS total_xp,
  COUNT(*) FILTER (WHERE b.result = 'victory') AS victories
FROM public.battles b
JOIN public.users u ON u.id = b.user_id
WHERE b.played_at >= date_trunc('week', now())
GROUP BY b.user_id, u.display_name, u.level, u.friend_code, date_trunc('week', b.played_at)::date;
