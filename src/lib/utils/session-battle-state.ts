const KEY = 'pushquest_session_battle_result';

export interface SessionBattleResult {
  reps: number;
  formScore: number | null;
}

export function saveSessionBattleResult(result: SessionBattleResult): void {
  try { localStorage.setItem(KEY, JSON.stringify(result)); } catch {}
}

export function loadSessionBattleResult(): SessionBattleResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSessionBattleResult(): void {
  try { localStorage.removeItem(KEY); } catch {}
}
