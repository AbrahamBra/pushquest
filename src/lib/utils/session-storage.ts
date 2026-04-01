import type { SetLog } from '$lib/game/session-engine';

export interface ActiveProgram {
  programId: string;
  currentPhaseIdx: number;
  currentWeek: number;
  nextSessionIdx: number;
  startedAt: string;
}

export interface SessionCompletion {
  programId: string;
  phaseIdx: number;
  sessionIdx: number;
  date: string;
  totalReps: number;
  durationSecs: number;
  logs: SetLog[];
}

const KEYS = {
  activeProgram: 'pushquest_active_program',
  sessionHistory: 'pushquest_session_history',
  profile: 'pushquest_profile',
} as const;

// ─── Active Program ─────────────────────────

export function getActiveProgram(): ActiveProgram | null {
  try {
    const raw = localStorage.getItem(KEYS.activeProgram);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setActiveProgram(program: ActiveProgram): void {
  try {
    localStorage.setItem(KEYS.activeProgram, JSON.stringify(program));
  } catch {}
}

export function clearActiveProgram(): void {
  try {
    localStorage.removeItem(KEYS.activeProgram);
  } catch {}
}

export function advanceSession(totalSessions: number): void {
  const ap = getActiveProgram();
  if (!ap) return;

  ap.nextSessionIdx++;
  if (ap.nextSessionIdx >= totalSessions) {
    // Wrap around to first session, advance week
    ap.nextSessionIdx = 0;
    ap.currentWeek++;
  }

  setActiveProgram(ap);
}

// ─── Session History ─────────────────────────

export function getSessionHistory(): SessionCompletion[] {
  try {
    const raw = localStorage.getItem(KEYS.sessionHistory);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveSessionCompletion(completion: SessionCompletion): void {
  try {
    const history = getSessionHistory();
    history.unshift(completion);
    if (history.length > 100) history.length = 100;
    localStorage.setItem(KEYS.sessionHistory, JSON.stringify(history));
  } catch {}
}

// ─── Profile ─────────────────────────

export interface UserProfile {
  goal: string;
  daysPerWeek: number;
  equipment: string;
  createdAt: string;
}

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  } catch {}
}
