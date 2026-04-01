insert into public.bosses (id, name, hp, time_limit_secs, xp_reward, difficulty, required_level, is_free) values
  ('goblin', 'GOBLIN', 20, 180, 100, 'easy', 1, true),
  ('orc',    'ORC',    35, 240, 200, 'medium', 3, true),
  ('troll',  'TROLL',  50, 300, 350, 'hard', 5, false),
  ('titan',  'TITAN',  80, 420, 600, 'boss', 8, false);
