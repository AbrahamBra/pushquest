import { writable } from 'svelte/store';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ChallengeStoreValue {
  count: number;
  loading: boolean;
}

// null = not initialized / anonymous
const { subscribe, set, update } = writable<ChallengeStoreValue | null>(null);

let _client: SupabaseClient | null = null;
let _userId: string | null = null;
let _visibilityHandler: (() => void) | null = null;

async function fetchCount(): Promise<void> {
  if (!_client || !_userId) return;

  update((state) => (state ? { ...state, loading: true } : { count: 0, loading: true }));

  const { count, error } = await _client
    .from('challenges')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', _userId)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString());

  if (error) {
    update((state) => (state ? { ...state, loading: false } : { count: 0, loading: false }));
    return;
  }

  set({ count: count ?? 0, loading: false });
}

/** Call once after auth is confirmed, from root layout */
export async function init(client: SupabaseClient, userId: string): Promise<void> {
  _client = client;
  _userId = userId;

  // Remove any existing listener before adding a new one
  if (_visibilityHandler) {
    document.removeEventListener('visibilitychange', _visibilityHandler);
  }

  _visibilityHandler = () => {
    if (document.visibilityState === 'visible') {
      fetchCount();
    }
  };

  document.addEventListener('visibilitychange', _visibilityHandler);

  await fetchCount();
}

/** Call on logout to clear state and listeners */
export function reset(): void {
  if (_visibilityHandler) {
    document.removeEventListener('visibilitychange', _visibilityHandler);
    _visibilityHandler = null;
  }
  _client = null;
  _userId = null;
  set(null);
}

export const challengeStore = { subscribe, refresh: fetchCount };
