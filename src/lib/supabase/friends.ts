import { createClient } from './client';

export interface FriendInfo {
  id: string;
  display_name: string;
  level: number;
  friend_code: string;
  total_reps: number;
}

export interface ChallengeInfo {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_level: number;
  boss_id: string;
  exercise_type: string;
  sender_reps: number;
  sender_time_secs: number;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  level: number;
  total_reps: number;
  total_xp: number;
  victories: number;
}

/** Get the current user's friend code */
export async function getMyFriendCode(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('users')
    .select('friend_code')
    .eq('id', user.id)
    .single();

  return data?.friend_code ?? null;
}

/** Lookup a friend by their code */
export async function lookupFriendCode(code: string): Promise<{ id: string; display_name: string; level: number } | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('lookup_friend_code', { code: code.toUpperCase() });
  if (error || !data || data.length === 0) return null;
  return data[0];
}

/** Add a friend by their code */
export async function addFriend(code: string): Promise<{ success: boolean; error?: string; friend_name?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('add_friend', { code: code.toUpperCase() });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, friend_name: data?.friend_name };
}

/** Get all friends */
export async function getFriendsList(): Promise<FriendInfo[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('friendships')
    .select('friend_id, users!friendships_friend_id_fkey(id, display_name, level, friend_code, total_reps)')
    .eq('user_id', user.id);

  if (!data) return [];

  return data.map((row: any) => ({
    id: row.users.id,
    display_name: row.users.display_name,
    level: row.users.level,
    friend_code: row.users.friend_code,
    total_reps: row.users.total_reps,
  }));
}

/** Remove a friend */
export async function removeFriend(friendId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.rpc('remove_friend', { p_friend_id: friendId });
  return !error;
}

/** Apply referral code (+200 XP both) */
export async function applyReferral(code: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('apply_referral', { referrer_code: code.toUpperCase() });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true };
}

// ─── Challenges ─────────────────────────

/** Send a challenge to a friend */
export async function sendChallenge(params: {
  receiverId: string;
  bossId: string;
  exerciseType: string;
  senderReps: number;
  senderTimeSecs: number;
}): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('challenges').insert({
    sender_id: user.id,
    receiver_id: params.receiverId,
    boss_id: params.bossId,
    exercise_type: params.exerciseType,
    sender_reps: params.senderReps,
    sender_time_secs: params.senderTimeSecs,
  });

  return !error;
}

/** Get pending challenges for current user */
export async function getPendingChallenges(): Promise<ChallengeInfo[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('challenges')
    .select('*, sender:users!challenges_sender_id_fkey(display_name, level)')
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map((row: any) => ({
    id: row.id,
    sender_id: row.sender_id,
    sender_name: row.sender?.display_name ?? 'Unknown',
    sender_level: row.sender?.level ?? 1,
    boss_id: row.boss_id,
    exercise_type: row.exercise_type,
    sender_reps: row.sender_reps,
    sender_time_secs: row.sender_time_secs,
    status: row.status,
    created_at: row.created_at,
  }));
}

/** Complete a challenge with receiver's result */
export async function completeChallenge(challengeId: string, reps: number, timeSecs: number): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('challenges')
    .update({ receiver_reps: reps, receiver_time_secs: timeSecs, status: 'completed' })
    .eq('id', challengeId);

  return !error;
}

// ─── Leaderboard ─────────────────────────

/** Get weekly leaderboard among friends */
export async function getFriendsLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get friend IDs
  const { data: friendships } = await supabase
    .from('friendships')
    .select('friend_id')
    .eq('user_id', user.id);

  const friendIds = friendships?.map((f: any) => f.friend_id) ?? [];
  const allIds = [user.id, ...friendIds];

  // Query leaderboard view
  const { data } = await supabase
    .from('weekly_leaderboard')
    .select('*')
    .in('user_id', allIds)
    .order('total_reps', { ascending: false });

  if (!data) return [];

  return data.map((row: any) => ({
    user_id: row.user_id,
    display_name: row.display_name,
    level: row.level,
    total_reps: row.total_reps ?? 0,
    total_xp: row.total_xp ?? 0,
    victories: row.victories ?? 0,
  }));
}
